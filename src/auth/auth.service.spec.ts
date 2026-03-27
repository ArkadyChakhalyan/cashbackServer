import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';

describe('AuthService', () => {
    let service: AuthService;
    let jwtService: jest.Mocked<JwtService>;
    let configService: jest.Mocked<ConfigService>;

    const mockRes = () => {
        const res: any = {};
        res.type = jest.fn().mockReturnValue(res);
        res.send = jest.fn().mockReturnValue(res);
        res.status = jest.fn().mockReturnValue(res);
        return res;
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: JwtService,
                    useValue: { sign: jest.fn().mockReturnValue('mock-jwt-token') },
                },
                {
                    provide: ConfigService,
                    useValue: { get: jest.fn().mockReturnValue('http://localhost:3000') },
                },
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
        jwtService = module.get(JwtService);
        configService = module.get(ConfigService);
    });

    it('is defined', () => {
        expect(service).toBeDefined();
    });

    describe('login', () => {
        it('generates a JWT token and sends postMessage script', async () => {
            const user = { _id: 'user-id-123' } as any;
            const res = mockRes();

            await service.login(user, res);

            expect(jwtService.sign).toHaveBeenCalledWith({ userId: 'user-id-123' });
            expect(configService.get).toHaveBeenCalledWith('CLIENT_URL');
            expect(res.type).toHaveBeenCalledWith('text/html');
            const sentHtml: string = res.send.mock.calls[0][0];
            expect(sentHtml).toContain('mock-jwt-token');
            expect(sentHtml).toContain('http://localhost:3000');
            expect(sentHtml).toContain('postMessage');
            expect(sentHtml).toContain('window.close');
        });

        it('returns 500 when user is null', async () => {
            const res = mockRes();

            await service.login(null, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith('Internal Server Error');
        });

        it('returns 500 when jwtService.sign throws', async () => {
            jwtService.sign.mockImplementation(() => {
                throw new Error('JWT error');
            });
            const user = { _id: 'user-id-123' } as any;
            const res = mockRes();

            await service.login(user, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith('Internal Server Error');
        });
    });
});
