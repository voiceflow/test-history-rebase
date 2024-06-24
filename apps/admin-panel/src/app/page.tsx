import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const RootPage = () => {
  const lastView = cookies().get('last-view');

  redirect(`/view/${lastView?.value ?? 'workspace/decode-id'}`);
};

export default RootPage;
