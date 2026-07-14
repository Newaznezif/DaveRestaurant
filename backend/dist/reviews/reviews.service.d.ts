export declare class ReviewsService {
    create(userId: string, data: any): Promise<{
        message: string;
    }>;
    findByProduct(productId: string): Promise<never[]>;
}
