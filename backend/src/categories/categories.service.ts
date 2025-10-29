import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: { name: string; description?: string }): Promise<Category> {
    const category = this.categoryRepository.create(createCategoryDto);
    return this.categoryRepository.save(category);
  }

  async findAll(): Promise<Category[]> {
    return this.categoryRepository.find({ relations: ['products'] });
  }

  async findOne(id: number): Promise<Category | null> {
    return this.categoryRepository.findOne({ where: { id }, relations: ['products'] });
  }

  async update(id: number, updateCategoryDto: Partial<{ name: string; description?: string }>): Promise<Category | null> {
    await this.categoryRepository.update(id, updateCategoryDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.categoryRepository.delete(id);
  }
}