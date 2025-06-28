import { IsArray, IsBoolean, IsObject, IsString, ValidateNested } from 'class-validator';
import { ECashbacksView, ISettings } from 'cashback-check-types';
import { Type } from 'class-transformer';

export class UpdateUserDto {
    @IsString()
    readonly cashbacksView?: ECashbacksView;

    @IsArray()
    readonly seenStories?: number[];

    @ValidateNested()
    @Type(() => SettingsDto)
    readonly settings?: ISettings;
}

export class SettingsDto {
    @IsBoolean()
    isHideStories?: string;

    @IsBoolean()
    isHideAddCard?: string;
}
