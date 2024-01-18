import { currentRole } from '@/lib/auth';
import { db } from '@/lib/db';
import { UserRole } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, res: NextResponse) {
  const categoryId = req.nextUrl.searchParams.get('categoryId');

  if (!categoryId) {
    return new NextResponse(null, { status: 204 });
  }

  const role = await currentRole();

  if (role !== UserRole.ADMIN) {
    return new NextResponse(null, { status: 403 });
  }

  const entity = await db.entity.findMany({
    where: { categoryId: categoryId },
    include: {
      category: true,
    },
  });

  if (entity.length == 0)
    return new NextResponse('No entities', { status: 400 });

  return new NextResponse(JSON.stringify(entity), { status: 200 });
}
