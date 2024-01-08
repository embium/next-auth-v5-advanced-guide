import { fetchRequestHandler } from '@trpc/server/adapters/fetch';

import { appRouter } from '@/server/api/routers';
import { currentSession } from '@/lib/auth';
import { db } from '@/lib/db';

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: async () => {
      const session = await currentSession();
      return {
        session: session,
        db: db,
      };
    },
  });

export { handler as GET, handler as POST };
