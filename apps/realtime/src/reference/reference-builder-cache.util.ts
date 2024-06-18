import { ReferenceResource } from '@voiceflow/dtos';

export class ReferenceBuilderCacheUtil {
  private readonly cache: Partial<Record<string, ReferenceResource | null>> = {};

  constructor(private readonly getOrCreateResource: (id: string) => Promise<ReferenceResource | null>) {}

  set(id: string, resource: ReferenceResource | null) {
    this.cache[id] = resource;
  }

  get(id: string) {
    return this.cache[id] ?? null;
  }

  getOrCreate = async (id: string) => {
    if (this.cache[id] === undefined) {
      this.cache[id] = await this.getOrCreateResource(id);
    }

    return this.cache[id] ?? null;
  };
}
