import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { paginate } from '~/helper/paginate' // 假设您有一个分页助手函数

import { Pagination } from '~/helper/paginate/pagination' // 分页类型

import { ProjectDto, ProjectQueryDto, ProjectUpdateDto } from './project.dto' // 项目DTO

import { ProjectEntity } from './project.entity' // 项目实体

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(ProjectEntity)
    private projectRepository: Repository<ProjectEntity>,
  ) { }

  async list({ page, pageSize }: ProjectQueryDto): Promise<Pagination<ProjectEntity>> {
    return paginate(this.projectRepository, { page, pageSize }) // 假设您的paginate函数接受仓库和查询DTO
  }

  async detail(id: number): Promise<ProjectEntity> {
    const project = await this.projectRepository.findOneBy({ id })
    if (!project) {
      throw new NotFoundException('未找到该项目')
    }
    return project
  }

  async create(dto: ProjectDto): Promise<ProjectEntity> {
    const project = this.projectRepository.create(dto)
    await this.projectRepository.save(project)
    return project
  }

  async update(id: number, dto: ProjectUpdateDto): Promise<ProjectEntity> {
    const project = await this.detail(id)
    this.projectRepository.merge(project, dto) // 使用merge方法来应用更新
    await this.projectRepository.save(project)
    return project
  }

  async delete(id: number): Promise<void> {
    const project = await this.detail(id)
    await this.projectRepository.remove(project)
  }
}
