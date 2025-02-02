import { Injectable } from '@nestjs/common'
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { UpdateUserDto } from './updateUserDto';
import { CashbackService } from '../cashback/cashback.service';
import { TUserId } from 'cashback-check-types';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        private readonly cashbackService: CashbackService,
    ) {}

    async findById(id: TUserId): Promise<User> {
        return this.userModel.findById(id).exec();
    }

    async findUserByEmail(email: string): Promise<User> {
        return this.userModel.findOne({ email }).exec();
    }

    async create(user: Partial<User>): Promise<User> {
        const newUser = new this.userModel(user);
        return newUser.save();
    }

    async update(userId: TUserId, updateUserDto: UpdateUserDto): Promise<User> {
        return this.userModel.findByIdAndUpdate(userId, updateUserDto, {
            new: true,
        }).exec();
    }

    async delete(userId: TUserId): Promise<User> {
        await this.cashbackService.findAllAndDelete(userId);
        return this.userModel.findByIdAndDelete(userId).exec();
    }
}
