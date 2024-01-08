import { currentSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { createCaller } from '@/server/api/routers';

const session = await currentSession();
export const api = createCaller({
  session: session,
  db: db,
});
