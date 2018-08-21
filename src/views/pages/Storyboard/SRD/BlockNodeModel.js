import { DefaultNodeModel, Toolkit } from 'storm-react-diagrams'
import { BlockPortModel } from './BlockPortModel';

export class BlockNodeModel extends DefaultNodeModel {
	constructor(name: string = "Untitled", color: string = "rgb(0,192,255)") {
		super(name, color);
	}

	addInPort(label: string): DefaultPortModel {
		return this.addPort(new BlockPortModel(true, Toolkit.UID(), label));
	}

	addOutPort(label: string): DefaultPortModel {
		return this.addPort(new BlockPortModel(false, Toolkit.UID(), label));
	}
}