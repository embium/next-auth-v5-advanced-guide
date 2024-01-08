'use client';

import { trpc } from '@/app/_trpc/client';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

const AdminPage = () => {
  const isAdmin = trpc.users.isAdmin.useQuery();
  const label = 'Admin';
  return (
    <Card className="w-[600px] shadow-md">
      <CardHeader>
        <p className="text-2xl font-semibold text-center">{label}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {isAdmin.data ? 'I am admin' : 'I am not admin'}
      </CardContent>
    </Card>
  );
};

export default AdminPage;
