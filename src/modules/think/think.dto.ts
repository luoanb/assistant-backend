import { IntersectionType, PartialType } from '@nestjs/swagger'

import { PagerDto } from '~/common/dto/pager.dto'

import { ConceptContentBase, ConceptEntityBase } from './think.entity'

export class ConceptDto extends ConceptEntityBase {
  contentData: ConceptContentBase
}

export class ConceptUpdateDto extends PartialType(ConceptDto) { }

export class ConceptQueryDto extends IntersectionType(PagerDto, ConceptDto) { }

export class ConceptTreeQueryDto {
  /**
   * 节点名称,默认根节点
   */
  name?: string
  /** 默认 4 */
  step?: number
}

export class ConceptTreeFreeQueryDto extends PagerDto { }
