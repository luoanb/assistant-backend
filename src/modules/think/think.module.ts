import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { ThinkController } from './think.controller'
import { ConceptContentEntity, ConceptEntity } from './think.entity'
import { ThinkService } from './think.service'

const services = [ThinkService]

@Module({
  imports: [TypeOrmModule.forFeature([ConceptEntity, ConceptContentEntity])],
  controllers: [ThinkController],
  providers: [...services],
  exports: [TypeOrmModule, ...services],
})
export class ThinkModule { }
