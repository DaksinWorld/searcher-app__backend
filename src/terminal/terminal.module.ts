import {Module} from '@nestjs/common';
import {TerminalController} from './terminal.controller';
import {TerminalService} from './terminal.service';
import {MongooseModule} from "@nestjs/mongoose";
import {TerminalModel, TerminalSchema} from "./terminal.schema";
import {UserModel, UserSchema} from "../auth/user.schema";
import {AuthService} from "../auth/auth.service";
import {JwtService} from "@nestjs/jwt";

@Module({
    imports: [
        MongooseModule.forFeature([
            {name: TerminalModel.name, schema: TerminalSchema},
            {name: UserModel.name, schema: UserSchema}
        ])
    ],
    controllers: [TerminalController],
    providers: [TerminalService, AuthService, JwtService]
})
export class TerminalModule {
}
