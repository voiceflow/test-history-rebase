export const mockAxiosError = (status: number) =>
  Object.assign(new Error(), { isAxiosError: true, response: { status } });
