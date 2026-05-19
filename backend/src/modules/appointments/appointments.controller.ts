import { Controller, Post, Get, Body, UsePipes, ValidationPipe, UseGuards, Param, Patch, Delete } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';

@Controller('appointments')
@UseGuards(JwtAuthGuard)
export class AppointmentsController {
    constructor(private readonly appointmentsService: AppointmentsService){}

    
    @Post()
    @UsePipes(new ValidationPipe())
    create(@Body() createAppointmentDto: CreateAppointmentDto,
           @CurrentUser() user: any
    ) {
        return this.appointmentsService.create({
            ...createAppointmentDto,
            userId: user.id,
        });
    }

    @Get()
    findAll(@CurrentUser() user: any){
        return this.appointmentsService.findAll(user.userId);
    }

    @Get(':id')
    findOne(@Param('id') id: string, @CurrentUser() user: any){
        return this.appointmentsService.findOne(id, user.userId);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @CurrentUser() user: any,
        @Body() updateData: Partial<CreateAppointmentDto>
    ) {
        return this.appointmentsService.update(id, user.userId, updateData);
    }

    @Delete(':id')
    remove(@Param('id') id: string, @CurrentUser() user: any){
        return this.appointmentsService.remove(id, user.userId);
    }

}

