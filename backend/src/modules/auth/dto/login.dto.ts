import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class LoginDto {
    @IsNotEmpty({ message: 'O email é obrigatório' })
    @IsEmail({},{ message: 'O email deve ser válido' })
    email!: string;

    @IsNotEmpty({ message: 'A senha é obrigatória' })
    @IsString({ message: 'A senha deve ser uma string' })
    @MinLength(6, { message: 'A senha deve ter pelo menos 6 caracteres' })
    password!: string;
}