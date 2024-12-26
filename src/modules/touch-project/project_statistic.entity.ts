import {
  Entity,
  JoinColumn,
  OneToOne,
  Unique,
} from 'typeorm'

import { Statistics } from '~/common/entity/common.entity'

import { ProjectEntity } from './project.entity'

@Entity('project_statistic')
export class ProjectStatisticsEntity extends Statistics {
  @OneToOne(() => ProjectEntity)
  @Unique(['project_id'])
  @JoinColumn({ name: 'project_id' })
  project: ProjectEntity
}
