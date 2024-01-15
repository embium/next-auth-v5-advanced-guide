import LargeEntity from '@/components/large-entity';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { db } from '@/lib/db';
import { getAverageRating } from '@/lib/rating';

export default async function EntityPage({
  params,
}: {
  params: { id: string };
}) {
  const entity = await db.entity.findUnique({
    where: { id: params.id },
  });

  if (!entity) {
    return <div>No entity exist</div>;
  }

  const averageRating = await getAverageRating(entity.id);

  return (
    <Card className="w-[600px]">
      <CardHeader>
        <p className="text-2xl font-semibold text-center"> Entities</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <LargeEntity
          key={entity.id}
          id={entity.id}
          title={entity.title}
          body={entity.body}
          rating={averageRating}
        />
      </CardContent>
    </Card>
  );
}
