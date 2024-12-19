import { Body, Controller, Delete, Get, Put, Req, Res, UseGuards } from '@nestjs/common'
import { UserService } from './user.service'
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { Request, Response } from 'express';
import { getTransformedUser } from './utils/getTransformedUser';
import { UpdateUserDto } from './updateUserDto';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get('me')
    async getProfile(@Req() req: Request, @Res() res: Response) {
        //@ts-ignore
        const userId = req.user?.userId;
        if (!userId) {
            return { error: 'CryptoDonations not authenticated' };
        }
        const user = await this.userService.findById(userId);
        return res.json(getTransformedUser(user));
    }

    @Put('me')
    async updateProfile(
        @Req() req: Request,
        @Res() res: Response,
        @Body() updateUserDto: Partial<UpdateUserDto>,
    ) {
        //@ts-ignore
        const userId = req.user?.userId;
        if (!userId) {
            return { error: 'CryptoDonations not authenticated' };
        }
        const user = await this.userService.update(userId, updateUserDto);
        return res.json(getTransformedUser(user));
    }

    @Delete('me')
    async deleteProfile(@Req() req: Request) {
        //@ts-ignore
        const userId = req.user?.userId;
        if (!userId) {
            return { error: 'CryptoDonations not authenticated' };
        }
        return await this.userService.delete(userId);
    }
}
