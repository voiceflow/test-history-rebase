import { BlockCategory, BlockType } from '@/constants';
import { ClassName, Identifier } from '@/styles/constants';

import { $, cls, dataAttr, id, selector } from './helpers';

const CANVAS = {
  canvas: () => $(id(Identifier.CANVAS)),

  node: (nodeID: string) => $(dataAttr('node-id', nodeID)),
  flowStepLink: (nodeID: string) => $(CANVAS.node(nodeID), cls(ClassName.CANVAS_STEP_ITEM_LABEL)),

  stepMenu: () => $(id(Identifier.STEP_MENU)),
  designMenu: () => $(id(Identifier.DESIGN_MENU)),
  stepMenuSection: (category: BlockCategory) => $(CANVAS.stepMenu(), cls(ClassName.COLLAPSE, category)),
  stepMenuSectionHeader: (category: BlockCategory) => $(CANVAS.stepMenuSection(category), cls(ClassName.COLLAPSE_HEADER)),
  isStepMenuSectionOpened: (category: BlockCategory) =>
    $(CANVAS.stepMenu(), selector(cls(ClassName.COLLAPSE, category)).and(cls(ClassName.COLLAPSE, 'opened')).toString()),

  stepMenuSectionStep: (category: BlockCategory, type: BlockType) =>
    $(CANVAS.stepMenuSection(category), selector(cls(ClassName.STEP_MENU_ITEM)).and(cls(ClassName.STEP_MENU_ITEM, type)).toString()),
} as const;

export default CANVAS;
