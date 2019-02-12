import * as _ from "lodash";

import { BaseModel } from "./BaseModel";

export class LabelModel extends BaseModel {
	constructor(type, id) {
		super(type, id);
		this.offsetX = 0;
		this.offsetY = 0;
	}

	deSerialize(ob, engine) {
		super.deSerialize(ob, engine);
		this.offsetX = ob.offsetX;
		this.offsetY = ob.offsetY;
	}

	serialize() {
		return _.merge(super.serialize(), {
			offsetX: this.offsetX,
			offsetY: this.offsetY
		});
	}
}
