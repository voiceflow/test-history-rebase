import * as React from "react";
import { DiagramEngine, DefaultLinkWidget, AbstractLinkFactory } from "storm-react-diagrams";
import { BlockLinkModel } from './../models/BlockLinkModel'

export class BlockLinkFactory extends AbstractLinkFactory<BlockLinkModel> {
	constructor(color='#E3E9EE', width=2.5) {
		super("default");
		this.color = color;
		this.width = width;
	}

	generateReactWidget(diagramEngine: DiagramEngine, link: BlockLinkModel): JSX.Element {
		return React.createElement(DefaultLinkWidget, {
			link: link,
			diagramEngine: diagramEngine
		});
	}

	getNewInstance(initialConfig?: any): BlockLinkModel {
		return new BlockLinkModel();
	}

	generateLinkSegment(model: BlockLinkModel, widget: DefaultLinkWidget, selected: boolean, path: string) {
		return (
			<path
				className={selected ? widget.bem("--path-selected") : ""}
				strokeWidth={this.width}
				stroke={this.color}
				d={path}
			/>
		);
	}
}
