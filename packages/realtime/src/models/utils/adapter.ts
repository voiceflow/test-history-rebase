interface FromDB<DBModel, Model> {
  (dbModel: DBModel): Model;

  <PartialDBModel extends Partial<DBModel>>(dbModel: PartialDBModel): Pick<Model, Extract<keyof Model, keyof PartialDBModel>>;
}

interface MapFromDB<DBModel, Model> {
  (dbModels: DBModel[]): Model[];

  <PartialDBModel extends Partial<DBModel>>(dbModels: PartialDBModel[]): Pick<Model, Extract<keyof Model, keyof PartialDBModel>>[];
}

interface ToDB<DBModel, Model> {
  (model: Model): DBModel;

  <PartialModel extends Partial<Model>>(model: PartialModel): Pick<DBModel, Extract<keyof DBModel, keyof PartialModel>>;
}

interface MapToDB<DBModel, Model> {
  (models: Model[]): DBModel[];

  <PartialModel extends Partial<Model>>(diagrams: PartialModel[]): Pick<DBModel, Extract<keyof DBModel, keyof PartialModel>>[];
}

export interface Adapter<DBModel, Model> {
  toDB: ToDB<DBModel, Model>;
  fromDB: FromDB<DBModel, Model>;
  mapToDB: MapToDB<DBModel, Model>;
  mapFromDB: MapFromDB<DBModel, Model>;
}

export const factory = <DBModel, Model>(
  fromDB: (dbModel: Partial<DBModel>) => Partial<Model>,
  toDB: (model: Partial<Model>) => Partial<DBModel>
): Adapter<DBModel, Model> => ({
  toDB: toDB as unknown as ToDB<DBModel, Model>,
  fromDB: fromDB as unknown as FromDB<DBModel, Model>,
  mapToDB: ((models: Model[]) => models.map(toDB)) as MapToDB<DBModel, Model>,
  mapFromDB: ((dbModels: DBModel[]) => dbModels.map(fromDB)) as MapFromDB<DBModel, Model>,
});
