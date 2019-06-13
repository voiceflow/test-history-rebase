import api from './api';

export default async function mediaInspector(url) {
  try {
    const { data } = await api({
      url: 'inspect-media',
      data: { url },
      method: 'POST',
      timeout: 120000,
    });

    return data;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('api-error', err);

    return {};
  }
}
