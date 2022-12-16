import { Injectable } from '@nestjs/common';
import { InternalServerErrorException } from '@nestjs/common';
import axios from 'axios';
import * as querystring from 'querystring';
import * as jwt from 'jsonwebtoken';
import { application, google } from '../../../config.json';

@Injectable()
export class AuthService {
    async createGoogleAuth(req:any, res:any) {
        async function getTokens({
            code,
            clientId,
            clientSecret,
            redirectUri
        }: {
            code: string,
            clientId: string,
            clientSecret: string,
            redirectUri: string
        }): Promise<{
            access_token: string;
            expires_in: Number,
            refresh_token: string,
            scope: string,
            id_token: string
        }> {
            const url = "https://oauth2.googleapis.com/token";

            const values = {
                code,
                client_id: clientId,
                client_secret: clientSecret,
                redirect_uri: redirectUri,
                grant_type: "authorization_code"
            }

            return axios.post(url, querystring.stringify(values), {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            }).then((res) => res.data).catch((error) => {
                throw new InternalServerErrorException(error.message);
            });
        };

        const code = req.query.code;

        const { id_token, access_token } = await getTokens({
            code,
            clientId: google.client_id,
            clientSecret: google.client_secret,
            redirectUri: `http://localhost:${application.port}/auth/google`
        });

        const googleUser = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`, {
            headers: {
                Authorization: `Bearer ${id_token}`,
            },
        }).then((res) => res.data).catch((error) => {
            throw new InternalServerErrorException(error.message);
        });

        const token = jwt.sign(googleUser, google.client_secret);

        res.cookie('google_token', token, {
            maxAge: 900000,
            httpOnly: true,
            secure: false
        });

        return res.redirect('/');
    }

    async getGoogleAuthURL(req:any, res:any) {
        function getGoogleAuthUrl() {
            const rootURL = "https://accounts.google.com/o/oauth2/v2/auth";

            const options = {
                redirect_uri: `http://localhost:${application.port}/auth/google`,
                client_id: google.client_id,
                access_type: "offline",
                response_type: "code",
                prompt: "consent",
                scope: [
                    "https://www.googleapis.com/auth/userinfo.profile",
                    "https://www.googleapis.com/auth/userinfo.email",
                ].join(" "),
            }

            return `${rootURL}?${querystring.stringify(options)}`;
        }

        return res.send(getGoogleAuthUrl());
    }

    async getGoogleInformation(req:any, res:any) {
        try {
            const decoded = jwt.verify(req.cookies['google_token'], google.client_secret);

            return res.status(200).send(decoded);
        } catch(err) {
            throw new InternalServerErrorException(err);
        }
    }
}