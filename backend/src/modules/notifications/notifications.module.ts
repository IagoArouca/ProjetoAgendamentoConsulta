import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { MailProcessor } from './mail.processor';

@Module({
    imports: [
        BullModule.registerQueue({
            name: 'mail-queue',
        }),
    ],
    providers: [MailProcessor],
    exports: [BullModule],
})
export class NotificationsModule {}
