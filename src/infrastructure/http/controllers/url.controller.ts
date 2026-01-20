import { Request, Response } from "express";
import Joi from "joi";

import { CreateShortUrlUseCase } from "../../../application/usecases/createShortUrl.usecase";
import { GetOriginalUrlUseCase } from "../../../application/usecases/getOriginalUrl.usecase";
import { CreateUrlDTO } from "../../../interfaces/dto/create-url.dto";
import { GetUrlDTO } from "../../../interfaces/dto/get-url.dto";

export class UrlController {
  constructor(
    private createShortUrlUseCase: CreateShortUrlUseCase,
    private getOriginalUrlUseCase: GetOriginalUrlUseCase
  ) {}

  private createSchema = Joi.object<CreateUrlDTO>({
    long_url: Joi.string().uri().required(),
  });

  create = async (req: Request, res: Response) => {
    const dto: CreateUrlDTO = req.body;
    const { error } = this.createSchema.validate(dto);

    if (error) {
      return res.status(400).json({ message: "Invalid URL" });
    }
    const entity = await this.createShortUrlUseCase.execute(dto);
    const host = req.get("host");
    const protocol = req.protocol;
    return res.status(201).json({
      shortcode: entity.shortcode,
      short_url: `${protocol}://${host}/${entity.shortcode}`,
    });
  };

  redirect = async (req: Request, res: Response) => {
    const dto: GetUrlDTO = {
      shortcode: req.params.shortcode,
    };

    const longUrl = await this.getOriginalUrlUseCase.execute(dto);
    if (!longUrl) {
      return res.status(404).json({ message: "Not found" });
    }
    return res.redirect(302, longUrl);
  };

  health = async (_req: Request, res: Response) => {
    return res.status(200).json({ status: "ok" });
  };
}
