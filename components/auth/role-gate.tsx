'use client';

import { UserRole } from '@prisma/client';

import { FormError } from '@/components/form-error';
import { trpc } from '@/app/_trpc/client';

interface RoleGateProps {
  children: React.ReactNode;
  allowedRole: UserRole;
}

export const RoleGate = ({ children, allowedRole }: RoleGateProps) => {
  const { data } = trpc.users.usersRole.useQuery();

  if (data?.role !== allowedRole) {
    return (
      <FormError message="You do not have permission to view this content!" />
    );
  }

  return <>{children}</>;
};
