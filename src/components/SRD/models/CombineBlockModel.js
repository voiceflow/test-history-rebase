import { Toolkit, PortModel } from './../main.js'
import { BlockPortModel } from './BlockPortModel';

const toolkit = new Toolkit()
export class BlockNodeModel extends BlockPortModel {
	constructor(name: string = "Untitled", color: string = "rgb(0,192,255)") {
		super(name, color);
	}

	addInPort(label: string): BlockPortModel {
		return this.addPort(new BlockPortModel(true, toolkit.UID(), label, toolkit.UID()));
	}

	addOutPort(label: string): BlockPortModel {
		return this.addPort(new BlockPortModel(false, toolkit.UID(), label, toolkit.UID()));
	}

	removePort(port: PortModel) {
		// clear the parent node reference
		if (this.ports[port.name]) {
			this.ports[port.name].setParent(null);
			let links = this.ports[port.name].getLinks();
			for(let key in links){
				links[key].remove();
			}
			delete this.ports[port.name];
		}
	}
}
