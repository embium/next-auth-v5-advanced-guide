'use server';

import * as z from 'zod';

import { EntitySchema } from '@/schemas';
import { getUserById } from '@/data/user';
import { currentUser } from '@/lib/auth';
import { db } from '@/lib/db';

export const entity = async (values: z.infer<typeof EntitySchema>) => {
  const user = await currentUser();

  if (!user) {
    return { error: 'Unauthorized' };
  }

  const dbUser = await getUserById(user.id);

  if (!dbUser) {
    return { error: 'Unauthorized' };
  }

  const validatedFields = EntitySchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: 'Invalid fields!' };
  }

  const { title, body, category, categoryId } = validatedFields.data;

  if (!title || !body || !category || !categoryId) {
    return { error: 'Invalid fields!' };
  }

  await db.entity.create({
    data: {
      title: title,
      body: body,
      category: { connect: { id: categoryId } },
    },
  });

  return { success: 'Category Created!' };
};
