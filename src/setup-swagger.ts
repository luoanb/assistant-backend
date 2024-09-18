import { INestApplication, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

import { CommonEntity } from './common/entity/common.entity'
import { ResOp, TreeResult } from './common/model/response.model'
import { ConfigKeyPaths, IAppConfig, ISwaggerConfig } from './config'
import { Pagination } from './helper/paginate/pagination'

export function setupSwagger(
  app: INestApplication,
  configService: ConfigService<ConfigKeyPaths>,
): void {
  const { name, port } = configService.get<IAppConfig>('app')!
  const { enable, path } = configService.get<ISwaggerConfig>('swagger')!

  if (!enable)
    return

  const documentBuilder = new DocumentBuilder()
    .setTitle(name)
    .setDescription(`${name} API document
      json: http://127.0.0.1:${port}/api-docs-json`)
    .setVersion('1.0')
    .addBearerAuth()
    // .addBearerAuth({
    //   type: 'http',
    //   scheme: 'bearer',
    //   bearerFormat: 'JWT',
    //   description: '请输入Token (Enter the token)',
    // }, 'Authorization')
    // .addSecurity(API_SECURITY_AUTH, {
    //   description: '输入令牌（Enter the token）',
    //   type: 'http',
    //   scheme: 'bearer',
    //   bearerFormat: 'JWT',
    // })
    .build()

  // auth security
  // documentBuilder.
  const document = SwaggerModule.createDocument(app, documentBuilder, {
    ignoreGlobalPrefix: false,
    extraModels: [CommonEntity, ResOp, Pagination, TreeResult],
  })
  SwaggerModule.setup(path, app, document, {
    swaggerOptions: {
      persistAuthorization: true, // 保持登录
    },
  })

  // started log
  const logger = new Logger('SwaggerModule')
  logger.log(`Document running on http://127.0.0.1:${port}/${path}`)
}
