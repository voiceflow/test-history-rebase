export const encodeTextDocumentTitle = async (text: string) => btoa(text);

export const decodeTextDocumentTitle = async (encodedText: string) => atob(encodedText).slice(0, 200);

export const formDataFactoryFromText = async (text: string, fileName?: string) => {
  const file = new Blob([text], { type: 'text/plain' });

  const formData = new FormData();

  formData.append('file', file, fileName ?? (await encodeTextDocumentTitle(text)));
  formData.append('canEdit', 'true');

  return formData;
};
