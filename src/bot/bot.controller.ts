import {
    Body,
    Controller,
    Get,
    Post,
    UseGuards,
    UsePipes,
    Headers,
    ValidationPipe, NotFoundException, Param
} from '@nestjs/common';
import {BotService} from "./bot.service";
import {CreateTransactionDto} from "./dto/create-transaction.dto";
import {JwtAuthGuard} from "../auth/guards/jwt.guard";
import {AuthService} from "../auth/auth.service";
import {USER_NOT_FOUND_ERROR} from "../auth/auth.constants";
import {find} from "rxjs";

@Controller('bot')
export class BotController {
    constructor(
        private readonly botService: BotService,
        private readonly authService: AuthService
    ) {
    }

    @Post('start-transaction')
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe())
    async startTransaction(@Body() dto: CreateTransactionDto, @Headers() headers) {
        const userEmail = this.authService.decode(headers)
        const user = await this.authService.findUser(userEmail)

        if(!user) {
            throw new NotFoundException(USER_NOT_FOUND_ERROR)
        }

        // @ts-ignore
        return await this.botService.startTransaction(dto, user._id.toString())
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    async checkTransaction(@Param('id') id: string) {
        const transaction = await this.botService.getOneById(id)

        const res =  await this.botService.checkTransaction(transaction.address)
        return res
    }

    @Get('')
    async getAll() {
        return await this.botService.getAll()
    }

    @Post(':id')
    async completeTransaction() {

    }
}
