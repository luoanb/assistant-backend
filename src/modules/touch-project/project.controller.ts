import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common'

import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'

import { ApiResult } from '~/common/decorators/api-result.decorator'
import { IdParam } from '~/common/decorators/id-param.decorator'
import { Pagination } from '~/helper/paginate/pagination'
import { Perm, definePermission } from '~/modules/auth/decorators/permission.decorator'

import { ResourceGuard } from '~/modules/auth/guards/resource.guard'

import { AuthUser } from '../auth/decorators/auth-user.decorator'

import { ProjectDto, ProjectQueryDto, ProjectUpdateDto } from './project.dto'
import { ProjectEntity } from './project.entity'

import { ProjectService } from './project.service'

export const permissions = definePermission('project', {
  LIST: 'list',
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete',
} as const)

@ApiTags('Business - Project模块')
@UseGuards(ResourceGuard)
@ApiBearerAuth()
@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) { }

  @Get()
  @ApiOperation({ summary: '获取项目列表' })
  @ApiResult({ type: [ProjectEntity] })
  @Perm(permissions.LIST)
  async list(@Query() dto: ProjectQueryDto): Promise<Pagination<ProjectEntity>> {
    return this.projectService.list(dto)
  }

  @Get(':id')
  @ApiOperation({ summary: '获取项目详情' })
  @ApiResult({ type: ProjectEntity })
  @Perm(permissions.READ)
  async detail(@IdParam() id: number): Promise<ProjectEntity> {
    return this.projectService.detail(id)
  }

  @Post()
  @ApiOperation({ summary: '创建项目' })
  @Perm(permissions.CREATE)
  async create(@Body() dto: Omit<ProjectDto, 'userId'>, @AuthUser() user: IAuthUser): Promise<ProjectEntity> {
    return this.projectService.create({ ...dto, userId: user.uid })
  }

  @Put(':id')
  @ApiOperation({ summary: '更新项目' })
  @Perm(permissions.UPDATE)
  async update(@IdParam() id: number, @Body() dto: ProjectUpdateDto, @AuthUser() user: IAuthUser): Promise<ProjectEntity> {
    // 在更新之前，检查用户是否是项目的所有者
    const project = await this.projectService.detail(id)
    if (project.user.id !== user.uid) {
      throw new HttpException('只有项目所有者才能更新项目', HttpStatus.FORBIDDEN)
    }
    return this.projectService.update(id, dto)
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除项目' })
  @Perm(permissions.DELETE)
  async delete(@IdParam() id: number, @AuthUser() user: IAuthUser): Promise<void> {
    // 在更新之前，检查用户是否是项目的所有者
    const project = await this.projectService.detail(id)
    if (project.user.id !== user.uid) {
      throw new HttpException('只有项目所有者才能更新项目', HttpStatus.FORBIDDEN)
    }
    await this.projectService.delete(id)
  }
}
