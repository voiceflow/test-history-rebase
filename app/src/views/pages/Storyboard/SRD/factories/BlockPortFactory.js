import { BlockPortModel } from "./../models/BlockPortModel";
import { AbstractPortFactory } from "storm-react-diagrams";

export class BlockPortFactory extends AbstractPortFactory<BlockPortModel> {
	constructor() {
		super("default");
	}

	getNewInstance(initialConfig?: any): BlockPortModel {
		return new BlockPortModel(true, "unknown");
	}
}
