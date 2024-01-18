import CreateCategory from '@/components/category/create-category';
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
      <CreateCategory categories={categories} />
    </>
  );
}
