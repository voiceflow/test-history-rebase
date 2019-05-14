import React from "react";
import { DiagramEngine, DefaultLinkWidget, LinkModel } from "./../main.js";
import { Toolkit } from './../Toolkit';
import { BlockLinkModel } from './../models/BlockLinkModel'

const toolkit = new Toolkit()
export class BlockLinkFactory extends LinkModel{
	constructor(color='#E3E9EE', width=2.5, preview) {
		super("default");
		this.color = color;
		this.width = width;
		this.preview = preview
	}

	generateReactWidget(diagramEngine: DiagramEngine, link: BlockLinkModel, preview): JSX.Element {
		return React.createElement(DefaultLinkWidget, {
			link: link,
			diagramEngine: diagramEngine,
			preview: this.preview

		});
	}

	getNewInstance(initialConfig): BlockLinkModel {
		return new BlockLinkModel("default", toolkit.UID(), false);
	}

	getType(){
		return this.type;
	}
	generateLinkSegment(model: BlockLinkModel, widget: DefaultLinkWidget, selected: boolean, path: string) {
		return (
			<path
				className={selected ? widget.bem("--path-selected") : ""}
				strokeWidth={1.5}
				stroke={"#8DA2B5"}
				d={path}
			/>
		);
	}
	generateLinkSegmentWithEnd(model: BlockLinkModel, widget: DefaultLinkWidget, selected: boolean, path: string) {
		return (
			<path
				className={selected ? widget.bem("--path-selected") : ""}
				markerEnd='url(#head)'
				strokeWidth={1.5}
				stroke={"#8DA2B5"}
				d={path}
			/>
		);
	}
}
