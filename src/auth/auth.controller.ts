import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common'
import { AuthService } from './auth.service'
import { Request, Response } from 'express';
import { GoogleAuthGuard } from './guards/google.guard';
import { User } from '../user/schemas/user.schema';
import { YandexAuthGuard } from './guards/yandex.guard';
import passport from 'passport';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Get('google')
    @UseGuards(GoogleAuthGuard)
    async googleLogin() {}

    @Get('google/redirect')
    @UseGuards(GoogleAuthGuard)
    googleLoginRedirect(@Req() req: Request, @Res() res: Response) {
        return this.authService.googleLogin(req.user as User, res);
    }

    @Get('yandex')
    @UseGuards(YandexAuthGuard)
    async yandexLogin() {}

    @Get('yandex/redirect')
    @UseGuards(YandexAuthGuard)
    yandexLoginRedirect(@Req() req: Request, @Res() res: Response) {
        return this.authService.googleLogin(req.user as User, res);
    }
}
