import { IsString } from 'class-validator';
import { ECashbacksView } from 'cashback-check-types/user';

export class UpdateUserDto {
    @IsString()
    readonly cashbacksView?: ECashbacksView;
}
