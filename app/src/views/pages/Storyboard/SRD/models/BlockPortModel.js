import { PortModel, DiagramEngine, LinkModel } from 'storm-react-diagrams'
import { BlockLinkModel } from './BlockLinkModel'

import * as _ from "lodash";

export class BlockPortModel extends PortModel {
	in: boolean;
	label: string;
	links: { [id: string]: BlockLinkModel };

	constructor(isInput: boolean, name: string, label: string = null, id?: string) {
		super(name, "default", id);
		this.in = isInput;
		this.label = label || name;
	}

	deSerialize(object, engine: DiagramEngine) {
		super.deSerialize(object, engine);
		this.in = object.in;
		this.label = object.label;
	}

	serialize() {
		return _.merge(super.serialize(), {
			in: this.in,
			label: this.label
		});
	}

	link(port: PortModel): LinkModel {
		let link = this.createLinkModel();
		link.setSourcePort(this);
		link.setTargetPort(port);
		return link;
	}

	canLinkToPort(port: PortModel): boolean {
		if (port instanceof BlockPortModel) {
			return this.in !== port.in;
		}
		return true;
	}

	removeLink(link: LinkModel) {
		delete this.links[link.getID()];
	}

	fuckLinkModel(): LinkModel | null {
		if (_.isFinite(this.maximumLinks)) {
			let numberOfLinks: number = _.size(this.links);
			// console.log("MAX: " + this.maximumLinks);
			// console.log(numberOfLinks);
			if (this.maximumLinks === 1 && numberOfLinks >= 1) {
				return _.values(this.links)[0];
			} else if (numberOfLinks >= this.maximumLinks) {
				return null;
			}
		}
		return null;
	}

	createLinkModel(): LinkModel {
		let link = super.createLinkModel();

		return link || new BlockLinkModel();
	}
}
