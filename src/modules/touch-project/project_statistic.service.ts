import { Injectable } from '@nestjs/common'

import { InjectRepository } from '@nestjs/typeorm'
import { FindOptionsOrder, Repository } from 'typeorm'

import { resolveOptions } from '~/helper/paginate'
import { createPaginationObject } from '~/helper/paginate/create-pagination'
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
  async list({ page: pageIndex, pageSize, ...other }: ProjectQueryDto): Promise<Pagination<ProjectStatisticsEntity>> {
    const newsOrder: FindOptionsOrder<ProjectStatisticsEntity> = {
      project: {
        updatedAt: other.order || 'DESC',
      },
    }
    const hotOrder: FindOptionsOrder<ProjectStatisticsEntity> = {
      viewCount: other.order || 'DESC',
    }
    const [page, limit] = resolveOptions({ page: pageIndex, pageSize })
    const [items, total] = await this.projectStatisticsRepository.findAndCount({
      skip: limit * (page - 1),
      take: limit,
      relations: ['project', 'project.user'],

      where: {
        project: {
          ...LikeObjectProts(other, ['name', 'category']),
          user: {
            ...LikeObjectProts({ id: other.userId }, ['id']),
          },
        },
      },
      order: other.isNews ? newsOrder : hotOrder,
    })
    return createPaginationObject<ProjectStatisticsEntity>({
      items,
      totalItems: total,
      currentPage: page,
      limit,
    })
  }
}
