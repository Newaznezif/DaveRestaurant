export interface AuthenticatedUser {
    id: string;
    email: string;
    role: string;
    organizationId?: string;
    branchId?: string;
    isVerified: boolean;
    isTwoFactorEnabled: boolean;
}
export declare const CurrentUser: (...dataOrPipes: (import("@nestjs/common").PipeTransform<any, any> | import("@nestjs/common").Type<import("@nestjs/common").PipeTransform<any, any>> | keyof AuthenticatedUser | undefined)[]) => ParameterDecorator;
