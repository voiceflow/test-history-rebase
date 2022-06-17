import * as UI from '@voiceflow/ui';

export const getClass = (classname: string) => `.${classname}`;

export const getIdentifier = (id: string) => `#${id}`;

export const createSelectControl = (id: string) => ({
  open: () => cy.get(`#${id}.${UI.ClassName.SELECT}`).click(),
  select: (text: string) => cy.get(`#${id}__nested-menu`).find(`.${UI.ClassName.MENU_ITEM}`).contains(text).click(),
});
