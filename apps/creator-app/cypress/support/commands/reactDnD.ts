/* eslint-disable promise/always-return */
class DndSimulatorDataTransfer {
  data: Record<string, unknown> = {};

  files: unknown[] = [];

  items: unknown[] = [];

  types: string[] = [];

  dropEffect = 'move';

  effectAllowed = 'all';

  clearData(format?: string) {
    if (format) {
      delete this.data[format];

      const index = this.types.indexOf(format);

      delete this.types[index];
      delete this.data[index];
    } else {
      this.data = {};
    }
  }

  setData(format: string, data: unknown) {
    this.data[format] = data;
    this.items.push(data);
    this.types.push(format);
  }

  getData(format: string) {
    if (format in this.data) {
      return this.data[format];
    }

    return '';
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setDragImage(img: string, xOffset: number, yOffset: number) {}
}

Cypress.Commands.add('reactDnD', { prevSubject: 'element' }, ($node, targetNodeSelector, { offsetX, offsetY }) => {
  const dataTransfer = new DndSimulatorDataTransfer();

  cy.wrap($node).trigger('mousedown', { which: 1, force: true }).trigger('dragstart', { dataTransfer, force: true }).trigger('drag', { force: true });

  cy.get(targetNodeSelector).then(($el) => {
    const { x, y } = $el.get(0).getBoundingClientRect();

    cy.wrap($el.get(0))
      .trigger('dragover', { dataTransfer, force: true })
      .trigger('drop', { dataTransfer, force: true, clientX: x + offsetX, clientY: y + offsetY })
      .trigger('dragend', { dataTransfer, force: true })
      .trigger('mouseup', { force: true, which: 1 });
  });
});
