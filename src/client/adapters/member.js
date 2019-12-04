import { createAdapter } from './utils';

const memberAdapter = createAdapter(
  (data) => {
    const { creator_id, created, email, image, name, status, role } = data;
    return {
      creator_id,
      created,
      email,
      image,
      name,
      status,
      role,
    };
  },
  (data) => ({
    ...data,
  })
);

export default memberAdapter;
