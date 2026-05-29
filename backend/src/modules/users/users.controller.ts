import { Controller , Post, Body, UsePipes, ValidationPipe, UseGuards} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('users')

export class UsersController {
    constructor(private usersService: UsersService) {}

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @UsePipes(new ValidationPipe({ transform: true }))
    async create(@Body() createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto);
    }
}
