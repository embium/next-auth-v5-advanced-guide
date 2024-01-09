import { router, publicProcedure, protectedProcedure } from '@/server/api/trpc';
import { UserRole } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { Session } from 'inspector';
import { z } from 'zod';

export const UserSchema = z.object({
  id: z.string(),
  name: z.string().nullable().optional(),
  email: z.string().email().nullable().optional(),
  role: z.enum([UserRole.ADMIN, UserRole.USER]),
  isTwoFactorEnabled: z.boolean(),
  isOAuth: z.boolean(),
  password: z.string().nullable().optional(),
  newPassword: z.string().nullable().optional(),
});

export const SessionSchema = z.object({});

export const usersRouter = router({
  usersRole: protectedProcedure
    .input(z.void())
    .output(z.object({ role: z.enum([UserRole.ADMIN, UserRole.USER]) }))
    .query(async ({ ctx }) => {
      return { role: UserRole[ctx.session.user.role] };
    }),
  session: protectedProcedure
    .input(z.void())
    .output(UserSchema)
    .query(async ({ ctx }) => {
      return ctx.session.user;
    }),
  me: protectedProcedure
    .input(z.void())
    .output(SessionSchema)
    .query(async ({ ctx }) => {
      const user = ctx.db.user.findUnique({
        where: {
          id: ctx.session.user.id,
        },
        include: {
          accounts: true,
        },
      });

      console.log(user);
      if (!user) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'User not found',
        });
      }

      return user;
    }),
});
