export abstract class BaseSerializer<Type extends Record<string, any>, NewType extends Record<string, any>> {
  abstract serialize(data: Type): NewType;

  nullable: {
    (data: Type | null): null extends Type ? null : NewType;
  } = (data: Type | null): any => {
    if (!data) return null;

    return this.serialize(data);
  };

  iterable = (data: Type[]) => data.map(this.nullable);
}
