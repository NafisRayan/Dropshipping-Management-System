import { Controller, Post, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { DemoDataService } from './demo-data.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';

@ApiTags('seeder')
@Controller('seeder')
export class SeederController {
  constructor(
    private readonly demoDataService: DemoDataService,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  @Post('seed-demo-data')
  @ApiOperation({ summary: 'Seed demo data' })
  async seedDemoData() {
    try {
      await this.demoDataService.seedDemoData();
      return { message: 'Demo data seeded successfully!' };
    } catch (error) {
      return { message: 'Error seeding demo data', error: error.message };
    }
  }

  @Get('check-demo-data')
  @ApiOperation({ summary: 'Check if demo data exists' })
  async checkDemoData() {
    const userCount = await this.usersRepository.count();
    const demoUser = await this.usersRepository.findOne({ 
      where: { email: 'demo@example.com' } 
    });
    
    return {
      userCount,
      demoUserExists: !!demoUser,
      message: userCount === 0 ? 'No data found' : 'Data exists',
    };
  }
}