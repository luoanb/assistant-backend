import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { paginate } from '~/helper/paginate'
import { Pagination } from '~/helper/paginate/pagination'
import { ConceptContentEntity, ConceptEntity } from '~/modules/think/think.entity'

import { generateUUID } from '~/utils/tool.util'

import { ConceptDto, ConceptQueryDto } from './think.dto'

@Injectable()
export class ThinkService {
  constructor(
    @InjectRepository(ConceptEntity)
    private conceptRepository: Repository<ConceptEntity>,
    @InjectRepository(ConceptContentEntity)
    private conceptContentRepository: Repository<ConceptContentEntity>,
  ) { }

  /**
   * @param userid 不允许包含@ 符号
   * @param name
   * @returns
   */
  getConceptKeyByUserId2name(userid: string, name: string) {
    return `${userid}@${name}`
  }

  async list({
    page,
    pageSize,
  }: ConceptQueryDto): Promise<Pagination<ConceptEntity>> {
    return paginate(this.conceptRepository, { page, pageSize })
  }

  async detail(id: string): Promise<ConceptDto & { id: string }> {
    const item: ConceptDto = { ...await this.conceptRepository.findOneBy({ id }), contentData: null }
    if (!item)
      throw new NotFoundException('未找到该记录')
    if (item.contentKey) {
      item.contentData = await this.conceptContentRepository.findOneBy({ id: item.contentKey })
    }
    return item as any
  }

  async createOrUpdate(userid: string, dto: ConceptDto) {
    const key = this.getConceptKeyByUserId2name(userid, dto.name)
    const exist = await this.conceptRepository.exist({ where: { id: key } })
    const cententData = dto.contentData
    let contentKey = null
    if (!exist) {
      // 处理详情表
      let contentKey = null
      if (cententData) {
        contentKey = generateUUID()
        await this.conceptContentRepository.create({ ...cententData, id: contentKey })
      }
      // 存储基础表
      return await this.create({ ...dto, id: key, unique: userid, contentKey })
    }
    else {
      // 处理详情表
      if (cententData) {
        const item = await this.conceptRepository.findOneBy({ id: key })
        if (item.contentKey) {
          contentKey = item.contentKey
          await this.conceptContentRepository.update(contentKey, { ...cententData, id: contentKey })
        }
        else {
          contentKey = generateUUID()
          await this.conceptContentRepository.create({ ...cententData, id: contentKey })
        }
      }
      // 存储基础表
      return await this.update(key, { ...dto, unique: userid, contentKey })
    }
  }

  async create(dto: ConceptEntity) {
    await this.conceptRepository.save(dto)
  }

  async update(id: string, dto: ConceptDto) {
    await this.conceptRepository.update(id, dto)
  }

  async delete(id: string) {
    const item = await this.detail(id)
    if (item.contentKey) {
      await this.deleteContent(item.contentKey)
    }
    await this.conceptRepository.remove(item)
  }

  /**
   * 获取概念内容
   * @param id
   * @returns
   */
  async detailContent(id: string): Promise<ConceptContentEntity> {
    const item = await this.conceptContentRepository.findOneBy({ id })
    if (!item)
      throw new NotFoundException('未找到该记录')

    return item
  }

  /**
   * 新增概念内容
   * @param dto
   */
  async createContent(dto: ConceptContentEntity) {
    await this.conceptContentRepository.save(dto)
  }

  /**
   * 修改概念内容
   * @param id
   * @param dto
   */
  async updateContent(id: string, dto: ConceptContentEntity) {
    await this.conceptContentRepository.update(id, dto)
  }

  /**
   * 删除概念内容
   * @param id
   */
  async deleteContent(id: string) {
    const item = await this.detailContent(id)
    await this.conceptContentRepository.remove(item)
  }
}
