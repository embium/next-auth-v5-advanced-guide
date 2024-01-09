'use client';

import { trpc } from '@/app/_trpc/client';
import { UserInfo } from '@/components/user-info';

const ClientPage = () => {
  const user = trpc.users.session.useQuery(undefined, {});

  return (
    <UserInfo
      label="📱 Client component"
      user={user.data}
    />
  );
};

export default ClientPage;
