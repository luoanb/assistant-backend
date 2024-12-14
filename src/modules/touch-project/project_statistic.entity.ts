import {
  Entity,
  OneToOne,
} from 'typeorm'

import { Statistics } from '~/common/entity/common.entity'

import { ProjectEntity } from './project.entity'

@Entity('project_statistic')
export class ProjectStatisticsEntity extends Statistics {
  @OneToOne(() => ProjectEntity, project => project.id)
  project: ProjectEntity
}
