import { Request, Response } from 'express';
import { PropriedadeService } from '@services/propriedades/propriedades.service';
import { CreatePropriedadeDto, UpdatePropriedadeDto } from '@dtos/propriedades/propriedades.dto';

export class PropriedadeController {
  constructor(private readonly propriedadeService: PropriedadeService = new PropriedadeService()) {}

  async create(req: Request, res: Response): Promise<Response> {
    const createDto: CreatePropriedadeDto = req.body;
    const propriedade = await this.propriedadeService.create(createDto);
    return res.status(201).json(propriedade);
  }

  async findAll(req: Request, res: Response): Promise<Response> {
    // Assuming clienteId is available from auth middleware or query param
    const clienteId = req.query.clienteId as string; 
    const propriedades = await this.propriedadeService.findAll(clienteId);
    return res.status(200).json(propriedades);
  }

  async findById(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const propriedade = await this.propriedadeService.findById(id);
    return res.status(200).json(propriedade);
  }

  async update(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const updateDto: UpdatePropriedadeDto = req.body;
    const propriedade = await this.propriedadeService.update(id, updateDto);
    return res.status(200).json(propriedade);
  }

  async delete(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    await this.propriedadeService.delete(id);
    return res.status(204).send();
  }
}
