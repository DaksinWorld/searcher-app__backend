import { Injectable } from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {TerminalModel} from "./terminal.schema";
import {Model} from "mongoose";
import {CreateTerminalDto} from "./dto/create-terminal.dto";

@Injectable()
export class TerminalService {
    constructor(@InjectModel(TerminalModel.name) private readonly terminalModel: Model<TerminalModel>) {
    }

    async createNewTerminal(id: string, dto: CreateTerminalDto) {
        return await this.terminalModel.create({userId: id, ...dto,  lastChange: Date.now()})
    }

    async getAllTerminalsByUserId(userId: string) {
        return await this.terminalModel.find({userId: userId}).exec()
    }

    async getAll () {
        return await this.terminalModel.find().exec()
    }

    async deleteAll () {
        return await this.terminalModel.deleteMany().exec()
    }

    async getTerminalName(id: string) {
        return await this.terminalModel.findOne({_id: id}, {name: 1}).exec()
    }

    async getOne(id: string) {
        return await this.terminalModel.findOne({_id: id}).exec()
    }

    async updateField(field: string, data: any, id: string) {
        return await this.terminalModel.updateOne(({_id: id}), {
            $set: {
                [field]: data
            }
        }).exec()
    }

}
