import { ApiProperty, IntersectionType, PartialType } from '@nestjs/swagger'

import { IsString } from 'class-validator'

import { PagerDto } from '~/common/dto/pager.dto'

export class CategoryDto {
  @ApiProperty({ description: '分类名称' })
  @IsString()
  name: string

  @ApiProperty({ description: '分类描述' })
  @IsString()
  description?: string
}

export class CategoryUpdateDto extends PartialType(CategoryDto) { }

export class CategoryQueryDto extends IntersectionType(PagerDto, CategoryDto) { }
