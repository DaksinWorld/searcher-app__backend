import {BadRequestException, Controller, Get, Headers, NotFoundException, Param, Post, UseGuards} from '@nestjs/common';
import { ActivationService } from './activation.service';
import {IsAdminGuard} from "./guards/isAdmin.guards";
import {JwtAuthGuard} from "../auth/guards/jwt.guard";
import {INVALID_TOKEN} from "./activation.constants";
import {AuthService} from "../auth/auth.service";
import {USER_NOT_FOUND_ERROR} from "../auth/auth.constants";

@Controller('activation')
export class ActivationController {
  constructor(
      private readonly activationService: ActivationService,
      private readonly authService: AuthService
  ) {}

  @Post('generateNewToken')
  @UseGuards(IsAdminGuard)
  @UseGuards(JwtAuthGuard)
  async generateNewToken() {
    return await this.activationService.generateNewToken()
  }

  @Post(':id')
  @UseGuards(JwtAuthGuard)
  async activateToken(@Param('id') id: string, @Headers() headers) {
    const userEmail = this.authService.decode(headers)

    //@ts-ignore
    const user = await this.authService.getOne(userEmail.email)
    const token = await this.activationService.findOne(id)

    if(!user) {
      throw new NotFoundException(USER_NOT_FOUND_ERROR)
    }

    if(!token || token.isActivated === true) {
      throw new BadRequestException(INVALID_TOKEN)
    }

    await this.activationService.activateToken(token._id.toString())
    await this.authService.updateStatus(user._id.toString(), true)
    return 'Activated'
  }

  @Get('')
  @UseGuards(IsAdminGuard)
  @UseGuards(JwtAuthGuard)
  async getAll() {
    return await this.activationService.getAll()
  }

}
