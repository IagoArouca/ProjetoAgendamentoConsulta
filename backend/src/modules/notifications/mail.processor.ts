import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';

@Processor('mail-queue')
export class MailProcessor extends WorkerHost {
    private readonly logger = new Logger(MailProcessor.name);

    async process(job: Job<any, any, string>): Promise<any>{
        switch (job.name) {
            case 'send-confirmation-email' :
                const { appointmentId } = job.data;

                this.logger.log(`Processando e-mail de confirmação para o agendamento ${appointmentId}`);

                await new Promise(resolve => setTimeout(resolve, 2000));

                this.logger.log(`E-mail de confirmação para o agendamento ${appointmentId} enviado com sucesso!`);
                break;
        }
    }
}