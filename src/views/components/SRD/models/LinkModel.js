import { BaseModel } from "./BaseModel";
import { PointModel } from "./PointModel";
import * as _ from "lodash";
import { Toolkit } from './../Toolkit'

const toolkit = new Toolkit()
export class LinkModel extends BaseModel {
	constructor(linkType = "default", id, testing=true) {
		super(linkType, id);
		this.points = !testing ? [new PointModel(this, { x: 0, y: 0 }, toolkit.UID()), new PointModel(this, { x: 0, y: 0 }, toolkit.UID())] : null;
		this.extras = {};
		this.sourcePort = null;
		this.targetPort = null;
		this.labels = [];
		this.hidden = false;
	}

	deSerialize(ob, engine) {
		super.deSerialize(ob, engine);
		this.extras = {};
		this.labels = [];
		this.points = _.map(ob.points || [], (point) => {
			var p = new PointModel(this, { x: point.x, y: point.y });
			p.deSerialize(point, engine);
			return p;
		});

		if (ob.target && this.getParent().getNode(ob.target)) {
			if (this.getParent().getNode(ob.target).extras.type === 'god') {
				let combineBlock = this.getParent().getNode(ob.target)
				this.setTargetPort(_.find(_.head(combineBlock.combines).ports, p => p.id === ob.targetPort))
			} else {
				this.setTargetPort(
					this.getParent()
						.getNode(ob.target)
						.getPortFromID(ob.targetPort)
				);
			}
		}

		if (ob.source && this.getParent().getNode(ob.source)) {
			if (this.getParent().getNode(ob.source).extras.type === 'god') {
				let combineBlock = this.getParent().getNode(ob.source)
				this.setSourcePort(_.find(_.last(combineBlock.combines).ports, p => p.id === ob.sourcePort))
			} else {
				this.setSourcePort(
					this.getParent()
						.getNode(ob.source)
						.getPortFromID(ob.sourcePort)
				);
			}
		}

		if(ob.hidden) this.hidden = ob.hidden
	}

	serialize() {
		const serialized = {
			source: this.sourcePort ? this.sourcePort.getParent().id : null,
			sourcePort: this.sourcePort ? this.sourcePort.id : null,
			target: this.targetPort ? this.targetPort.getParent().id : null,
			targetPort: this.targetPort ? this.targetPort.id : null,
			points: _.map(this.points, point => {
				return point.serialize();
			}),
		}
		if (this.hidden) serialized.hidden = this.hidden
		return _.merge(super.serialize(), serialized);
	}

	doClone(lookupTable = {}, clone) {
		clone.setPoints(
			_.map(this.getPoints(), (point) => {
				return point.clone(lookupTable);
			})
		);
		if (this.sourcePort) {
			clone.setSourcePort(this.sourcePort.clone(lookupTable));
		}
		if (this.targetPort) {
			clone.setTargetPort(this.targetPort.clone(lookupTable));
		}
	}

	remove() {
		if (this.sourcePort) {
			this.sourcePort.removeLink(this);
		}
		if (this.targetPort) {
			this.targetPort.removeLink(this);
		}
		super.remove();
	}

	isLastPoint(point) {
		var index = this.getPointIndex(point);
		return index === this.points.length - 1;
	}

	getPointIndex(point) {
		return this.points.indexOf(point);
	}

	getPointModel(id) {
		for (var i = 0; i < this.points.length; i++) {
			if (this.points[i].id === id) {
				return this.points[i];
			}
		}
		return null;
	}

	getPortForPoint(point){
		if (this.sourcePort !== null && this.getFirstPoint().getID() === point.getID()) {
			return this.sourcePort;
		}
		if (this.targetPort !== null && this.getLastPoint().getID() === point.getID()) {
			return this.targetPort;
		}
		return null;
	}

	getPointForPort(port) {
		if (this.sourcePort !== null && this.sourcePort.getID() === port.getID()) {
			return this.getFirstPoint();
		}
		if (this.targetPort !== null && this.targetPort.getID() === port.getID()) {
			return this.getLastPoint();
		}
		return null;
	}

	getFirstPoint() {
		return this.points[0];
	}

	getLastPoint() {
		return this.points[this.points.length - 1];
	}

	setSourcePort(port) {
		if (port !== null) {
			port.addLink(this);
		}
		if (this.sourcePort !== null) {
			this.sourcePort.removeLink(this);
		}
		this.sourcePort = port;
		this.iterateListeners((listener, event) => {
			if (listener.sourcePortChanged) {
				listener.sourcePortChanged({ ...event, port: port });
			}
		});
	}

	getSourcePort() {
		return this.sourcePort;
	}

	getTargetPort() {
		return this.targetPort;
	}

	setTargetPort(port) {
		if (port !== null) {
			port.addLink(this);
		}
		if (this.targetPort !== null) {
			this.targetPort.removeLink(this);
		}
		this.targetPort = port;
		this.iterateListeners((listener, event) => {
			if (listener.targetPortChanged) {
				listener.targetPortChanged({ ...event, port: port });
			}
		});
	}

	point(x, y) {
		return this.addPoint(this.generatePoint(x, y));
	}

	addLabel(label) {
		label.setParent(this);
		this.labels.push(label);
	}

	getPoints() {
		return this.points;
	}

	setPoints(points) {
		_.forEach(points, point => {
			point.setParent(this);
		});
		this.points = points;
	}

	removePoint(pointModel) {
		this.points.splice(this.getPointIndex(pointModel), 1);
	}

	removePointsBefore(pointModel) {
		this.points.splice(0, this.getPointIndex(pointModel));
	}

	removePointsAfter(pointModel) {
		this.points.splice(this.getPointIndex(pointModel) + 1);
	}

	removeMiddlePoints() {
		if (this.points.length > 2) {
			this.points.splice(0, this.points.length - 2);
		}
	}

	addPoint(pointModel, index = 1) {
		pointModel.setParent(this);
		this.points.splice(index, 0, pointModel);
		return pointModel;
	}

	generatePoint(x = 0, y = 0) {
		return new PointModel(this, { x: x, y: y }, toolkit.UID());
	}

	checkHidden() {
		if (this.sourcePort.hidden || this.targetPort.hidden) {
			this.hidden = true
		} else {
			this.hidden = false
		}
	}
}
