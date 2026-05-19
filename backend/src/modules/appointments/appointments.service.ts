import { Injectable, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { startOfHour, parseISO, isBefore } from 'date-fns';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { RealtimeGateway } from '../realtime/realtime.gateway';

@Injectable()
export class AppointmentsService {
  constructor(
    private prisma: PrismaService,
    private realtimeGateway: RealtimeGateway,
    @InjectQueue('mail-queue') private mailQueue: Queue,
  ) {}

  async create(data: CreateAppointmentDto) {
    const appointmentDate = startOfHour(parseISO(data.date));

    if (isBefore(appointmentDate, new Date())) {
      throw new BadRequestException(
        'You cannot create an appointment on a past date.',
      );
    }

    const appointment = await this.prisma.$transaction(async (tx) => {
      const existingAppointment = await tx.appointment.findUnique({
        where: {
          providerId_date: {
            providerId: data.providerId,
            date: appointmentDate,
          },
        },
      });

      if (existingAppointment) {
        throw new ConflictException('This time slot is already booked.');
      }

      return tx.appointment.create({
        data: {
          date: appointmentDate,
          userId: data.userId,
          providerId: data.providerId,
        },
      });
    });

    await this.mailQueue.add(
      'send-confirmation-email',
      {
        appointmentId: appointment.id,
        userId: data.userId,
      },
      {
        attempts: 3,
        backoff: 3000,
      },
    );

    this.realtimeGateway.notifyAppointmentCreated({
      providerId: appointment.providerId,
      date: appointment.date,
      status: 'BOOKED',
    });

    return appointment;
  }

  async findAll(userId: string){
    return this.prisma.appointment.findMany({
      where: { userId },
      include: { provider: true },
      orderBy: { date: 'asc' },
    });
  }

  async findOne(id: string, userId: string) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id, userId },
    });
    if (!appointment) {
      throw new BadRequestException('Appointment not found or access denied.');
    }
    return appointment;
  }

  async update(
  id: string,
  userId: string,
  updateData: Partial<CreateAppointmentDto>,
) {
  const appointment = await this.findOne(id, userId);

  if (!updateData.date) {
    throw new BadRequestException('Date is required.');
  }

  const newDate = startOfHour(parseISO(updateData.date));

  if (isBefore(newDate, new Date())) {
    throw new BadRequestException(
      'You cannot reschedule to a past date.',
    );
  }

  const conflict = await this.prisma.appointment.findFirst({
    where: {
      providerId: appointment.providerId,
      date: newDate,
      id: { not: id },
    },
  });

  if (conflict) {
    throw new ConflictException(
      'New time slot is already booked.',
    );
  }

  return this.prisma.appointment.update({
    where: { id },
    data: {
      ...updateData,
      date: newDate,
    },
  });
}
  async remove(id: string, userId: string) {
    await this.findOne(id, userId);
    return this.prisma.appointment.delete({ where: { id } });
  }
}