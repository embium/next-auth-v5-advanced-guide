import { api } from '@/app/_trpc/server';
import { Settings } from '@/components/settings';

const SettingsPage = async () => {
  const user = await api.users.me();

  return <Settings user={user} />;
};

export default SettingsPage;
