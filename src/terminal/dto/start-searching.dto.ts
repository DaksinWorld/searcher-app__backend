import {IsString} from "class-validator";


export class StartSearchingDto {
    @IsString()
    id: string;
}