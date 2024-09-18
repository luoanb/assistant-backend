import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'

import { ApiResult } from '~/common/decorators/api-result.decorator'

import { Pagination } from '~/helper/paginate/pagination'
import { Perm, definePermission } from '~/modules/auth/decorators/permission.decorator'

import { ResourceGuard } from '~/modules/auth/guards/resource.guard'
import { ConceptEntity } from '~/modules/think/think.entity'

import { AuthUser } from '../auth/decorators/auth-user.decorator'

import { ConceptDto, ConceptQueryDto, ConceptTreeFreeQueryDto, ConceptTreeQueryDto } from './think.dto'
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
export class ThinkController {
  constructor(private readonly thinkService: ThinkService,
  ) { }

  @Get()
  @ApiOperation({ summary: '获取概念列表' })
  @ApiResult({ type: [ConceptEntity] })
  @Perm(permissions.LIST)
  async list(@Query() dto: ConceptQueryDto): Promise<Pagination<ConceptEntity>> {
    return this.thinkService.list(dto)
  }

  @Get(':name')
  @ApiOperation({ summary: '获取概念详情' })
  @ApiResult({ type: ConceptDto })
  @Perm(permissions.READ)
  async info(@Param('name') name: string, @AuthUser() user: IAuthUser): Promise<ConceptDto> {
    const key = this.thinkService.getConceptKeyByUserId2name(String(user.uid), name)
    return this.thinkService.detail(key)
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
  async delete(@Param('name') name: string, @AuthUser() user: IAuthUser): Promise<void> {
    const key = this.thinkService.getConceptKeyByUserId2name(String(user.uid), name)
    await this.thinkService.delete(name)
  }

  @Get('tree')
  @ApiOperation({ summary: '获取指定概念的子列表' })
  @ApiResult({ type: [ConceptEntity] })
  @Perm(permissions.LIST)
  async tree(@Query() dto: ConceptTreeQueryDto, @AuthUser() user: IAuthUser): Promise<Array<ConceptEntity>> {
    // return this.thinkService.list(dto)
    // return this.thinkService.
    return this.thinkService.tree(String(user.uid), dto)
  }

  @Get('treefree')
  @ApiOperation({ summary: '获取游离节点' })
  @ApiResult({ type: [ConceptEntity] })
  @Perm(permissions.LIST)
  async treeFree(@Query() dto: ConceptTreeFreeQueryDto): Promise<Pagination<ConceptEntity>> {
    return this.thinkService.list({ ...dto, parent: '' })
  }
}
