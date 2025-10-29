import { Controller, Post, Param, Body, UseGuards } from '@nestjs/common';
import { SupplierSyncService } from './supplier-sync.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('supplier-sync')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('Admin')
export class SupplierSyncController {
  constructor(private readonly supplierSyncService: SupplierSyncService) {}

  @Post('sync/:supplierId')
  async syncProductsFromSupplier(@Param('supplierId') supplierId: number) {
    await this.supplierSyncService.syncProductsFromSupplier(supplierId);
    return { message: 'Sync completed successfully' };
  }

  @Post('sync-all')
  async syncAllSuppliers() {
    await this.supplierSyncService.syncAllSuppliers();
    return { message: 'All suppliers synced successfully' };
  }
}