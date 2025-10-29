import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('reports')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Get dashboard statistics' })
  getDashboardStats() {
    return this.reportsService.getDashboardStats();
  }

  @Get('sales')
  @ApiOperation({ summary: 'Get sales report' })
  @ApiQuery({ name: 'startDate', required: false })
  @ApiQuery({ name: 'endDate', required: false })
  getSalesReport(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();
    return this.reportsService.getSalesReport(start, end);
  }

  @Get('inventory')
  @ApiOperation({ summary: 'Get inventory report' })
  getInventoryReport() {
    return this.reportsService.getInventoryReport();
  }

  @Get('suppliers')
  @ApiOperation({ summary: 'Get supplier performance report' })
  getSupplierPerformance() {
    return this.reportsService.getSupplierPerformance();
  }
}