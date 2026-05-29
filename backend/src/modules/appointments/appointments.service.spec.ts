import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentsService } from './appointments.service';
import { PrismaService } from '../../prisma/prisma.service';
import { RealtimeGateway } from '../realtime/realtime.gateway';
import {
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { getQueueToken } from '@nestjs/bullmq';

describe('AppointmentsService', () => {
  let service: AppointmentsService;
  let prisma: PrismaService;

  const mockPrisma = {
    appointment: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    $transaction: jest.fn((callback) => callback(mockPrisma)),
  };

  const mockQueue = {
    add: jest.fn(),
  };

  const mockGateway = {
    notifyAppointmentCreated: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppointmentsService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: RealtimeGateway, useValue: mockGateway },
        { provide: getQueueToken('mail-queue'), useValue: mockQueue },
      ],
    }).compile();

    service = module.get<AppointmentsService>(AppointmentsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create an appointment successfully', async () => {
    const futureDate = new Date(
      Date.now() + 1000 * 60 * 60 * 2,
    ).toISOString();

    const dto = {
      date: futureDate,
      providerId: 'provider-1',
      userId: 'user-1',
    };

    mockPrisma.appointment.findUnique.mockResolvedValue(null);

    mockPrisma.appointment.create.mockResolvedValue({
      id: 'new-id',
      ...dto,
    });

    const result = await service.create(dto);

    expect(result).toHaveProperty('id');

    expect(mockQueue.add).toHaveBeenCalled();

    expect(
      mockGateway.notifyAppointmentCreated,
    ).toHaveBeenCalled();
  });

  it('should throw an error if date is in the past', async () => {
    const dto = {
      date: '2020-01-01T10:00:00.000Z',
      providerId: 'provider-1',
      userId: 'user-1',
    };

    await expect(service.create(dto)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should throw ConflictException if time slot is already taken', async () => {
    const futureDate = new Date(
      Date.now() + 1000 * 60 * 60 * 2,
    ).toISOString();

    const dto = {
      date: futureDate,
      providerId: 'provider-1',
      userId: 'user-1',
    };

    mockPrisma.appointment.findUnique.mockResolvedValue({
      id: 'existing-id',
      ...dto,
    });

    await expect(service.create(dto)).rejects.toThrow(
      ConflictException,
    );
  });
});