import _ from "lodash";

import { LabelModel } from "../../models/LabelModel";

export class DefaultLabelModel extends LabelModel {
	constructor() {
		super("default");
		this.offsetY = -23;
	}

	setLabel(label) {
		this.label = label;
	}

	deSerialize(ob, engine) {
		super.deSerialize(ob, engine);
		this.label = ob.label;
	}

	serialize() {
		return _.merge(super.serialize(), {
			label: this.label
		});
	}
}
