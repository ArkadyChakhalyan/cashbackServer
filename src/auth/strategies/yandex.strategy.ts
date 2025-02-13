import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { UserService } from '../../user/user.service';
import { Strategy, Profile } from 'passport-yandex';

@Injectable()
export class YandexStrategy extends PassportStrategy(Strategy, 'yandex') {
    constructor(
        private readonly userService: UserService,
    ) {
        super({
            clientID: process.env.YANDEX_CLIENT_ID,
            clientSecret: process.env.YANDEX_CLIENT_SECRET,
            callbackURL: `${process.env.URL}/auth/yandex/redirect`,
            authorizationURL: `https://oauth.yandex.com/authorize?force_confirm=1`,
        })
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: Profile,
        done: (error: string | null, user: any) => void,
    ): Promise<any> {
        const { displayName, emails, photos, id } = profile;
        const email = emails && emails[0].value || id;
        let user = await this.userService.findUserByEmail(email);
        if (!user) {
            user = await this.userService.create({
                email,
                name: displayName,
                picture: photos[0].value,
            });
            await user.save();
        }

        return done(null, user);
    }
}
