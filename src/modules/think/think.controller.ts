import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'

import { ApiResult } from '~/common/decorators/api-result.decorator'
import { IdParam } from '~/common/decorators/id-param.decorator'

import { Pagination } from '~/helper/paginate/pagination'
import { Perm, definePermission } from '~/modules/auth/decorators/permission.decorator'

import { ResourceGuard } from '~/modules/auth/guards/resource.guard'
import { ConceptEntity } from '~/modules/think/think.entity'

import { AuthUser } from '../auth/decorators/auth-user.decorator'

import { ConceptDto, ConceptQueryDto } from './think.dto'
import { ThinkService } from './think.service'

export const permissions = definePermission('think', {
  LIST: 'list',
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete',
} as const)

@ApiTags('Business - Think模块')
@UseGuards(ResourceGuard)
@Controller('think')
export class TodoController {
  constructor(private readonly thinkService: ThinkService,
  ) { }

  @Get()
  @ApiOperation({ summary: '获取概念列表' })
  @ApiResult({ type: [ConceptEntity] })
  @Perm(permissions.LIST)
  async list(@Query() dto: ConceptQueryDto): Promise<Pagination<ConceptEntity>> {
    return this.thinkService.list(dto)
  }

  @Get(':id')
  @ApiOperation({ summary: '获取概念详情' })
  @ApiResult({ type: ConceptDto })
  @Perm(permissions.READ)
  async info(@IdParam() id: string): Promise<ConceptDto> {
    return this.thinkService.detail(id)
  }

  @Post()
  @ApiOperation({ summary: '创建或更新概念' })
  @Perm(permissions.CREATE)
  async push(@Body() dto: ConceptDto, @AuthUser() user: IAuthUser): Promise<void> {
    await this.thinkService.createOrUpdate(String(user.uid), dto)
  }

  // @Put(':id')
  // @ApiOperation({ summary: '更新Todo' })
  // @Perm(permissions.UPDATE)
  // @Resource(TodoEntity)
  // async update(@IdParam() id: number, @Body() dto: TodoUpdateDto): Promise<void> {
  //   await this.todoService.update(id, dto)
  // }

  @Delete(':name')
  @ApiOperation({ summary: '删除概念' })
  @Perm(permissions.DELETE)
  async delete(@IdParam() name: string, @AuthUser() user: IAuthUser): Promise<void> {
    const key = this.thinkService.getConceptKeyByUserId2name(String(user.uid), name)
    await this.thinkService.delete(name)
  }
}
