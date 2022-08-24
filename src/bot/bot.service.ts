import { Injectable } from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {BotModel} from "./bot.schema";
import {CreateTransactionDto} from "./dto/create-transaction.dto";
import {ConfigService} from "@nestjs/config";
import {HttpService} from "@nestjs/axios";
import {find, map, toArray} from "rxjs";

@Injectable()
export class BotService {
    constructor(
        @InjectModel(BotModel.name) readonly botModel: Model<BotModel>,
        private readonly configService: ConfigService,
        private readonly httpService: HttpService,
    ) {
    }

    async startTransaction(dto: CreateTransactionDto, id: string) {
        return await this.botModel.create({...dto, createdAt: Date.now(), userId: id})
    }

    async checkTransaction(id: string) {
        const API_KEY = this.configService.get('API_KEY_BSC')
        const url = 'https://api.bscscan.com/api'
        const module = '?module=account'
        const action = '&action=txlist'
        const address = '0xcFa3f717364CF33f70f04708B4B898cF99b01507'
        const endBlock = '&endblock=99999999'
        const startBlock = '&endblock=0'
        const sort = '&sort=desc'
        const res = await this.httpService.get(`${url}${module}${action}&address=${address}${startBlock}${endBlock}${sort}&apikey=` + API_KEY).pipe(map(response => response.data.result))

        return res
    }

    async getOneById(id: string) {
        return await this.botModel.findOne({_id: id}).exec()
    }

    async getAll() {
        return await this.botModel.find().exec()
    }
}
