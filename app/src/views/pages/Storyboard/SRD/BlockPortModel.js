import { DefaultPortModel, DefaultLinkModel } from 'storm-react-diagrams'

export class BlockPortModel extends DefaultPortModel {
	constructor(isInput: boolean, name: string, label: string = null, id?: string) {
		super(isInput, name, label, id);
	}
	createLinkModel(): LinkModel {
		let link = new DefaultLinkModel();
		link.setColor("#CCC")
		return link;
	}
}