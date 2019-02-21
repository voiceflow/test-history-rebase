import React from "react";

import { DefaultLinkWidget } from "../widgets/DefaultLinkWidget";
import { DefaultLinkModel } from "../models/DefaultLinkModel";

export class DefaultLinkFactory{
	constructor() {
		this.type = "default"
	}

	generateReactWidget(diagramEngine, link) {
		return React.createElement(DefaultLinkWidget, {
			link: link,
			diagramEngine: diagramEngine
		});
	}

	getNewInstance(initialConfig) {
		return new DefaultLinkModel();
	}

	generateLinkSegment(model, widget, selected, path) {
		return (
			<path
				className={selected ? widget.bem("--path-selected") : ""}
				markerEnd='url(#head)'
				strokeWidth={model.width}
				stroke={model.color}
				d={path}
			/>
		);
	}
	getType(): string {
		return this.type;
	}
}
