import { ApiProperty, IntersectionType, PartialType } from '@nestjs/swagger'

import { IsNumber, IsOptional, IsString } from 'class-validator'

import { PagerDto } from '~/common/dto/pager.dto'

export class ProjectCreateDto {
  @ApiProperty({ description: '分类（标签）' })
  @IsString()
  @IsOptional()
  category: string

  @ApiProperty({ description: '名称' })
  @IsString()
  @IsOptional()
  name: string

  @ApiProperty({ description: '内容' })
  @IsString()
  @IsOptional()
  content: string
}

export class ProjectDto extends ProjectCreateDto {
  @ApiProperty({ description: '用户ID' })
  @IsNumber()
  @IsOptional()
  userId: number
}

export class ProjectUpdateDto extends PartialType(ProjectDto) { }

export class ProjectQueryDto extends IntersectionType(PagerDto, ProjectDto) { }
