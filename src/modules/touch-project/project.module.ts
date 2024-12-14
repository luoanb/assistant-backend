import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { CategoryController } from './category.controller'
import { CategoryEntity } from './category.entity'
import { CategoryService } from './category.service'

import { ProjectController } from './project.controller'
import { ProjectEntity } from './project.entity'
import { ProjectService } from './project.service'
import { ProjectStatisticsEntity } from './project_statistic.entity'
import { ProjectStatisticsService } from './project_statistic.service'

const services = [ProjectService, CategoryService, ProjectStatisticsService]

@Module({
  imports: [TypeOrmModule.forFeature([ProjectEntity, CategoryEntity, ProjectStatisticsEntity])],
  controllers: [ProjectController, CategoryController],
  providers: [...services],
  exports: [TypeOrmModule, ...services],
})
export class ProjectModule { }
