import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { TodoController } from './think.controller'
import { ConceptContentEntity, ConceptEntity } from './think.entity'
import { ThinkService } from './think.service'

const services = [ThinkService]

@Module({
  imports: [TypeOrmModule.forFeature([ConceptEntity, ConceptContentEntity])],
  controllers: [TodoController],
  providers: [...services],
  exports: [TypeOrmModule, ...services],
})
export class ThinkModule { }
