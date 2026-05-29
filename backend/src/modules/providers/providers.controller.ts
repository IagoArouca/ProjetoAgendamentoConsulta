import { Controller, Post, Get, Body, UsePipes, ValidationPipe, UseGuards } from '@nestjs/common';
import { ProvidersService } from './providers.service';
import { CreateProviderDto } from './dto/create-provider.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '@prisma/client';
import { Roles } from 'src/shared/decorators/roles.decorator';

@Controller('providers')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProvidersController {
    constructor(private readonly providersService: ProvidersService) {}

    @Post()
    @Roles(UserRole.ADMIN)
    @UsePipes(new ValidationPipe({ transform: true }))
    create(@Body() createProviderDto: CreateProviderDto){
        return this.providersService.create(createProviderDto);
    }

    @Get()
    findAll() {
        return this.providersService.findAll();
    }
}
