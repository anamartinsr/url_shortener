import Hashids from 'hashids';
import { env } from '../../infrastructure/config/env';

export class HashidService {
  private hashids: Hashids;

  constructor() {
    this.hashids = new Hashids(env.hashidsSalt, env.hashidsMinLength, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
  }

  encode(id: number): string {
    return this.hashids.encode(id);
  }

  decode(hash: string): number | null {
    const res = this.hashids.decode(hash);
    if (res.length) {
      return Number(res[0]);
    }
    return null;
  }
}
