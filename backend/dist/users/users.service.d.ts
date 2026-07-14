import { PrismaService } from '../prisma/prisma.service';
export declare class UsersService {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    findAll(query?: any): Promise<{
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
        organizationId: string | null;
        branchId: string | null;
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
        organizationId: string | null;
        branchId: string | null;
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
