import { Body, Controller, Headers, Post, Request, UseGuards } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'

import { ExtractJwt } from 'passport-jwt'

import { ApiResult } from '~/common/decorators/api-result.decorator'
import { Ip } from '~/common/decorators/http.decorator'
import { MailerService } from '~/shared/mailer/mailer.service'

import { UserService } from '../user/user.service'

import { AuthService } from './auth.service'
import { Public } from './decorators/public.decorator'
import { LoginDto, LoginRegisterDto, RegisterDto } from './dto/auth.dto'
import { JwtAuthGuard } from './guards/jwt-auth.guard'
import { LocalGuard } from './guards/local.guard'
import { LoginToken } from './models/auth.model'
import { CaptchaService } from './services/captcha.service'

@ApiTags('Auth - 认证模块')
@UseGuards(LocalGuard)
@Public()
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private captchaService: CaptchaService,
    private mailerService: MailerService,
  ) { }

  @Post('login')
  @ApiOperation({ summary: '登录' })
  @ApiResult({ type: LoginToken })
  async login(@Body() dto: LoginDto, @Ip() ip: string, @Headers('user-agent') ua: string): Promise<LoginToken> {
    await this.captchaService.checkImgCaptcha(dto.captchaId, dto.verifyCode)
    const token = await this.authService.login(
      dto.username,
      dto.password,
      ip,
      ua,
    )
    return { token }
  }

  @Post('register')
  @ApiOperation({ summary: '注册' })
  async register(@Body() dto: RegisterDto, @Ip() ip: string, @Headers('user-agent') ua: string): Promise<LoginToken> {
    await this.mailerService.checkCode(dto.username, dto.code)
    await this.userService.register(dto)
    const token = await this.authService.login(
      dto.username,
      dto.password,
      ip,
      ua,
    )
    return { token }
  }

  @Post('login-by-email')
  @ApiOperation({ summary: '邮箱注册/登录' })
  async loginByEmail(@Body() dto: LoginRegisterDto, @Ip() ip: string, @Headers('user-agent') ua: string): Promise<LoginToken> {
    // await this.mailerService.checkCode(dto.username, dto.code)
    const isExist = await this.userService.exist(dto.username)
    if (!isExist) {
      await this.userService.register({ ...dto, password: '' })
    }
    const token = await this.authService.loginNoCheck(
      dto.username,
      ip,
      ua,
    )
    return { token }
  }

  @Post('refresh-token')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '刷新登录' })
  async refreshToken(@Request() req): Promise<LoginToken> {
    const getToken = ExtractJwt.fromAuthHeaderAsBearerToken()
    const oldToken = getToken(req)
    const token = await this.authService.refreshToken(oldToken)
    return { token }
  }
}
