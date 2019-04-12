import { BaseWidget } from "./BaseWidget";

// export interface LinkProps extends BaseWidgetProps {
// 	link: LinkModel;
// 	diagramEngine: DiagramEngine;
// 	children?: any;
// }
//
// export interface LinkState {}
//
// /**
//  * @author Dylan Vorster
//  */
export class LinkWidget extends BaseWidget {
	constructor(props) {
		super("srd-link", props);
		this.state = {};
	}

	// shouldComponentUpdate() {
	// 	return this.props.diagramEngine.canEntityRepaint(this.props.link);
	// }

	render() {
		return this.props.children;
	}
}
