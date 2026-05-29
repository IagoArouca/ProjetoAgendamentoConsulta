import { Module } from '@nestjs/common';
import { AppointmentsController } from './appointments.controller';
import { AppointmentsService } from './appointments.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { RealtimeModule } from '../realtime/realtime.module';
import { BullModule } from '@nestjs/bullmq';
@Module({
  imports: [PrismaModule,
     RealtimeModule,
     BullModule.registerQueue({
      name: 'mail-queue',
    }),  ],
  controllers: [AppointmentsController],
  providers: [AppointmentsService]
})
export class AppointmentsModule {}
