import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { TodoController } from './think.controller'
import { TodoEntity } from './think.entity'
import { TodoService } from './think.service'

const services = [TodoService]

@Module({
  imports: [TypeOrmModule.forFeature([TodoEntity])],
  controllers: [TodoController],
  providers: [...services],
  exports: [TypeOrmModule, ...services],
})
export class TodoModule {}
