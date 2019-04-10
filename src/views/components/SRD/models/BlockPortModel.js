import { PortModel } from './../main.js'
import { Toolkit } from './../Toolkit'
import { BlockLinkModel } from './BlockLinkModel'

import _ from "lodash"

const toolkit = new Toolkit()

export class BlockPortModel extends PortModel {
	constructor(isInput, name, label = null, id) {
		super(name, "default", id)
		this.in = isInput
		this.label = label || name
	}

	deSerialize(object, engine) {
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

	link(port) {
		let link = this.createLinkModel()
		link.setSourcePort(this)
		link.setTargetPort(port)
		return link
	}

	addLink(link) {
		this.links[link.getID()] = link;
	}

	setSelected(selected) {
		this.selected = selected
	}

	canLinkToPort(port) {
		if (port instanceof BlockPortModel) {
			return (this.in !== port.in && (port.in || _.size(port.links) <= port.maximumLinks) && (this.parent !== port.parent || (port.parent.extras.type === 'god' && this.parent.extras.type === 'god')))
		}
		return false
	}

	removeLink(link) {
		this.setSelected(false)
		delete this.links[link.getID()]
	}

	createLinkModel() {
		let link;
		let numberOfLinks = _.size(this.links)

		if (this.maximumLinks === 1 && numberOfLinks >= 1) {
			_.values(this.links).forEach(link => link.remove())
		}
		this.setSelected(true)
		if(!link) link = new BlockLinkModel("default", toolkit.UID(), false)

		return link
	}
}
