import { Inject, Injectable } from '@nestjs/common';

import { ProgramORM } from '../orm/program.orm';

@Injectable()
export class ProgramService {
  constructor(@Inject(ProgramORM) private orm: ProgramORM) {}

  public async findByID(programID: string) {
    return this.orm.findByID(programID);
  }
}
