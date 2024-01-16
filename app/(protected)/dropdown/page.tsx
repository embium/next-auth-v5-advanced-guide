import DropdownComponent from '@/components/dropdown';
import { db } from '@/lib/db';

export default async function Dropdown() {
  const categories = await db.category.findMany({
    where: { parentCategoryId: null },
    include: { childrenCategories: true },
  });

  return <DropdownComponent categories={categories}></DropdownComponent>;
}
