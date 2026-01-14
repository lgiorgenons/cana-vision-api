import { Request, Response } from "express";
import { ImagensService } from "../../../services/imagens/imagens.service";

export class ImagensController {
  private service = new ImagensService();

  async listImages(req: Request, res: Response) {
    const prefix = req.query.prefix as string;
    const images = await this.service.listTiffImages(prefix);
    return res.status(200).json(images);
  }
}
