import _ from "lodash";
import { BaseAction } from "./BaseAction";
import { Toolkit } from './../Toolkit';

const toolkit = new Toolkit()

export class MoveItemsAction extends BaseAction {
	constructor(mouseX, mouseY, diagramEngine, e, locked) {
		super(mouseX, mouseY);
		this.moved = false;
		diagramEngine.enableRepaintEntities(diagramEngine.getDiagramModel().getSelectedItems());
		var selectedItems = diagramEngine.getDiagramModel().getSelectedItems();
		if (_.first(selectedItems).extras && _.first(selectedItems).extras.type === "god"  && diagramEngine.getSuperSelect() && diagramEngine.getSuperSelect().parentCombine && diagramEngine.getSuperSelect().parentCombine.id === _.first(selectedItems).id) {
			if (!_.isNull(diagramEngine.getSuperSelect())){
				if (diagramEngine.getSuperSelect().extras && diagramEngine.getSuperSelect().extras.type !== "god" && diagramEngine.getSuperSelect().parentCombine) {
					selectedItems = !_.isNull(diagramEngine.getSuperSelect()) ? [diagramEngine.getSuperSelect()] : diagramEngine.getDiagramModel().getSelectedItems();
				}
			}
		}
		if (locked) selectedItems = []
		var nodeElement = toolkit.closest(e.target, ".node[data-nodeid]");
		this.selectionModels = selectedItems.map(item => {
			return {
				model: item,
				element: nodeElement,
				initialX: item.x,
				initialY: item.y
			};
		});
	}
}
