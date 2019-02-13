import { BlockPortModel } from "./../models/BlockPortModel";

export class BlockPortFactory {
	constructor() {
		// super("default")
		this.type = "default"
	}

	getNewInstance(initialConfig?: any): BlockPortModel {
		return new BlockPortModel(true, "unknown");
	}

	getType(){
		return this.type;
	}
}
