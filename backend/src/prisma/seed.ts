import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
    adapter: new PrismaPg({connectionString: process.env.DATABASE_URL })
});

async function main() {
    const providerId = 'provider-default-uuid-12345'

    await prisma.provider.upsert({
        where: { id: providerId },
        update: {},
        create: {
            id: providerId,
            name: 'Clínica  Premium',
            description: 'Atendimento médico e agendamentos em tempo real'
        },
    });

    console.log('Database seeded sucessfully! Provider padrão criado.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

