'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { CheckIcon } from '@radix-ui/react-icons';
import { useState } from 'react';

interface CategoryProps {
  categories: {
    id: string;
    createdAt: Date;
    updatedAt: Date | null;
    name: string;
    parentCategoryId: string | null;
    childrenCategories: any[];
  }[];
}

export default function DropdownComponent({ categories }: CategoryProps) {
  const [value, setValue] = useState('');
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu open={open}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          onClick={() => setOpen(!open)}
        >
          {value || 'Select an option'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        {categories.map((category) => {
          if (category.childrenCategories.length > 0) {
            return (
              <DropdownMenuSub key={category.id}>
                <DropdownMenuSubTrigger
                  onClick={() => {
                    setValue(category.name);
                    setOpen(false);
                  }}
                >
                  {category.name}
                  <CheckIcon
                    className={cn(
                      'ml-auto h-4 w-4',
                      category.name === value ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    {category.childrenCategories.map((subCategory) => {
                      return (
                        <DropdownMenuItem
                          key={subCategory.id}
                          onClick={() => {
                            setValue(`${category.name} / ${subCategory.name}`);
                            setOpen(false);
                          }}
                        >
                          {subCategory.name}
                        </DropdownMenuItem>
                      );
                    })}
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            );
          } else {
            return (
              <DropdownMenuItem
                key={category.id}
                onClick={() => {
                  setValue(category.name);
                  setOpen(false);
                }}
              >
                {category.name}
              </DropdownMenuItem>
            );
          }
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
