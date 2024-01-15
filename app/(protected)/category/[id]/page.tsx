import SmallEntity from '@/components/small-entity';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { db } from '@/lib/db';
import { getAverageRating } from '@/lib/rating';
import Link from 'next/link';

export default async function CategoryPage({
  params,
}: {
  params: { id: string };
}) {
  const entities = await db.entity.findMany({
    where: { categoryId: params.id },
    include: {
      category: true,
    },
  });

  if (entities.length === 0) {
    return <div>No entities</div>;
  }

  return (
    <Card className="w-[600px]">
      <CardHeader>
        <p className="text-2xl font-semibold text-center"> Entities</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {entities.map(async (entity) => {
          const averageRating = await getAverageRating(entity.id);
          return (
            <SmallEntity
              id={entity.id}
              key={entity.id}
              title={entity.title}
              body={entity.body}
              rating={averageRating}
            />
          );
        })}
        <div className="space-y-4">
          <Link href="/entity/create">
            {' '}
            <Button>Create Entity</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
