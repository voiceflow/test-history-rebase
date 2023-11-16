import { Inject, Injectable } from '@nestjs/common';
import { SendgridService } from '@voiceflow/nestjs-sendgrid';

import { EmailTemplate } from './enum/email-template.enum';

type ExtractSendgridOptions<T> = T extends any[] ? T[number] : T;

type SendOptions = ExtractSendgridOptions<Parameters<SendgridService['send']>[0]>;

type MethodOptions = Omit<SendOptions, 'to' | 'from'>;

@Injectable()
export class EmailService {
  constructor(
    @Inject(SendgridService)
    private readonly sendgrid: SendgridService
  ) {}

  public async sendService(email: string, templateID: EmailTemplate, options?: MethodOptions) {
    await this.sendgrid.send({
      ...options,
      to: { email },
      from: { name: 'Voiceflow Team', email: 'service@voiceflow.com' },
      templateId: templateID,
    });
  }

  public async sendNotifications(email: string, templateID: EmailTemplate, options?: MethodOptions) {
    await this.sendgrid.send({
      ...options,
      to: { email },
      from: { name: 'Voiceflow Team', email: 'notifications@voiceflow.com' },
      templateId: templateID,
    });
  }
}
