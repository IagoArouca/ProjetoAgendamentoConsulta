import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { RealtimeGateway } from '../realtime/realtime.gateway';

@Processor('mail-queue')
export class MailProcessor extends WorkerHost {
  private readonly logger = new Logger(MailProcessor.name);

  constructor(
    private readonly realtimeGateway: RealtimeGateway,
  ) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    switch (job.name) {
      case 'send-confirmation-email': {
        const { appointmentId, userId } = job.data;

        this.logger.log(
          `Processando e-mail de confirmação para o agendamento ${appointmentId}`,
        );

        await new Promise((resolve) => setTimeout(resolve, 2000));

        this.logger.log(
          `E-mail enviado com sucesso para o agendamento ${appointmentId}`,
        );

        this.realtimeGateway.notifyEmailSent({
          appointmentId,
          userId,
          message: 'Email enviado com sucesso!',
        });

        break;
      }
    }
  }
}