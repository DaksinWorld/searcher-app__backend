import { Injectable } from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {ActivationModel} from "./activation.schema";
import {Model} from "mongoose";
import {createHash, randomBytes} from "crypto";
@Injectable()
export class ActivationService {
    constructor(
        @InjectModel(ActivationModel.name) private activationModel: Model<ActivationModel>
    ) {
    }

    async generateNewToken() {
        const restToken = randomBytes(24).toString("hex");
        const hash = createHash('sha256').update(restToken).digest('hex').substring(0, 22)
        const res = await this.activationModel.findOne({hash})

        if(!res) {
            return await this.activationModel.create({
                hash,
                createdAt: Date.now(),
                isActivated: false
            })
        } else {
          await this.generateNewToken()
        }
    }

    async findOne(hash: string) {
        return await this.activationModel.findOne({hash: hash}).exec()
    }

    async activateToken(id: string) {
        return await this.activationModel.updateOne({_id: id}, {
            $set: {
                isActivated: true
            }
        }).exec()
    }

    async getAll() {
        return await this.activationModel.find().exec()
    }

}
