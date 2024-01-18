'use client';

import { useForm } from 'react-hook-form';
import { useEffect, useRef, useState, useTransition } from 'react';
import { useSession } from 'next-auth/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { z } from 'zod';

import { Card, CardHeader, CardContent } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormError } from '@/components/form-error';
import { FormSuccess } from '@/components/form-success';
import { CategorySchema } from '@/schemas';
import { category } from '@/actions/category';
import { CheckIcon } from '@radix-ui/react-icons';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

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

export default function CreateCategory({ categories }: CategoryProps) {
  const router = useRouter();

  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof CategorySchema>>({
    resolver: zodResolver(CategorySchema),
    defaultValues: {
      parentCategory: undefined,
      parentCategoryId: undefined,
      category: undefined,
    },
  });

  const onSubmit = (values: z.infer<typeof CategorySchema>) => {
    startTransition(() => {
      category(values)
        .then((data) => {
          if (data.error) {
            setError(data.error);
          }

          if (data.success) {
            router.push('/category');
          }
        })
        .catch(() => setError('Something went wrong!'));
    });
  };

  return (
    <Card className="w-[600px]">
      <CardHeader>
        <p className="text-2xl font-semibold text-center">Create Category</p>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            className="space-y-6"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="parentCategory"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Category</FormLabel>
                    <DropdownMenu
                      onOpenChange={setOpen}
                      open={open}
                    >
                      <DropdownMenuTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            onClick={() => setOpen(!open)}
                          >
                            {field.value || 'Select an option'}
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
                                    form.setValue(
                                      'parentCategory',
                                      category.name
                                    );
                                    form.setValue(
                                      'parentCategoryId',
                                      category.id
                                    );
                                    setOpen(false);
                                  }}
                                >
                                  {category.name}
                                  <CheckIcon
                                    className={cn(
                                      'ml-auto h-4 w-4',
                                      category.name === field.value
                                        ? 'opacity-100'
                                        : 'opacity-0'
                                    )}
                                  />
                                </DropdownMenuSubTrigger>
                                <DropdownMenuPortal>
                                  <DropdownMenuSubContent>
                                    {category.childrenCategories.map(
                                      (subCategory) => {
                                        if (
                                          subCategory.childrenCategories
                                            .length > 0
                                        ) {
                                          return (
                                            <DropdownMenuSub
                                              key={subCategory.id}
                                            >
                                              <DropdownMenuSubTrigger
                                                onClick={() => {
                                                  form.setValue(
                                                    'parentCategory',
                                                    subCategory.name
                                                  );
                                                  form.setValue(
                                                    'parentCategoryId',
                                                    subCategory.id
                                                  );
                                                  setOpen(false);
                                                }}
                                              >
                                                {subCategory.name}
                                                <CheckIcon
                                                  className={cn(
                                                    'ml-auto h-4 w-4',
                                                    subCategory.name ===
                                                      field.value
                                                      ? 'opacity-100'
                                                      : 'opacity-0'
                                                  )}
                                                />
                                              </DropdownMenuSubTrigger>
                                              <DropdownMenuPortal>
                                                <DropdownMenuSubContent>
                                                  {subCategory.childrenCategories.map(
                                                    (subSubCategory: any) => {
                                                      return (
                                                        <DropdownMenuItem
                                                          key={
                                                            subSubCategory.id
                                                          }
                                                          onClick={() => {
                                                            form.setValue(
                                                              'parentCategory',
                                                              `${category.name} / ${subCategory.name} / ${subSubCategory.name}`
                                                            );
                                                            form.setValue(
                                                              'parentCategoryId',
                                                              subSubCategory.id
                                                            );
                                                            setOpen(false);
                                                          }}
                                                        >
                                                          {subSubCategory.name}
                                                          <CheckIcon
                                                            className={cn(
                                                              'ml-auto h-4 w-4',
                                                              `${category.name} / ${subCategory.name} / ${subSubCategory.name}` ===
                                                                field.value
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
                                              key={subCategory.id}
                                              onClick={() => {
                                                form.setValue(
                                                  'parentCategory',
                                                  `${category.name} / ${subCategory.name}`
                                                );
                                                form.setValue(
                                                  'parentCategoryId',
                                                  subCategory.id
                                                );
                                                setOpen(false);
                                              }}
                                            >
                                              {subCategory.name}
                                              <CheckIcon
                                                className={cn(
                                                  'ml-auto h-4 w-4',
                                                  `${category.name} / ${subCategory.name}` ===
                                                    field.value
                                                    ? 'opacity-100'
                                                    : 'opacity-0'
                                                )}
                                              />
                                            </DropdownMenuItem>
                                          );
                                        }
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
                                  form.setValue(
                                    'parentCategoryId',
                                    category.id
                                  );
                                  form.setValue(
                                    'parentCategory',
                                    category.name
                                  );
                                  setOpen(false);
                                }}
                              >
                                {category.name}
                                <CheckIcon
                                  className={cn(
                                    'ml-auto h-4 w-4',
                                    category.name === field.value
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
                      This is the parent category that will be used for the
                      category, this is <strong>optional</strong>.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Category"
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormError message={error} />
            <FormSuccess message={success} />
            <Button
              disabled={isPending}
              type="submit"
            >
              Create
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
