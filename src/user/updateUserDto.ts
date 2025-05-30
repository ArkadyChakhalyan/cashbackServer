import { IsArray, IsString } from 'class-validator';
import { ECashbacksView } from 'cashback-check-types';

export class UpdateUserDto {
    @IsString()
    readonly cashbacksView?: ECashbacksView;

    @IsArray()
    readonly seenStories?: number[];
}
