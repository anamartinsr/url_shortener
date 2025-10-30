import { Request, Response } from 'express';
import { CreateShortUrlUseCase } from '../../../application/usecases/createShortUrl.usecase';
import { GetOriginalUrlUseCase } from '../../../application/usecases/getOriginalUrl.usecase';

export class UrlController {
  constructor(
    private createShortUrlUseCase: CreateShortUrlUseCase,
    private getOriginalUrlUseCase: GetOriginalUrlUseCase
  ) {}

  create = async (req: Request, res: Response) => {
    const { long_url } = req.body;
    const result = await this.createShortUrlUseCase.execute({ long_url });
    const host = req.get('host');
    const protocol = req.protocol;
    return res.status(201).json({
      shortcode: result.shortcode,
      short_url: `${protocol}://${host}/${result.shortcode}`
    });
  };

  redirect = async (req: Request, res: Response) => {
    const { shortcode } = req.params;
    const longUrl = await this.getOriginalUrlUseCase.execute(shortcode);
    if (!longUrl) {
      return res.status(404).json({ message: 'Not found' });
    }
    return res.redirect(302, longUrl);
  };

  health = async (_req: Request, res: Response) => {
    return res.status(200).json({ status: 'ok' });
  };
}
