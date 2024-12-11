import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common'

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'

import { ResourceGuard } from '../auth/guards/resource.guard'

import { CategoryDto, CategoryQueryDto, CategoryUpdateDto } from './category.dto'
import { CategoryService } from './category.service'

@ApiTags('Business - 项目分类')
@UseGuards(ResourceGuard)
@ApiBearerAuth()
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) { }

  @Get()
  async list(@Query() queryDto: CategoryQueryDto): Promise<any> {
    return this.categoryService.list(queryDto)
  }

  @Get(':id')
  async detail(@Param('id') id: number): Promise<any> {
    return this.categoryService.detail(id)
  }

  @Post()
  async create(@Body() dto: CategoryDto): Promise<any> {
    return this.categoryService.create(dto)
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() dto: CategoryUpdateDto): Promise<any> {
    return this.categoryService.update(id, dto)
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    return this.categoryService.delete(id)
  }
}
