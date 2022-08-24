import {
    BadRequestException,
    Body,
    Controller, Delete,
    Get,
    Headers, Param,
    Post,
    UseGuards,
    UsePipes,
    ValidationPipe
} from '@nestjs/common';
import {TerminalService} from "./terminal.service";
import {JwtAuthGuard} from "../auth/guards/jwt.guard";
import {AuthService} from "../auth/auth.service";
import {
    REACHED_MAXIMUM_TERMINALS,
    TERMINAL_WASNT_FOUND,
    U_R_USING_WRONG_TERMINAL, USER_NOT_ACTIVATED,
    YOU_CANNOT_SEND_REQUEST
} from "./terminal.constants";
import {faker} from "@faker-js/faker";
import {StartSearchingDto} from "./dto/start-searching.dto";
import {CreateTerminalDto} from "./dto/create-terminal.dto";
import {USER_NOT_FOUND_ERROR} from "../auth/auth.constants";

@Controller('terminal')
export class TerminalController {
    constructor(
        private readonly terminalService: TerminalService,
        private readonly authService: AuthService
    ) {
    }

    @Get('getName/:id')
    @UseGuards(JwtAuthGuard)
    async getTerminalName(@Param('id') id: string) {
        return await this.terminalService.getTerminalName(id)
    }

    @Post('')
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe())
    async createNewSession(@Headers() headers, @Body() dto: CreateTerminalDto) {
        const decodedJwt = this.authService.decode(headers)
        // @ts-ignore
        const user = await this.authService.getOne(decodedJwt.email)
        const userId = user._id.toString()

        if(user.isActivated === false) {
            throw new BadRequestException(USER_NOT_ACTIVATED)
        }

        const terminals = await this.terminalService.getAllTerminalsByUserId(userId)
        if(terminals.length > 0) {
            throw new BadRequestException(REACHED_MAXIMUM_TERMINALS)
        }

        return await this.terminalService.createNewTerminal(userId, dto)
    }

    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe())
    @Post('start-searching')
    async startSearching(@Body() dto: StartSearchingDto, @Headers() headers) {
        const terminal = await this.terminalService.getOne(dto.id)
        const decodedJwt = this.authService.decode(headers)
        // @ts-ignore
        const user = await this.authService.getOne(decodedJwt.email)

        if(user.isActivated === false) {
            throw new BadRequestException(USER_NOT_ACTIVATED)
        }

        if(!terminal) {
            throw new BadRequestException(TERMINAL_WASNT_FOUND)
        }

        if(user._id.toString() !== terminal.userId) {
            throw new BadRequestException(U_R_USING_WRONG_TERMINAL)
        }

        const quantity = 330
        let i = 0
        const ms = 30
        const res = []

        if(ms * quantity > (Date.now() - terminal.lastChange)) {
            throw new BadRequestException(YOU_CANNOT_SEND_REQUEST)
        }

        while(i !== quantity) {
            const balance = Math.floor(Math.random() * 15000)

            if(balance === 10) {
                const amount = (+faker.finance.amount() / 50)
                res.push(this.log(faker.finance.bitcoinAddress(), `${amount}$ - ~${(amount / 23100).toFixed(5)}`))
                await this.authService.updateField('amount', amount, user._id.toString())
                i = quantity-1
            } else {
                res.push(this.log(faker.finance.bitcoinAddress(), 0))
            }

            i++
        }

        await this.terminalService.updateField('lastChange', Date.now(), terminal._id.toString())

        return res
    }

    log(text, amount) {
        return {
            text: `${text} - ${amount}`,
        }
    }

    @Get('myTerminals')
    @UseGuards(JwtAuthGuard)
    async getMyTerminals(@Headers() headers) {
        const decodedJwt = this.authService.decode(headers)
        // @ts-ignore
        const user = await this.authService.getOne(decodedJwt.email)
        const userId = user._id.toString()

        if(!user) {
            throw new BadRequestException(USER_NOT_FOUND_ERROR)
        }

        return await this.terminalService.getAllTerminalsByUserId(userId)
    }


    @Get('')
    async getAll() {
        return await this.terminalService.getAll()
    }

    @Delete('deleteAll')
    async deleteAll() {
       return await this.terminalService.deleteAll()
    }

    isUserAdmin(id) {
        if(id !== '62fe62dcc9afc716b72a8aa0') {
            return false
        }
    }
}
