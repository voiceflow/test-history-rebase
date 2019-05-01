import { BaseModel } from "./BaseModel";
import * as _ from "lodash";

export class PointModel extends BaseModel {
	// x: number;
	// y: number;

	constructor(link, points, id) {
		super("default", id);
		this.x = points.x;
		this.y = points.y;
		this.parent = link;
	}

	getSelectedEntities() {
		if (super.isSelected() && !this.isConnectedToPort()) {
			return [this];
		}
		return [];
	}

	isConnectedToPort() {
		const port = this.parent.getPortForPoint(this)
		return port !== null && !port.hidden;
	}

	getLink() {
		return this.getParent();
	}

	deSerialize(ob, engine) {
		super.deSerialize(ob, engine);
		this.x = ob.x;
		this.y = ob.y;
	}

	serialize() {
		return _.merge(super.serialize(), {
			x: this.x,
			y: this.y
		});
	}

	remove() {
		//clear references
		if (this.parent) {
			this.parent.removePoint(this);
		}
		super.remove();
	}

	updateLocation(points) {
		this.x = points.x;
		this.y = points.y;
	}

	getX() {
		return this.x;
	}

	getY() {
		return this.y;
	}

	isLocked() {
		return super.isLocked() || this.getParent().isLocked();
	}
}
