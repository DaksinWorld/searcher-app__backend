import { Module } from '@nestjs/common';
import { BotService } from './bot.service';
import { BotController } from './bot.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {UserModel, UserSchema} from "../auth/user.schema";
import {BotModel, BotSchema} from './bot.schema';
import {AuthService} from "../auth/auth.service";
import {JwtService} from "@nestjs/jwt";
import {ConfigService} from "@nestjs/config";
import {HttpModule} from "@nestjs/axios";

@Module({
  providers: [BotService, AuthService, JwtService, ConfigService],
  controllers: [BotController],
  imports: [
    MongooseModule.forFeature([{ name: UserModel.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: BotModel.name, schema: BotSchema }]),
    HttpModule
  ]
})
export class BotModule {}