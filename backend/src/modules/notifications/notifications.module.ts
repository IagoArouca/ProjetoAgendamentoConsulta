import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { MailProcessor } from './mail.processor';
import { RealtimeModule } from '../realtime/realtime.module';
import { RealtimeGateway } from '../realtime/realtime.gateway';

@Module({
    imports: [
        BullModule.registerQueue({
            name: 'mail-queue',
        }),
        RealtimeModule
    ],
    providers: [MailProcessor, RealtimeGateway],
    exports: [BullModule],
})
export class NotificationsModule {}
