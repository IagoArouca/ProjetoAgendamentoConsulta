import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
    @IsNotEmpty({ message: 'O nome é obrigatório' })
    @IsString({ message: 'O nome deve ser uma string' })
    name!: string;
    @IsNotEmpty({ message: 'O email é obrigatório' })
    @IsEmail({},{ message: 'O email deve ser válido' })
    email!: string;

    @IsNotEmpty({ message: 'A senha é obrigatória' })
    @IsString({ message: 'A senha deve ser uma string' })
    @MinLength(6, { message: 'A senha deve ter pelo menos 6 caracteres' })
    password!: string;
}