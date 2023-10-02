import { Body, Controller, Inject, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ForgetPasswordDTO, LoginDTO, RegisterDTO } from './dto/auth.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Public } from 'src/common/decorator/public.decorator';

@Public()
@Controller('auth')
export class AuthController {
  @Inject()
  private readonly authService: AuthService;

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  login(@Body() dto: LoginDTO) {
    return this.authService.login(dto);
  }

  @Post('/register')
  register(@Body() dto: RegisterDTO) {
    return this.authService.register(dto);
  }

  @Post('/forget')
  forget(@Body() dto: ForgetPasswordDTO) {
    return this.authService.forget(dto);
  }
}
