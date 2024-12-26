import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { User } from '../user/schemas/user.schema';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
    ) {}

    async googleLogin(
        user: User,
        res: Response,
    ): Promise<any> {
        try {
            if (!user) {
                throw new Error('Authentication failed');
            }
            const jwtToken = this.jwtService.sign({ userId: user._id });
            const script = `
                <script>
                    window.opener.postMessage({ token: '${jwtToken}' }, '*');
                    window.close();
                </script>
            `;

            res.type('text/html');
            return res.send(script);
        } catch (error) {
            return res.status(500).send('Internal Server Error');
        }
    }
}
