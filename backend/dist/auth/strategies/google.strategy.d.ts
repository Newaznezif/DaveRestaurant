import { AuthService } from '../services/auth.service';
declare const GoogleStrategy_base: new (...args: any[]) => any;
export declare class GoogleStrategy extends GoogleStrategy_base {
    private readonly authService;
    constructor(authService: AuthService);
    validate(accessToken: string, refreshToken: string, profile: any, done: (err: any, user?: any) => void): Promise<void>;
}
export {};
