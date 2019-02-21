import { LinkModel } from "../../models/LinkModel";
import { DefaultLabelModel } from "./DefaultLabelModel";
import { LabelModel } from "../../models/LabelModel";
import { Toolkit } from '../../Toolkit'

const toolkit = new Toolkit()
export class DefaultLinkModel extends LinkModel {
	constructor(type = "default") {
		super(type, toolkit.UID(), false);
		this.color = "rgba(255,255,255,0.5)";
		this.width = 3;
		this.curvyness = 50;
	}

	serialize() {
		return super.serialize()
	}

	deSerialize(ob, engine) {
		super.deSerialize(ob, engine);
		this.color = "#555D6D";
		this.width = 2.5;
		this.curvyness = 175;
	}

	addLabel(label) {
		if (label instanceof LabelModel) {
			return super.addLabel(label);
		}
		let labelOb = new DefaultLabelModel();
		labelOb.setLabel(label);
		return super.addLabel(labelOb);
	}

	setWidth(width) {
		this.width = width;
		this.iterateListeners((listener, event) => {
			if (listener.widthChanged) {
				listener.widthChanged({ ...event, width: width });
			}
		});
	}

	setColor(color) {
		this.color = color;
		this.iterateListeners((listener, event) => {
			if (listener.colorChanged) {
				listener.colorChanged({ ...event, color: color });
			}
		});
	}
}
