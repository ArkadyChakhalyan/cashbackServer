import { Body, Controller, Delete, Get, Param, Post, Put, Req, Res, UseGuards, } from '@nestjs/common';
import { CashbackService } from './cashback.service';
import { CreateCashbackDto } from './createCashbackDto';
import { Request, Response } from 'express';
import { getTransformedCashback } from './utils/getTransformedCashback';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@Controller('cashback')
@UseGuards(JwtAuthGuard)
export class CashbackController {
    constructor(private readonly cashbackService: CashbackService) {}

    @Post()
    async create(
        @Body() createCashbackDto: Partial<CreateCashbackDto>,
        @Req() req: Request,
        @Res() res: Response,
    ): Promise<Response> {
        //@ts-ignore
        const userId = req.user?.userId;
        //@ts-ignore
        const cashback = await this.cashbackService.create({
            ...createCashbackDto,
            userId,
        });
        return res.json(getTransformedCashback(cashback));
    }

    @Get()
    async findAll(
        @Req() req: Request,
        @Res() res: Response,
    ): Promise<Response> {
        //@ts-ignore
        const userId = req.user?.userId;
        const cashbacks = await this.cashbackService.findAll(userId) || [];
        return res.json(cashbacks.map(getTransformedCashback));
    }

    @Put(':id')
    async update(
        @Param('id') id: string,
        @Body() updateCashbackDto: Partial<CreateCashbackDto>,
        @Res() res: Response,
    ): Promise<Response> {
        const cashback = await this.cashbackService.update(
            id,
            updateCashbackDto,
        );
        return res.json(getTransformedCashback(cashback));
    }

    @Delete(':id')
    async remove(
        @Param('id') id: string,
        @Res() res: Response,
    ): Promise<Response> {
        const cashback = await this.cashbackService.remove(id);
        return res.json(getTransformedCashback(cashback));
    }
}
