import { Request, Response } from 'express';
import { PropriedadeService } from '@services/propriedades/propriedades.service';
import { CreatePropriedadeDto, UpdatePropriedadeDto } from '@dtos/propriedades/propriedades.dto';
import { UnauthorizedError } from '@common/errors/application-error';

export class PropriedadeController {
  constructor(private readonly propriedadeService: PropriedadeService = new PropriedadeService()) {}

  async create(req: Request, res: Response): Promise<Response> {
    const createDto: CreatePropriedadeDto = req.body;
    if (!req.user?.clienteId) {
      throw new UnauthorizedError('Usuário não autenticado ou não associado a um cliente.');
    }
    const propriedade = await this.propriedadeService.create(createDto, req.user.clienteId);
    return res.status(201).json(propriedade);
  }

  async findAll(req: Request, res: Response): Promise<Response> {
    if (!req.user || !req.user.clienteId) {
      throw new UnauthorizedError('Usuário não autenticado ou não associado a um cliente.');
    }
    const clienteId = req.user.clienteId;
    const propriedades = await this.propriedadeService.findAll(clienteId);
    return res.status(200).json(propriedades);
  }

  async findById(req: Request, res: Response): Promise<Response> {
    if (!req.user || !req.user.clienteId) {
      throw new UnauthorizedError('Usuário não autenticado ou não associado a um cliente.');
    }
    const { id } = req.params;
    const propriedade = await this.propriedadeService.findById(id, req.user.clienteId);
    return res.status(200).json(propriedade);
  }

  async update(req: Request, res: Response): Promise<Response> {
    if (!req.user || !req.user.clienteId) {
      throw new UnauthorizedError('Usuário não autenticado ou não associado a um cliente.');
    }
    const { id } = req.params;
    const updateDto: UpdatePropriedadeDto = req.body;
    const propriedade = await this.propriedadeService.update(id, updateDto, req.user.clienteId);
    return res.status(200).json(propriedade);
  }

  async delete(req: Request, res: Response): Promise<Response> {
    if (!req.user || !req.user.clienteId) {
      throw new UnauthorizedError('Usuário não autenticado ou não associado a um cliente.');
    }
    const { id } = req.params;
    await this.propriedadeService.delete(id, req.user.clienteId);
    return res.status(204).send();
  }
}
