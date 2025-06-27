import { IsArray, IsObject, IsString } from 'class-validator';
import { ECashbacksView, ISettings } from 'cashback-check-types';

export class UpdateUserDto {
    @IsString()
    readonly cashbacksView?: ECashbacksView;

    @IsArray()
    readonly seenStories?: number[];

    @IsObject()
    readonly settings?: ISettings;
}
