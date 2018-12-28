import { PortModel, DiagramEngine, LinkModel } from 'storm-react-diagrams'
import { BlockLinkModel } from './BlockLinkModel'

import * as _ from "lodash"

export class BlockPortModel extends PortModel {
	in: boolean
	label: string
	links: { [id: string]: BlockLinkModel }

	constructor(isInput: boolean, name: string, label: string = null, id?: string) {
		super(name, "default", id)
		this.in = isInput
		this.label = label || name
	}

	deSerialize(object, engine: DiagramEngine) {
		super.deSerialize(object, engine)
		this.in = object.in
		this.label = object.label
	}

	serialize() {
		return _.merge(super.serialize(), {
			in: this.in,
			label: this.label
		})
	}

	setLabel(label) {
		this.label = label
	}

	link(port: PortModel): LinkModel {
		let link = this.createLinkModel()
		link.setSourcePort(this)
		link.setTargetPort(port)
		return link
	}

	setSelected(selected: boolean) {
		this.selected = selected
	}

	canLinkToPort(port: PortModel): boolean {
		if (port instanceof BlockPortModel) {
			return (this.in !== port.in && (port.in || _.size(port.links) <= port.maximumLinks))
		}
		return false
	}

	removeLink(link: LinkModel) {
		this.setSelected(false)
		delete this.links[link.getID()]
	}

	createLinkModel(): LinkModel {
		let link;
		let numberOfLinks = _.size(this.links)

		if (this.maximumLinks === 1 && numberOfLinks >= 1) {
			_.values(this.links).forEach(link => link.remove())
		}
		this.setSelected(true)

		if(!link) link = new BlockLinkModel()

		return link
	}
}
