import { Inject, Injectable } from '@nestjs/common';

import { PrototypeProgramORM } from '../orm/prototype-program.orm';

@Injectable()
export class PrototypeProgramService {
  constructor(@Inject(PrototypeProgramORM) private orm: PrototypeProgramORM) {}

  public async findByID(programID: string) {
    return this.orm.findByID(programID);
  }
}
