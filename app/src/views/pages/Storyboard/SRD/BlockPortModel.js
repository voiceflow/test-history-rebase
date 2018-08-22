import { DefaultPortModel } from 'storm-react-diagrams'

export class BlockPortModel extends DefaultPortModel {
	constructor(isInput: boolean, name: string, label: string = null, id?: string) {
		super(isInput, name, label, id);
	}
	createLinkModel(): LinkModel {
		let link = super.createLinkModel();
		if(link){ link.setColor("#CCC") }
		return link;
	}
}