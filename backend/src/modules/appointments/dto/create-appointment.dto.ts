import { IsISO8601, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateAppointmentDto {
    @IsNotEmpty()
    @IsISO8601()
    date!: string;

    @IsNotEmpty()
    providerId!: string;


}