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
    console.warn('api-error', err); // eslint-disable-line

    return {};
  }
}
