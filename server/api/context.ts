import { db } from '@/lib/db';
import { CreateNextContextOptions } from '@trpc/server/adapters/next';
import { inferAsyncReturnType } from '@trpc/server';
import { Session } from 'next-auth';
import { currentSession } from '@/lib/auth';

type CreateContextOptions = {
  session: Session | null;
};

export const createContextInner = (opts: CreateContextOptions) => {
  return {
    session: opts.session,
    db,
  };
};

export const createContext = async (opts: CreateNextContextOptions) => {
  const session = await currentSession();
  return createContextInner({
    session,
  });
};

export type Context = inferAsyncReturnType<typeof createContext>;
