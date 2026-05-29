import { PrismaService } from './prisma.service';

describe('PrismaService', () => {
  let service: PrismaService;

  beforeEach(() => {
    service = {
      $connect: jest.fn(),
    } as unknown as PrismaService;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});