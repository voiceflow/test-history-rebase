import { AbstractControl } from '@/legacy/control';

class VariableService extends AbstractControl {
  public async add(versionID: string, variable: string): Promise<void> {
    await this.models.version.variable.add({ versionID, variable });
  }

  public async addMany(versionID: string, variables: string[]): Promise<void> {
    await this.models.version.variable.addMany({ versionID, variables });
  }

  public async delete(versionID: string, variable: string): Promise<void> {
    await this.models.version.variable.remove({ versionID, variable });
  }

  public async deleteMany(versionID: string, variables: string[]): Promise<void> {
    await this.models.version.variable.removeMany({ versionID, variables });
  }
}

export default VariableService;
