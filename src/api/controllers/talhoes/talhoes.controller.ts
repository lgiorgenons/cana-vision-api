import { Request, Response } from 'express';
import { TalhaoService } from '../../../services/talhoes/talhoes.service';
import { CreateTalhaoDto, UpdateTalhaoDto } from '../../../dtos/talhoes/talhoes.dto';

export class TalhaoController {
  constructor(private readonly talhaoService: TalhaoService = new TalhaoService()) {}

  async create(req: Request, res: Response): Promise<Response> {
    const createDto: CreateTalhaoDto = req.body;
    const talhao = await this.talhaoService.create(createDto);
    return res.status(201).json(talhao);
  }

  async findAll(req: Request, res: Response): Promise<Response> {
    const { propriedadeId } = req.query;
    const talhoes = await this.talhaoService.findAll(propriedadeId as string);
    return res.status(200).json(talhoes);
  }

  async findById(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const talhao = await this.talhaoService.findById(id);
    return res.status(200).json(talhao);
  }

  async update(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const updateDto: UpdateTalhaoDto = req.body;
    const talhao = await this.talhaoService.update(id, updateDto);
    return res.status(200).json(talhao);
  }

  async delete(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    await this.talhaoService.delete(id);
    return res.status(204).send();
  }
}
