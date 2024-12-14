import { ApiProperty, IntersectionType, PartialType } from '@nestjs/swagger'

import { IsNumber, IsString } from 'class-validator'

import { PagerDto } from '~/common/dto/pager.dto'

export class ProjectDto {
  @ApiProperty({ description: '分类（标签）' })
  @IsString()
  category: string

  @ApiProperty({ description: '名称' })
  @IsString()
  name: string

  @ApiProperty({ description: '内容' })
  @IsString()
  content: string

  @ApiProperty({ description: '用户ID' })
  @IsNumber()
  userId: number
}

export class ProjectUpdateDto extends PartialType(ProjectDto) { }

export class ProjectQueryDto extends IntersectionType(PagerDto, ProjectDto) { }
