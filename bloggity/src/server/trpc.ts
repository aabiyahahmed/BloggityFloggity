import { initTRPC } from '@trpc/server';
import { db } from './db';

export const createContext = () => ({ db });

const t = initTRPC.context<typeof createContext>().create();

export const router = t.router;
export const publicProcedure = t.procedure;
