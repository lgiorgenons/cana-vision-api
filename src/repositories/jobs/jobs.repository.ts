import { prisma } from '../../config/prisma';
import { Job, JobStatus, Prisma } from '@prisma/client';

export class JobsRepository {
  async create(data: Prisma.JobCreateInput): Promise<Job> {
    return prisma.job.create({
      data,
    });
  }

  async findNextJob(): Promise<Job | null> {
    return prisma.job.findFirst({
      where: {
        status: JobStatus.pending,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  async updateStatus(
    id: string,
    status: JobStatus,
    extraData: Partial<Pick<Job, 'iniciadoEm' | 'finalizadoEm' | 'resultadoDir' | 'erroMensagem'>> = {}
  ): Promise<Job> {
    return prisma.job.update({
      where: { id },
      data: {
        status,
        ...extraData,
      },
    });
  }

  async findById(id: string): Promise<Job | null> {
    return prisma.job.findUnique({
      where: { id },
      include: {
        cliente: true,
        propriedade: true,
        talhao: true,
      },
    });
  }

  async listByCliente(clienteId: string): Promise<Job[]> {
    return prisma.job.findMany({
      where: { clienteId },
      orderBy: { createdAt: 'desc' },
      include: {
        propriedade: { select: { nome: true } },
        talhao: { select: { nome: true } },
      },
    });
  }
}
