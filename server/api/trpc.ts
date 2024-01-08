import { TRPCError, initTRPC } from '@trpc/server';
import type { OpenApiMeta } from 'trpc-openapi';
import superjson from 'superjson';
import { ZodError } from 'zod';
import { Context } from '@/server/api/context';

const t = initTRPC
  .context<Context>()
  .meta<OpenApiMeta>()
  .create({
    transformer: superjson,
    errorFormatter({ shape }) {
      return shape;
    },
  });

const enforceUserIsAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.session) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'User has no access to this resource',
    });
  }
  return next({
    ctx: {
      ...ctx,
      // infers the `session` as non-nullable
      session: ctx.session,
    },
  });
});

export const { router, createCallerFactory } = t;
export const publicProcedure = t.procedure;
export const protectedProcedure = publicProcedure.use(enforceUserIsAuthed);
