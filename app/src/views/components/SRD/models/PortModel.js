import { BaseModel } from "./BaseModel";
import * as _ from "lodash";
import { DiagramEngine } from "../DiagramEngine";

export class PortModel extends BaseModel{
	constructor(name, type, id, maximumLinks) {
		super(type, id);
		this.name = name;
		this.links = {};
		this.maximumLinks = maximumLinks;
	}

	deSerialize(ob, engine: DiagramEngine) {
		super.deSerialize(ob, engine);
		this.name = ob.name;
		this.maximumLinks = ob.maximumLinks;
	}

	serialize() {
		return _.merge(super.serialize(), {
			name: this.name,
			parentNode: this.parent.id,
			links: _.map(this.links, link => {
				return link.id;
			}),
			maximumLinks: this.maximumLinks
		});
	}

	doClone(lookupTable = {}, clone) {
		clone.links = {};
		clone.parentNode = this.getParent().clone(lookupTable);
	}

	getNode() {
		return this.getParent();
	}

	getName() {
		return this.name;
	}

	getMaximumLinks() {
		return this.maximumLinks;
	}

	setMaximumLinks(maximumLinks) {
		this.maximumLinks = maximumLinks;
	}

	removeLink(link) {
		delete this.links[link.getID()];
	}

	addLink(link) {
		this.links[link.getID()] = link;
	}

	getLinks() {
		return this.links;
	}

	createLinkModel() {
		if (_.isFinite(this.maximumLinks)) {
			var numberOfLinks: number = _.size(this.links);
			if (this.maximumLinks === 1 && numberOfLinks >= 1) {
				return _.values(this.links)[0];
			} else if (numberOfLinks >= this.maximumLinks) {
				return null;
			}
		}
		return null;
	}

	updateCoords({ x, y, width, height }) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}

	canLinkToPort(port){
		return true;
	}

	isLocked() {
		return super.isLocked() || this.getParent().isLocked();
	}
}
