export const getCypressFilepathMock = (filePath: string) => `C:\\fakepath\\${filePath}`;

export const uploadFile = (selector = 'body') => {
  cy.get(selector).find('input[type="file"]').attachFile({
    filePath: 'image.png',
  });
};
