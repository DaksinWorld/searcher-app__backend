import { Module } from '@nestjs/common';
import { ActivationService } from './activation.service';
import { ActivationController } from './activation.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {ActivationModel, ActivationSchema} from "./activation.schema";
import {JwtService} from "@nestjs/jwt";
import {UserModel, UserSchema} from "../auth/user.schema";
import {AuthService} from "../auth/auth.service";

@Module({
  imports: [
    MongooseModule.forFeature([{
      name: ActivationModel.name, schema: ActivationSchema
    }]),
    MongooseModule.forFeature([{ name: UserModel.name, schema: UserSchema }]),
  ],
  controllers: [ActivationController],
  providers: [ActivationService, JwtService, AuthService]
})
export class ActivationModule {}
