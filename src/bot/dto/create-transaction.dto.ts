import {IsString} from "class-validator";


export class CreateTransactionDto {
    @IsString()
    address: string
}