import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20'
import { UserService } from '../../user/user.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(
        private readonly userService: UserService,
    ) {
        super({
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: `${process.env.URL}/auth/google/redirect`,
            scope: ['email', 'profile'],
        })
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: Profile,
        done: VerifyCallback,
    ): Promise<any> {
        const { displayName, emails, photos } = profile;
        let user = await this.userService.findUserByEmail(emails[0].value);
        if (!user) {
            user = await this.userService.create({
                email: emails[0].value,
                name: displayName,
                picture: photos[0].value,
            });
            await user.save();
        }

        return done(null, user);
    }
}
