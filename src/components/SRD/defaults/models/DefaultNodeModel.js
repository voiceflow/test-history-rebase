import _ from "lodash";

import { Toolkit } from "../../Toolkit.jsx";
import { NodeModel } from "../../models/NodeModel";
import { DefaultPortModel } from "./DefaultPortModel";

/**
 * @author Dylan Vorster
 */
export class DefaultNodeModel extends NodeModel {
	constructor(name = "Untitled", color = "rgb(0,192,255)", id) {
		super("default", id);
		this.name = name;
		this.color = color;
	}

	addInPort(label) {
		return this.addPort(new DefaultPortModel(true, Toolkit.UID(), label));
	}

	addOutPort(label){
		return this.addPort(new DefaultPortModel(false, Toolkit.UID(), label));
	}
	setSelected(selected) {
		super.setSelected(selected)
	}
	deSerialize(object, engine, keepLink) {
		super.deSerialize(object, engine, keepLink);
		this.name = object.name;
		this.color = null;
	}

	serialize() {
		return _.merge(super.serialize(), {
			name: this.name,
		});
	}

	getInPorts() {
		return _.filter(this.ports, portModel => {
			return portModel.in;
		});
	}

	getOutPorts() {
		return _.filter(this.ports, portModel => {
			return !portModel.in;
		});
	}
}
