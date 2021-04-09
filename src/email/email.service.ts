import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Mailgun from 'mailgun-js';

import { IMailgunData } from './interfaces/email.interface';

@Injectable()
export class EmailService {
  private mg: Mailgun.Mailgun;

  constructor(private readonly configService: ConfigService) {
    this.mg = Mailgun({
      apiKey: this.configService.get<string>('MAILGUN_API_KEY'),
      domain: this.configService.get<string>('MAILGUN_API_DOMAIN'),
    });
  }

  send(data: IMailgunData): Promise<Mailgun.messages.SendResponse> {
    return new Promise((res, reject) => {
      this.mg.messages().send(data, (error, body) => {
        if (error) reject(error);
        res(body);
      });
    });
  }
}
