import { Injectable } from '@nestjs/common'

import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { paginate } from '~/helper/paginate'
import { Pagination } from '~/helper/paginate/pagination'

import { ProjectQueryDto } from './project.dto'
import { ProjectStatisticsEntity } from './project_statistic.entity'

@Injectable()
export class ProjectStatisticsService {
  constructor(

    @InjectRepository(ProjectStatisticsEntity)
    private projectStatisticsRepository: Repository<ProjectStatisticsEntity>,
  ) { }

  /**
   * 阅读量添加
   * @param citeId
   */
  async incrementViewCount(citeId: number): Promise<ProjectStatisticsEntity> {
    let statistics = await this.projectStatisticsRepository.findOneBy({ citeId })
    if (statistics) {
      statistics.viewCount++
    }
    else {
      statistics = this.projectStatisticsRepository.create({ citeId, viewCount: 1, collectionCount: 0 })
    }
    return await this.projectStatisticsRepository.save(statistics)
  }

  /**
   * 收藏量添加
   * @param citeId
   */
  async incrementCollectionCount(citeId: number): Promise<ProjectStatisticsEntity> {
    let statistics = await this.projectStatisticsRepository.findOneBy({ citeId })
    if (statistics) {
      statistics.collectionCount++
    }
    else {
      statistics = this.projectStatisticsRepository.create({ citeId, viewCount: 0, collectionCount: 1 })
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
      .createQueryBuilder('statistics')
      .leftJoinAndSelect('statistics.project', 'touch_project')
      .where('touch_project.category LIKE :category', { category: `%${other.category}%` })
      .andWhere('touch_project.name LIKE :name', { name: `%${other.name}%` })
      .andWhere('touch_project.user_id LIKE :user_id', { user_id: `%${other.userId}%` }), { page, pageSize }) // 假设您的paginate函数接受仓库和查询DTO
  }
}
