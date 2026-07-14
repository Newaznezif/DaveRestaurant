declare const FacebookStrategy_base: new (...args: any[]) => any;
export declare class FacebookStrategy extends FacebookStrategy_base {
    constructor();
    validate(_accessToken: string, _refreshToken: string, profile: any, done: (err: any, user: any) => void): Promise<any>;
}
export {};
