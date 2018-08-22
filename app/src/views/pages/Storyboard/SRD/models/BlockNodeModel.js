import { DefaultNodeModel, Toolkit, PortModel } from 'storm-react-diagrams'
import { BlockPortModel } from './BlockPortModel';

export class BlockNodeModel extends DefaultNodeModel {
	constructor(name: string = "Untitled", color: string = "rgb(0,192,255)") {
		super(name, color);
	}

	addInPort(label: string): BlockPortModel {
		return this.addPort(new BlockPortModel(true, Toolkit.UID(), label));
	}

	addOutPort(label: string): BlockPortModel {
		return this.addPort(new BlockPortModel(false, Toolkit.UID(), label));
	}

	removePort(port: PortModel) {
		//clear the parent node reference
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