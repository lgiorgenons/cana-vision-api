import { Request, Response } from 'express';
import { TalhaoService } from '../../../services/talhoes/talhoes.service';
import { CreateTalhaoDto, UpdateTalhaoDto } from '../../../dtos/talhoes/talhoes.dto';
import { UnauthorizedError } from '../../../common/errors/application-error';

export class TalhaoController {
  constructor(private readonly talhaoService: TalhaoService = new TalhaoService()) {}

  async create(req: Request, res: Response): Promise<Response> {
    if (!req.user || !req.user.clienteId) {
      throw new UnauthorizedError('Usuário não autenticado ou não associado a um cliente.');
    }
    const createDto: CreateTalhaoDto = req.body;
    const talhao = await this.talhaoService.create(createDto, req.user.clienteId);
    return res.status(201).json(talhao);
  }

  async findAll(req: Request, res: Response): Promise<Response> {
    if (!req.user || !req.user.clienteId) {
      throw new UnauthorizedError('Usuário não autenticado ou não associado a um cliente.');
    }
    const { propriedadeId } = req.query;
    const talhoes = await this.talhaoService.findAll(req.user.clienteId, propriedadeId as string | undefined);
    return res.status(200).json(talhoes);
  }

  async findById(req: Request, res: Response): Promise<Response> {
    if (!req.user || !req.user.clienteId) {
      throw new UnauthorizedError('Usuário não autenticado ou não associado a um cliente.');
    }
    const { id } = req.params;
    const talhao = await this.talhaoService.findById(id, req.user.clienteId);
    return res.status(200).json(talhao);
  }

  async update(req: Request, res: Response): Promise<Response> {
    if (!req.user || !req.user.clienteId) {
      throw new UnauthorizedError('Usuário não autenticado ou não associado a um cliente.');
    }
    const { id } = req.params;
    const updateDto: UpdateTalhaoDto = req.body;
    const talhao = await this.talhaoService.update(id, updateDto, req.user.clienteId);
    return res.status(200).json(talhao);
  }

  async delete(req: Request, res: Response): Promise<Response> {
    if (!req.user || !req.user.clienteId) {
      throw new UnauthorizedError('Usuário não autenticado ou não associado a um cliente.');
    }
    const { id } = req.params;
    await this.talhaoService.delete(id, req.user.clienteId);
    return res.status(204).send();
  }
}
