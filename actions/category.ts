'use server';

import * as z from 'zod';

import { CategorySchema } from '@/schemas';
import { getUserById } from '@/data/user';
import { currentUser } from '@/lib/auth';
import { db } from '@/lib/db';

export const category = async (values: z.infer<typeof CategorySchema>) => {
  const user = await currentUser();

  if (!user) {
    return { error: 'Unauthorized' };
  }

  const dbUser = await getUserById(user.id);

  if (!dbUser) {
    return { error: 'Unauthorized' };
  }

  const validatedFields = CategorySchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: 'Invalid fields!' };
  }

  const { parentCategory, category } = validatedFields.data;

  if (!parentCategory && !category) {
    return { error: 'Invalid fields!' };
  }

  const parentCategoryId = await db.category.findFirst({
    where: { name: parentCategory },
  });

  await db.category.create({
    data: {
      name: category,
      parentCategory: { connect: { id: parentCategoryId?.id } },
    },
  });

  return { success: 'Category Created!' };
};
