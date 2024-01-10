'use server';

import { api } from '@/app/_trpc/server';

const SettingsPage = async () => {
  const user = await api.users.me();
};

export default SettingsPage;
