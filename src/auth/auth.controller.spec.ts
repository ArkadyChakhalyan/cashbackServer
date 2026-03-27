import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleAuthGuard } from './guards/google.guard';
import { YandexAuthGuard } from './guards/yandex.guard';

const mockAuthService = { login: jest.fn() };

describe('AuthController', () => {
    let controller: AuthController;

    beforeEach(async () => {
        jest.clearAllMocks();
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [{ provide: AuthService, useValue: mockAuthService }],
        })
            .overrideGuard(GoogleAuthGuard)
            .useValue({ canActivate: () => true })
            .overrideGuard(YandexAuthGuard)
            .useValue({ canActivate: () => true })
            .compile();

        controller = module.get<AuthController>(AuthController);
    });

    it('is defined', () => {
        expect(controller).toBeDefined();
    });

    describe('googleLogin', () => {
        it('is defined and returns void (guard handles redirect)', async () => {
            const result = await controller.googleLogin();
            expect(result).toBeUndefined();
        });
    });

    describe('googleLoginRedirect', () => {
        it('calls authService.login with user from request', () => {
            const user = { _id: 'user-id' };
            const req = { user } as any;
            const res = {} as any;

            controller.googleLoginRedirect(req, res);

            expect(mockAuthService.login).toHaveBeenCalledWith(user, res);
        });
    });

    describe('yandexLogin', () => {
        it('is defined and returns void (guard handles redirect)', async () => {
            const result = await controller.yandexLogin();
            expect(result).toBeUndefined();
        });
    });

    describe('yandexLoginRedirect', () => {
        it('calls authService.login with user from request', () => {
            const user = { _id: 'yandex-user-id' };
            const req = { user } as any;
            const res = {} as any;

            controller.yandexLoginRedirect(req, res);

            expect(mockAuthService.login).toHaveBeenCalledWith(user, res);
        });
    });
});
