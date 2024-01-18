import { currentRole } from '@/lib/auth';
import { db } from '@/lib/db';
import { UserRole } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';

export async function DELETE(req: NextApiRequest, res: NextApiResponse) {
  const { categoryId } = req.body;

  const role = await currentRole();

  if (role !== UserRole.ADMIN) {
    return new NextResponse(null, { status: 403 });
  }

  const category = await db.category.findFirst({
    where: { parentCategoryId: categoryId },
  });

  if (!category) return new NextResponse('Category not found', { status: 400 });

  await db.category.deleteMany({
    where: { parentCategoryId: categoryId },
  });

  return new NextResponse(null, { status: 200 });
}
