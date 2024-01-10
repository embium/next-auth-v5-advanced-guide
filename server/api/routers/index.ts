import { usersRouter } from '@/server/api/routers/users';
import { router, createCallerFactory } from '@/server/api/trpc';

export const appRouter = router({
  users: usersRouter,
});

export const createCaller = createCallerFactory(appRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
