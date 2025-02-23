import { Body, Controller, Delete, Get, Param, Post, Put, Req, Res, UseGuards, } from '@nestjs/common';
import { CardService } from './card.service';
import { CreateCardDto } from './createCardDto';
import { Request, Response } from 'express';
import { getTransformedCard } from './utils/getTransformedCard';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { EBank } from 'cashback-check-types';

@Controller('card')
@UseGuards(JwtAuthGuard)
export class CardController {
    constructor(private readonly cardsService: CardService) {}

    @Post()
    async create(
        @Body() createCardDto: Partial<CreateCardDto>,
        @Req() req: Request,
        @Res() res: Response,
    ): Promise<Response> {
        //@ts-ignore
        const userId = req.user?.userId;
        //@ts-ignore
        const card = await this.cardsService.create({
            ...createCardDto,
            userId,
        });
        return res.json(getTransformedCard(card));
    }

    @Get()
    async findAll(
        @Req() req: Request,
        @Res() res: Response,
    ): Promise<Response> {
        //@ts-ignore
        const userId = req.user?.userId;
        const cards = await this.cardsService.findAll(userId) || [];
        return res.json(cards.map(getTransformedCard));
    }

    @Put(':name/:bank')
    async update(
        @Param('name') name: string,
        @Param('bank') bank: EBank,
        @Body() updateCardDto: CreateCardDto,
        @Req() req: Request,
        @Res() res: Response,
    ): Promise<Response> {
        //@ts-ignore
        const userId = req.user?.userId;
        const card = await this.cardsService.update(
            userId,
            name,
            bank,
            updateCardDto,
        );
        return res.json(getTransformedCard(card));
    }

    @Delete(':name/:bank')
    async remove(
        @Param('name') name: string,
        @Param('bank') bank: EBank,
        @Req() req: Request,
        @Res() res: Response,
    ): Promise<Response> {
        //@ts-ignore
        const userId = req.user?.userId;
        const card = await this.cardsService.remove(userId, name, bank);
        return res.json(getTransformedCard(card));
    }
}
