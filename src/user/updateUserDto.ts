import { IsArray, IsBoolean, IsObject, IsOptional, IsString, ValidateNested } from 'class-validator';
import { ECashbacksView, ISettings } from 'cashback-check-types';
import { Type } from 'class-transformer';

export class UpdateUserDto {
    @IsOptional()
    @IsString()
    readonly cashbacksView?: ECashbacksView;

    @IsOptional()
    @IsArray()
    readonly seenStories?: number[];

    @IsOptional()
    @ValidateNested()
    @Type(() => SettingsDto)
    readonly settings?: ISettings;
}

export class SettingsDto {
    @IsOptional()
    @IsBoolean()
    isHideStories?: boolean;

    @IsOptional()
    @IsBoolean()
    isHideAddCard?: boolean;
}
