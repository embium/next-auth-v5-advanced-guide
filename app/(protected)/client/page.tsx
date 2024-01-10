'use client';

import { trpc } from '@/app/_trpc/client';
import { UserInfo } from '@/components/user-info';

const ClientPage = () => {
  const { data: user } = trpc.users.me.useQuery(undefined, {});

  return (
    <UserInfo
      label="📱 Client component"
      user={user}
    />
  );
};

export default ClientPage;
