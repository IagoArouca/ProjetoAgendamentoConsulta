import { IsNotEmpty, IsString, Matches, Length } from "class-validator";

export class CreateCustomerDto {
    @IsNotEmpty()
    @IsString()
    name!: string;

    @IsNotEmpty()
    @IsString()
    @Length(11,11, { message: 'O CPF deve conter exatamente 11 dígitos.' })
    cpf!: string;

    @IsNotEmpty()
    @IsString()
    phone!: string;
}