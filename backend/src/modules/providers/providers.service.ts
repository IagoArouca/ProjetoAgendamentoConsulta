import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProviderDto } from './dto/create-provider.dto';

@Injectable()
export class ProvidersService {
    constructor(private prisma: PrismaService) {}

    async create(data: CreateProviderDto) {
        return this.prisma.provider.create({ data });
    }

    async findAll() {
        return this.prisma.provider.findMany({
            orderBy: { name: 'asc'}
        });
    }
}
