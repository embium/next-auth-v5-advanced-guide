import CreateEntity from '@/components/entity/create-entity';
import { db } from '@/lib/db';

export default async function Category() {
  const categories = await db.category.findMany({
    where: { parentCategoryId: null },
    include: {
      childrenCategories: {
        include: {
          childrenCategories: true,
        },
      },
    },
  });

  return (
    <>
      <CreateEntity categories={categories} />
    </>
  );
}
