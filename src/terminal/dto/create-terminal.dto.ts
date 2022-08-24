import {IsString, MinLength} from "class-validator";


export class CreateTerminalDto {
    @IsString()
    @MinLength(2)
    name: string;
}