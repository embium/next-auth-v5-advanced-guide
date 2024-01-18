import { currentRole } from '@/lib/auth';
import { db } from '@/lib/db';
import { UserRole } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(req: NextRequest, res: NextResponse) {
  const { categoryId } = await req.json();

  const role = await currentRole();

  if (role !== UserRole.ADMIN) {
    return new NextResponse(null, { status: 403 });
  }

  const category = await db.category.findUnique({
    where: { id: categoryId },
  });

  if (!category) return new NextResponse('Category not found', { status: 400 });

  await db.category.delete({
    where: { id: categoryId },
  });

  return new NextResponse(null, { status: 200 });
}
