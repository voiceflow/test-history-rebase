import React from "react";
import { BaseWidget } from "../../widgets/BaseWidget";

// export interface DefaultLabelWidgetProps extends BaseWidgetProps {
// 	model: DefaultLabelModel;
// }

export class DefaultLabelWidget extends BaseWidget {
	constructor(props) {
		super("srd-default-label", props);
	}

	render() {
		return <div {...this.getProps()}>{this.props.model.label}</div>;
	}
}
