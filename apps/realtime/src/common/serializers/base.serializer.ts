export abstract class BaseSerializer<Type extends Record<string, any>, NewType extends Record<string, any>> {
  abstract serialize(data: Type): NewType;

  constructor() {
    this.nullable = this.nullable.bind(this);
    this.iterable = this.iterable.bind(this);
  }

  nullable(data: Type): NewType;

  nullable(data: Type | null): NewType | null;

  nullable(data: Type | null): NewType | null {
    if (!data) return null;

    return this.serialize(data);
  }

  iterable(data: Type[]): NewType[] {
    return data.map((item) => this.nullable(item));
  }
}
