import _ from 'lodash';
import { DefaultNodeModel,Toolkit } from './../main.js'
import { BlockPortModel } from './BlockPortModel';
const toolkit = new Toolkit();

export class BlockNodeModel extends DefaultNodeModel {
	constructor(name: string = "Untitled", color: string = "rgb(0,192,255)", id) {
		super(name, color, id);
	}

	addInPort(label: string): BlockPortModel {
		return this.addPort(new BlockPortModel(true, toolkit.UID(), label, toolkit.UID()));
	}

	addOutPort(label: string): BlockPortModel {
		return this.addPort(new BlockPortModel(false, toolkit.UID(), label, toolkit.UID()));
	}

	deSerialize(object, engine: DiagramEngine, parentCombine=null) {
			super.deSerialize(object, engine);
			this.combines = object.combines ? object.combines : [];
			this.parentCombine = parentCombine;
			return this;
	}

	setLocked(locked) {
		this.locked = locked;
		return this;
	}

	isLocked(){
		return this.locked;
	}
	
	serialize() {
		return _.merge(super.serialize(), {
			combines: !_.isEmpty(this.combines) ? this.combines : null,
		});
	}
	setSelected(selected) {
		super.setSelected(selected)
	}
	removePort(port) {
		//clear the parent node reference
		if (port instanceof BlockPortModel && this.ports[port.name]) {
			this.ports[port.name].setParent(null);
			let links = this.ports[port.name].getLinks();
			for(let key in links){
				links[key].remove();
			}
			delete this.ports[port.name];
		}
	}
}
