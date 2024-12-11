import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { Repository } from 'typeorm'

import { paginate } from '~/helper/paginate' // 假设您有一个分页助手函数

import { Pagination } from '~/helper/paginate/pagination' // 分页类型

import { CategoryDto, CategoryQueryDto, CategoryUpdateDto } from './category.dto' // 分类DTO
import { CategoryEntity } from './category.entity' // 分类实体

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private categoryRepository: Repository<CategoryEntity>,
  ) {}

  async list({ page, pageSize, ...其余查询条件 }: CategoryQueryDto): Promise<Pagination<CategoryEntity>> {
    return paginate(this.categoryRepository, { page, pageSize, ...其余查询条件 })
  }

  async detail(id: number): Promise<CategoryEntity> {
    const category = await this.categoryRepository.findOneBy({ id })
    if (!category) {
      throw new NotFoundException('未找到该分类')
    }
    return category
  }

  async create(dto: CategoryDto): Promise<CategoryEntity> {
    const category = this.categoryRepository.create(dto)
    await this.categoryRepository.save(category)
    return category
  }

  async update(id: number, dto: CategoryUpdateDto): Promise<CategoryEntity> {
    const category = await this.detail(id)
    this.categoryRepository.merge(category, dto)
    await this.categoryRepository.save(category)
    return category
  }

  async delete(id: number): Promise<void> {
    const category = await this.detail(id)
    await this.categoryRepository.remove(category)
  }
}
