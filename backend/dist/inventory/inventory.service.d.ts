import { PrismaService } from '../prisma/prisma.service';
import { CreateInventoryItemDto } from './dto/create-inventory-item.dto';
import { UpdateInventoryItemDto } from './dto/update-inventory-item.dto';
import { StockMovementDto } from './dto/stock-movement.dto';
export declare class InventoryService {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    findAll(organizationId: string, branchId?: string): Promise<({
        branch: {
            id: string;
            name: string;
        };
    } & {
        createdAt: Date;
        organizationId: string;
        branchId: string;
        id: string;
        name: string;
        isActive: boolean;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        updatedAt: Date;
        image: string | null;
        notes: string | null;
        sku: string | null;
        barcode: string | null;
        costPrice: number;
        category: string | null;
        quantity: number;
        unit: string;
        minQuantity: number;
        maxQuantity: number | null;
        sellingPrice: number | null;
        expiryDate: Date | null;
    })[]>;
    findOne(orgId: string, id: string): Promise<{
        branch: {
            id: string;
            name: string;
        };
        movements: {
            createdAt: Date;
            id: string;
            userId: string | null;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
            type: import(".prisma/client").$Enums.StockMovementType;
            notes: string | null;
            quantity: number;
            reference: string | null;
            beforeQuantity: number;
            afterQuantity: number;
            inventoryId: string;
        }[];
    } & {
        createdAt: Date;
        organizationId: string;
        branchId: string;
        id: string;
        name: string;
        isActive: boolean;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        updatedAt: Date;
        image: string | null;
        notes: string | null;
        sku: string | null;
        barcode: string | null;
        costPrice: number;
        category: string | null;
        quantity: number;
        unit: string;
        minQuantity: number;
        maxQuantity: number | null;
        sellingPrice: number | null;
        expiryDate: Date | null;
    }>;
    create(orgId: string, dto: CreateInventoryItemDto): Promise<{
        createdAt: Date;
        organizationId: string;
        branchId: string;
        id: string;
        name: string;
        isActive: boolean;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        updatedAt: Date;
        image: string | null;
        notes: string | null;
        sku: string | null;
        barcode: string | null;
        costPrice: number;
        category: string | null;
        quantity: number;
        unit: string;
        minQuantity: number;
        maxQuantity: number | null;
        sellingPrice: number | null;
        expiryDate: Date | null;
    }>;
    update(orgId: string, id: string, dto: UpdateInventoryItemDto): Promise<{
        createdAt: Date;
        organizationId: string;
        branchId: string;
        id: string;
        name: string;
        isActive: boolean;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        updatedAt: Date;
        image: string | null;
        notes: string | null;
        sku: string | null;
        barcode: string | null;
        costPrice: number;
        category: string | null;
        quantity: number;
        unit: string;
        minQuantity: number;
        maxQuantity: number | null;
        sellingPrice: number | null;
        expiryDate: Date | null;
    }>;
    remove(orgId: string, id: string): Promise<{
        success: boolean;
    }>;
    recordMovement(orgId: string, itemId: string, dto: StockMovementDto, userId?: string): Promise<{
        item: {
            quantity: number;
            branch: {
                id: string;
                name: string;
            };
            movements: {
                createdAt: Date;
                id: string;
                userId: string | null;
                metadata: import("@prisma/client/runtime/library").JsonValue | null;
                type: import(".prisma/client").$Enums.StockMovementType;
                notes: string | null;
                quantity: number;
                reference: string | null;
                beforeQuantity: number;
                afterQuantity: number;
                inventoryId: string;
            }[];
            createdAt: Date;
            organizationId: string;
            branchId: string;
            id: string;
            name: string;
            isActive: boolean;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
            updatedAt: Date;
            image: string | null;
            notes: string | null;
            sku: string | null;
            barcode: string | null;
            costPrice: number;
            category: string | null;
            unit: string;
            minQuantity: number;
            maxQuantity: number | null;
            sellingPrice: number | null;
            expiryDate: Date | null;
        };
        movement: {
            createdAt: Date;
            id: string;
            userId: string | null;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
            type: import(".prisma/client").$Enums.StockMovementType;
            notes: string | null;
            quantity: number;
            reference: string | null;
            beforeQuantity: number;
            afterQuantity: number;
            inventoryId: string;
        };
        isLowStock: boolean;
    }>;
    getMovements(orgId: string, itemId: string): Promise<{
        createdAt: Date;
        id: string;
        userId: string | null;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        type: import(".prisma/client").$Enums.StockMovementType;
        notes: string | null;
        quantity: number;
        reference: string | null;
        beforeQuantity: number;
        afterQuantity: number;
        inventoryId: string;
    }[]>;
    findLowStock(organizationId: string, branchId?: string): Promise<{
        branch: {
            name: string;
        };
        branchId: string;
        id: string;
        name: string;
        sku: string | null;
        category: string | null;
        quantity: number;
        unit: string;
        minQuantity: number;
    }[]>;
}
