import { ReportsService } from './reports.service';
export declare class ReportsController {
    private readonly reportsService;
    constructor(reportsService: ReportsService);
    getSalesReport(orgId: string, orgIdParam: string): Promise<never[]>;
}
