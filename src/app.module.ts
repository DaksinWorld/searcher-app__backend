import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {ConfigModule, ConfigService} from "@nestjs/config";
import {MongooseModule} from "@nestjs/mongoose";
import {getMongoConfig} from "./config/mongo.config";
import { AuthModule } from './auth/auth.module';
import {FilesModule} from "./files/files.module";
import {ServeStaticModule} from "@nestjs/serve-static";
import {path} from "app-root-path";
import { TerminalModule } from './terminal/terminal.module';
import { BotModule } from './bot/bot.module';
import { ActivationModule } from './activation/activation.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: `${path}/uploads`,
      serveRoot: '/uploads'
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getMongoConfig,
    }),
    AuthModule,
    FilesModule,
    TerminalModule,
    BotModule,
    ActivationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
