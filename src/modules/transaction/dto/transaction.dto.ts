import { IsNotEmpty, IsString } from "class-validator";

export class TransactionDTO {
    @IsNotEmpty()
    @IsString()
    service_code!: string;
}