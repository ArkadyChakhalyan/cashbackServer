import { Body, Controller, Delete, Get, Put, Req, UnauthorizedException, UseGuards } from '@nestjs/common'
import { UserService } from './user.service'
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { Request } from 'express';
import { getTransformedUser } from './utils/getTransformedUser';
import { UpdateUserDto } from './updateUserDto';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get('me')
    async getProfile(@Req() req: Request) {
        //@ts-ignore
        const userId = req.user?.userId;
        if (!userId) {
            throw new UnauthorizedException();
        }
        const user = await this.userService.findById(userId);
        return getTransformedUser(user);
    }

    @Put('me')
    async updateProfile(
        @Req() req: Request,
        @Body() updateUserDto: UpdateUserDto,
    ) {
        //@ts-ignore
        const userId = req.user?.userId;
        if (!userId) {
            throw new UnauthorizedException();
        }
        const user = await this.userService.update(userId, updateUserDto);
        return getTransformedUser(user);
    }

    @Delete('me')
    async deleteProfile(@Req() req: Request) {
        //@ts-ignore
        const userId = req.user?.userId;
        if (!userId) {
            throw new UnauthorizedException();
        }
        return await this.userService.delete(userId);
    }
}
