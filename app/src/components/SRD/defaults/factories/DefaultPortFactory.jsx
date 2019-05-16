import { DefaultPortModel } from "../models/DefaultPortModel";

export class DefaultPortFactory{
	constructor() {
		this.type = "default";
	}

	getNewInstance(initialConfig) {
		return new DefaultPortModel(true, "unknown");
	}
	getType(): string {
		return this.type;
	}
}
