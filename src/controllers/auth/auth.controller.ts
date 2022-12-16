import { Controller, Get, Res, Req } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {};

    @Get('google')
    createGoogleAuth(@Req() req:any, @Res() res:any) {
        return this.authService.createGoogleAuth(req, res);
    }

    @Get('google/url')
    getGoogleAuthURL(@Req() req:any, @Res() res:any) {
        return this.authService.getGoogleAuthURL(req, res);
    }

    @Get('@me')
    getGoogleInformation(@Req() req:any, @Res() res:any) {
        return this.authService.getGoogleInformation(req, res);
    }
}