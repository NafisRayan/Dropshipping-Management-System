import { Controller, Get, Post, Body, UseGuards, Param, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { InventoryService } from './inventory.service';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/modules/auth/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { UserRole } from '@/common/enums/user-role.enum';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { User } from '@/modules/users/entities/user.entity';

@ApiTags('Inventory')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Get all inventory logs' })
  @ApiResponse({ status: 200, description: 'Inventory logs retrieved successfully' })
  async findAll() {
    return this.inventoryService.getInventoryLogs();
  }

  @Get('product/:productId')
  @ApiOperation({ summary: 'Get inventory logs for specific product' })
  @ApiResponse({ status: 200, description: 'Inventory logs retrieved successfully' })
  async findByProduct(@Param('productId', ParseUUIDPipe) productId: string) {
    return this.inventoryService.getInventoryLogs(productId);
  }

  @Post('adjust')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Adjust inventory quantity' })
  @ApiResponse({ status: 200, description: 'Inventory adjusted successfully' })
  async adjustInventory(
    @Body() body: { productId: string; adjustment: number; reason: string },
    @CurrentUser() user: User,
  ) {
    return this.inventoryService.adjustInventory(
      body.productId,
      body.adjustment,
      body.reason,
      user.id,
    );
  }

  @Post('receive')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Receive inventory' })
  @ApiResponse({ status: 200, description: 'Inventory received successfully' })
  async receiveInventory(
    @Body() body: { productId: string; quantity: number; referenceId?: string; notes?: string },
  ) {
    return this.inventoryService.receiveInventory(
      body.productId,
      body.quantity,
      body.referenceId,
      body.notes,
    );
  }
}