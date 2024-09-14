import { IntersectionType, PartialType } from '@nestjs/swagger'

import { PagerDto } from '~/common/dto/pager.dto'

import { ConceptContentBase, ConceptEntityBase } from './think.entity'

export class ConceptDto extends ConceptEntityBase {
  contentData: ConceptContentBase
}

export class ConceptUpdateDto extends PartialType(ConceptDto) { }

export class ConceptQueryDto extends IntersectionType(PagerDto, ConceptDto) { }
