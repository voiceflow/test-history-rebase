import { BaseModel } from "../models/BaseModel";

export class AbstractFactory extends BaseModel {
	constructor(name) {
		super();
		this.type = name;
	}

	getType(): string {
		return this.type;
	}

	// abstract getNewInstance(initialConfig?: any): T;
}
