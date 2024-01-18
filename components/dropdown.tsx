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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import { UseFormReturn, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CategorySchema } from '@/schemas';
import { z } from 'zod';

export function LeafLinkList({ links }) {
  return links.map(({ id, name, value, setValue, setOpen }) => (
    <DropdownMenuItem
      key={id}
      onClick={() => {
        setValue(name);
        setOpen(false);
      }}
    >
      {name}
      <CheckIcon
        className={cn(
          'ml-auto h-4 w-4',
          name === value ? 'opacity-100' : 'opacity-0'
        )}
      />
    </DropdownMenuItem>
  ));
}

export function SubCategory({ title, links }) {
  return (
    <Fragment>
      <h3>{title}</h3>
      <LeafLinkList links={links} />
    </Fragment>
  );
}

export function SubCategoryList({ item }) {
  const { subCatergories } = item || {};

  return subCatergories.map(({ title, links }) => (
    <SubCategory
      key={title}
      title={title}
      links={links}
    />
  ));
}

interface Props {
  categories: {
    id: string;
    createdAt: Date;
    updatedAt: Date | null;
    name: string;
    parentCategoryId: string | null;
    childrenCategories: any[];
  }[];
}

export default function DropdownComponent({ categories }: Props) {
  const form = useForm<z.infer<typeof CategorySchema>>({
    resolver: zodResolver(CategorySchema),
    defaultValues: {
      parentCategory: undefined,
      parentCategoryId: undefined,
      category: undefined,
    },
  });

  const [value, setValue] = useState('');
  const [open, setOpen] = useState(false);

  return (
    <Form {...form}>
      <form
        className="space-y-6"
        onSubmit={form.handleSubmit()}
      >
        <FormField
          control={form.control}
          name="parentCategory"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Category</FormLabel>
              <DropdownMenu open={open}>
                <DropdownMenuTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      onClick={() => setOpen(!open)}
                    >
                      {value || 'Select an option'}
                    </Button>
                  </FormControl>
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
                                category.name === value
                                  ? 'opacity-100'
                                  : 'opacity-0'
                              )}
                            />
                          </DropdownMenuSubTrigger>
                          <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                              {category.childrenCategories.map(
                                (subCategory) => {
                                  return (
                                    <DropdownMenuItem
                                      key={subCategory.id}
                                      onClick={() => {
                                        setValue(
                                          `${category.name} / ${subCategory.name}`
                                        );
                                        setOpen(false);
                                      }}
                                    >
                                      {subCategory.name}
                                      <CheckIcon
                                        className={cn(
                                          'ml-auto h-4 w-4',
                                          `${category.name} / ${subCategory.name}` ===
                                            value
                                            ? 'opacity-100'
                                            : 'opacity-0'
                                        )}
                                      />
                                    </DropdownMenuItem>
                                  );
                                }
                              )}
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
                          <CheckIcon
                            className={cn(
                              'ml-auto h-4 w-4',
                              category.name === value
                                ? 'opacity-100'
                                : 'opacity-0'
                            )}
                          />
                        </DropdownMenuItem>
                      );
                    }
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
              <FormDescription>
                This is the parent category that will be used for the category,
                this is <strong>optional</strong>.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
