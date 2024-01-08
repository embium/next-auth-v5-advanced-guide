import { router, publicProcedure, protectedProcedure } from '@/server/api/trpc';
import { UserRole } from '@prisma/client';
import { z } from 'zod';

export const SettingsSchema = z.object({
  name: z.string().nullable(),
  isTwoFactorEnabled: z.boolean().nullable(),
  role: z.enum([UserRole.ADMIN, UserRole.USER]),
  email: z.string().email().nullable(),
  password: z.string().min(6).nullable(),
});

export const usersRouter = router({
  isAdmin: protectedProcedure.input(z.void()).query(async ({ ctx }) => {
    if (ctx.session.user.role === 'ADMIN') {
      return true;
    }
    return false;
  }),

  me: protectedProcedure.query(async ({ ctx }) => {
    return ctx.session.user;
  }),
});
