import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { db } from '@/lib/db';
import Link from 'next/link';

export default async function Categories() {
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

  const result = categories.flatMap(
    (parentCategory) => parentCategory.childrenCategories
  );

  console.log(result);

  return (
    <Card className="w-[600px]">
      <CardHeader>
        <p className="text-2xl font-semibold text-center"> Entities</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <ul>
          {categories.map((category) => (
            <li key={category.id}>
              <strong>
                <Link href={`/category/${category.id}`}>{category.name}</Link>
              </strong>
              {category.childrenCategories.length > 0 &&
                category.childrenCategories.map(async (subCategory) => (
                  <>
                    <li key={subCategory.id}>
                      <Link href={`/category/${subCategory.id}`}>
                        {subCategory.name}
                      </Link>
                    </li>
                    {subCategory.childrenCategories.length > 0 &&
                      subCategory.childrenCategories.map(
                        async (subSubCategory) => (
                          <li key={subSubCategory.id}>
                            <Link href={`/category/${subSubCategory.id}`}>
                              {subSubCategory.name}
                            </Link>
                          </li>
                        )
                      )}
                  </>
                ))}
            </li>
          ))}
        </ul>
        <div className="space-y-4">
          <Link href="/category/create">
            {' '}
            <Button>Create Category</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
