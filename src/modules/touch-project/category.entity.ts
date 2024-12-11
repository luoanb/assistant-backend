import { ApiProperty } from '@nestjs/swagger'
import {
  Column,
  Entity,
} from 'typeorm'

import { CommonEntity } from '~/common/entity/common.entity'

@Entity('categories')
export class CategoryEntity extends CommonEntity {
  @Column()
  @ApiProperty({ description: '分类名称' })
  name: string
}
