import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(): Promise<{
        data: unknown[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
            hasNextPage: boolean;
            hasPreviousPage: boolean;
        };
    }>;
    findById(id: string): Promise<{
        organization: {
            id: string;
            name: string;
        } | null;
        branch: {
            id: string;
            name: string;
        } | null;
        createdAt: Date;
        id: string;
        isActive: boolean;
        email: string;
        firstName: string | null;
        lastName: string | null;
        displayName: string | null;
        avatar: string | null;
        role: import(".prisma/client").$Enums.UserRole;
        isVerified: boolean;
    } | null>;
    update(id: string, data: any): Promise<{
        id: string;
        isActive: boolean;
        email: string;
        firstName: string | null;
        lastName: string | null;
        displayName: string | null;
        avatar: string | null;
        role: import(".prisma/client").$Enums.UserRole;
    }>;
    deactivate(id: string): Promise<{
        createdAt: Date;
        organizationId: string | null;
        branchId: string | null;
        id: string;
        isActive: boolean;
        email: string;
        phone: string | null;
        passwordHash: string;
        firstName: string | null;
        lastName: string | null;
        displayName: string | null;
        avatar: string | null;
        role: import(".prisma/client").$Enums.UserRole;
        isVerified: boolean;
        isTwoFactorEnabled: boolean;
        twoFactorSecret: string | null;
        lastLoginAt: Date | null;
        failedLoginAttempts: number;
        lockedUntil: Date | null;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        settings: import("@prisma/client/runtime/library").JsonValue | null;
        updatedAt: Date;
    }>;
    activate(id: string): Promise<{
        createdAt: Date;
        organizationId: string | null;
        branchId: string | null;
        id: string;
        isActive: boolean;
        email: string;
        phone: string | null;
        passwordHash: string;
        firstName: string | null;
        lastName: string | null;
        displayName: string | null;
        avatar: string | null;
        role: import(".prisma/client").$Enums.UserRole;
        isVerified: boolean;
        isTwoFactorEnabled: boolean;
        twoFactorSecret: string | null;
        lastLoginAt: Date | null;
        failedLoginAttempts: number;
        lockedUntil: Date | null;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        settings: import("@prisma/client/runtime/library").JsonValue | null;
        updatedAt: Date;
    }>;
}
