import _ from 'lodash';
import { DefaultNodeModel,Toolkit } from './../main.js'
import { BlockPortModel } from './BlockPortModel';
const toolkit = new Toolkit();

export class BlockNodeModel extends DefaultNodeModel {
	constructor(name: string = "Untitled", color: string = "rgb(0,192,255)", id, fade: boolean = false) {
		super(name, color, id);
		this.fade = fade
		this.linter = []
	}

	addInPort(label: string): BlockPortModel {
		return this.addPort(new BlockPortModel(true, toolkit.UID(), label, toolkit.UID()));
	}

	addOutPort(label: string): BlockPortModel {
		return this.addPort(new BlockPortModel(false, toolkit.UID(), label, toolkit.UID()));
	}

	deSerialize(object, engine: DiagramEngine, parentCombine=null) {
			super.deSerialize(object, engine);
			this.combines = object.combines;
			this.parentCombine = parentCombine;
			this.fade = object.fade;
			this.linter = object.linter;
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
			name: this.name,
			color: this.color,
			combines: this.combines,
			fade: this.fade,
			linter: this.linter
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
