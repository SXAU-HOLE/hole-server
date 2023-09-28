import { Body, Controller, Inject, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDTO, RegisterDTO } from './dto/auth.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  @Inject()
  private readonly authService: AuthService;

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  login(@Body() dto: LoginDTO, @Req() req) {
    return req.user;
  }

  @Post('/register')
  register(@Body() dto: RegisterDTO) {
    return this.authService.register(dto);
  }
}
