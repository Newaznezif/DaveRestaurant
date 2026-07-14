declare const GithubStrategy_base: new (...args: any[]) => any;
export declare class GithubStrategy extends GithubStrategy_base {
    constructor();
    validate(_accessToken: string, _refreshToken: string, profile: any, done: (err: any, user: any) => void): Promise<any>;
}
export {};
