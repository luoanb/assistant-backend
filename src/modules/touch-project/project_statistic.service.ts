import { Injectable } from '@nestjs/common'

import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { paginate } from '~/helper/paginate'
import { Pagination } from '~/helper/paginate/pagination'

import { LikeObjectProts } from '~/utils/sql_query.util'

import { ProjectQueryDto } from './project.dto'
import { ProjectEntity } from './project.entity'
import { ProjectStatisticsEntity } from './project_statistic.entity'

@Injectable()
export class ProjectStatisticsService {
  constructor(

    @InjectRepository(ProjectEntity)
    private projectRepository: Repository<ProjectEntity>,
    @InjectRepository(ProjectStatisticsEntity)
    private projectStatisticsRepository: Repository<ProjectStatisticsEntity>,
  ) { }

  /**
   * 阅读量添加
   * @param projectId
   */
  async incrementViewCount(projectId: number): Promise<ProjectStatisticsEntity> {
    let statistics = await this.projectStatisticsRepository.findOneBy({ project: { id: projectId } })
    if (statistics) {
      statistics.viewCount++
    }
    else {
      const project = await this.projectRepository.findOneBy({ id: projectId })
      statistics = this.projectStatisticsRepository.create({ project, viewCount: 1, collectionCount: 0 })
    }
    return await this.projectStatisticsRepository.save(statistics)
  }

  /**
   * 收藏量添加
   * @param projectId
   */
  async incrementCollectionCount(projectId: number): Promise<ProjectStatisticsEntity> {
    let statistics = await this.projectStatisticsRepository.findOneBy({ project: { id: projectId } })
    if (statistics) {
      statistics.collectionCount++
    }
    else {
      const project = await this.projectRepository.findOneBy({ id: projectId })
      statistics = this.projectStatisticsRepository.create({ project, viewCount: 0, collectionCount: 1 })
    }
    return await this.projectStatisticsRepository.save(statistics)
  }

  /**
   * 获取列表
   * @param param
   * @returns
   */
  async list({ page, pageSize, ...other }: ProjectQueryDto): Promise<Pagination<ProjectStatisticsEntity>> {
    return paginate(this.projectStatisticsRepository
      .createQueryBuilder('project_statistic')
      .leftJoinAndSelect('project_statistic.project', 'project')
      .leftJoinAndSelect('project.user', 'user')
      .where({
        ...LikeObjectProts({ id: other.userId }, ['id'], 'usler.'),
        ...LikeObjectProts(other, ['name', 'category'], 'project.'),
      }), { page, pageSize }) // 假设您的paginate函数接受仓库和查询DTO
  }
}
