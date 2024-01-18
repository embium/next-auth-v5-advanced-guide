'use client';

import SmallEntity from '@/components/small-entity';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { getAverageRating } from '@/lib/rating';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Entity {
  id: string;
  title: string;
  body: string;
}

export default function CategoryPage({ params }: { params: { id: string } }) {
  const [entities, setEntities] = useState<Entity[]>([]);
  const [isLoading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch(`/api/entity?categoryId=${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        setEntities(data);
        setLoading(false);
      });
  }, [setEntities, params]);

  const handleDelete = () => {
    fetch(`/api/category`, {
      method: 'DELETE',
      body: JSON.stringify({
        categoryId: params.id,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        router.push('/category');
      });
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <Card className="w-[600px]">
      <CardHeader>
        <p className="text-2xl font-semibold text-center"> Entities</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {entities.map((entity) => {
          return (
            <SmallEntity
              id={entity.id}
              key={entity.id}
              title={entity.title}
              body={entity.body}
            />
          );
        })}
        <div className="space-y-4">
          <Link href="/entity/create">
            {' '}
            <Button>Create Entity</Button>
          </Link>
        </div>
        <div>
          <Button onClick={handleDelete}>Delete Category</Button>
        </div>
      </CardContent>
    </Card>
  );
}
