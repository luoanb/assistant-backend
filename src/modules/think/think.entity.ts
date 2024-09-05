import { ApiProperty } from '@nestjs/swagger'
import { Column, Entity, PrimaryColumn } from 'typeorm'

@Entity('concept')
export class ConceptEntity {
  @PrimaryColumn()
  id: string

  @Column()
  @ApiProperty({ description: '父键: 存储概念名称' })
  parent: string

  @Column()
  @ApiProperty({ description: '排序' })
  seq: string

  @Column()
  @ApiProperty({ description: '关系类型, 向后继节点衍生,直到定义了新的lineType' })
  lineType: string

  /**
   * 附加关系: 用于冗余非父子关系以外的其他关系
   * @example ```
   * "关系1:Target1","关系2:Target2","关系3:Target3"
   * ```
   */
  @Column()
  @ApiProperty({ description: '附加关系: 用于冗余非父子关系以外的其他关系' })
  relations: string

  @Column()
  @ApiProperty({ description: '"普通描述" | "(父=>自)关系,(自=>父)关系"' })
  lineDesc: string

  @Column()
  @ApiProperty({ description: '概念名称' })
  name: string

  @Column()
  @ApiProperty({ description: '唯一标识符' })
  unique: string

  @Column()
  @ApiProperty({ description: '内容唯一键(和主键区分开,主键变化很快)' })
  contentKey: string

  @Column()
  @ApiProperty({ description: '简述' })
  description: string

  @ApiProperty({ description: '子键:双链,方便查询' })
  @Column()
  childrenString: string

  @ApiProperty({ description: '可执行' })
  @Column()
  executable: boolean
}

@Entity('concept_centent')
export class ConceptContentEntity {
  @PrimaryColumn()
  key: string

  /**
   * 完整描述
   */
  @Column()
  @ApiProperty({ description: '完整描述' })
  content: string

  @Column()
  @ApiProperty({ description: '执行的描述' })
  execut: string
}
