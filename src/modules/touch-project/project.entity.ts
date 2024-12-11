import { ApiProperty } from '@nestjs/swagger'
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  Relation,
} from 'typeorm'

import { CommonEntity } from '~/common/entity/common.entity'

import { UserEntity } from '../user/user.entity'

@Entity('touch-project')
export class ProjectEntity extends CommonEntity {
  @Column()
  @ApiProperty({ description: '屏幕宽度' })
  width: number

  @Column()
  @ApiProperty({ description: '屏幕高度' })
  height: number

  @Column()
  @ApiProperty({ description: '分类（标签）' })
  category: string // 假设分类只是一个字符串标识符

  @Column()
  @ApiProperty({ description: '名称' })
  name: string

  @Column()
  @ApiProperty({ description: '内容' })
  content: string

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  user: Relation<UserEntity>
}
