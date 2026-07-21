import { PrismaService } from '../prisma/prisma.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { SupplierStatus } from '@prisma/client';
export declare class SuppliersService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(orgId: string): Promise<({
        _count: {
            purchaseOrders: number;
        };
    } & {
        createdAt: Date;
        organizationId: string;
        id: string;
        name: string;
        email: string | null;
        phone: string | null;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        updatedAt: Date;
        address: string | null;
        city: string | null;
        state: string | null;
        country: string | null;
        postalCode: string | null;
        taxId: string | null;
        notes: string | null;
        status: import(".prisma/client").$Enums.SupplierStatus;
        contactName: string | null;
        paymentTerms: string | null;
        rating: number | null;
    })[]>;
    findOne(orgId: string, id: string): Promise<{
        _count: {
            purchaseOrders: number;
        };
        purchaseOrders: {
            createdAt: Date;
            id: string;
            orderNumber: string;
            status: string;
            totalAmount: number;
        }[];
    } & {
        createdAt: Date;
        organizationId: string;
        id: string;
        name: string;
        email: string | null;
        phone: string | null;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        updatedAt: Date;
        address: string | null;
        city: string | null;
        state: string | null;
        country: string | null;
        postalCode: string | null;
        taxId: string | null;
        notes: string | null;
        status: import(".prisma/client").$Enums.SupplierStatus;
        contactName: string | null;
        paymentTerms: string | null;
        rating: number | null;
    }>;
    create(orgId: string, dto: CreateSupplierDto): Promise<{
        createdAt: Date;
        organizationId: string;
        id: string;
        name: string;
        email: string | null;
        phone: string | null;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        updatedAt: Date;
        address: string | null;
        city: string | null;
        state: string | null;
        country: string | null;
        postalCode: string | null;
        taxId: string | null;
        notes: string | null;
        status: import(".prisma/client").$Enums.SupplierStatus;
        contactName: string | null;
        paymentTerms: string | null;
        rating: number | null;
    }>;
    update(orgId: string, id: string, dto: UpdateSupplierDto): Promise<{
        createdAt: Date;
        organizationId: string;
        id: string;
        name: string;
        email: string | null;
        phone: string | null;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        updatedAt: Date;
        address: string | null;
        city: string | null;
        state: string | null;
        country: string | null;
        postalCode: string | null;
        taxId: string | null;
        notes: string | null;
        status: import(".prisma/client").$Enums.SupplierStatus;
        contactName: string | null;
        paymentTerms: string | null;
        rating: number | null;
    }>;
    updateStatus(orgId: string, id: string, status: SupplierStatus): Promise<{
        createdAt: Date;
        organizationId: string;
        id: string;
        name: string;
        email: string | null;
        phone: string | null;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        updatedAt: Date;
        address: string | null;
        city: string | null;
        state: string | null;
        country: string | null;
        postalCode: string | null;
        taxId: string | null;
        notes: string | null;
        status: import(".prisma/client").$Enums.SupplierStatus;
        contactName: string | null;
        paymentTerms: string | null;
        rating: number | null;
    }>;
    remove(orgId: string, id: string): Promise<{
        success: boolean;
        archived: boolean;
        message: string;
    } | {
        success: boolean;
        archived: boolean;
        message?: undefined;
    }>;
}
