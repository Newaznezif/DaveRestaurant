import { ReviewsService } from './reviews.service';
export declare class ReviewsController {
    private readonly reviewsService;
    constructor(reviewsService: ReviewsService);
    create(userId: string, data: any): Promise<{
        message: string;
    }>;
    findByProduct(productId: string): Promise<never[]>;
}
