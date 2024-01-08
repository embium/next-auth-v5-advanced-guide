import { UserInfo } from '@/components/user-info';
import { api } from '@/app/_trpc/server';

const ServerPage = async () => {
  const user = await api.users.me();

  return (
    <UserInfo
      label="💻 Server component"
      user={user}
    />
  );
};

export default ServerPage;
