'use client';

import { useForm } from 'react-hook-form';
import { useState, useTransition } from 'react';
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
import { EntitySchema } from '@/schemas';
import { entity } from '@/actions/entity';

import { CheckIcon } from '@radix-ui/react-icons';
import { cn } from '@/lib/utils';
import { Textarea } from '../ui/textarea';
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

export default function CreateEntity({ categories }: CategoryProps) {
  const router = useRouter();

  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof EntitySchema>>({
    resolver: zodResolver(EntitySchema),
    defaultValues: {
      category: undefined,
      categoryId: undefined,
      title: undefined,
      body: undefined,
    },
  });

  const onSubmit = (values: z.infer<typeof EntitySchema>) => {
    startTransition(() => {
      entity(values)
        .then((data) => {
          if (data.error) {
            setError(data.error);
          }

          if (data.success) {
            router.push(`/entity/${data.entity}`);
          }
        })
        .catch(() => setError('Something went wrong!'));
    });
  };

  return (
    <Card className="w-[600px]">
      <CardHeader>
        <p className="text-2xl font-semibold text-center">Create Entity</p>
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
                name="category"
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
                                    form.setValue('category', category.name);
                                    form.setValue('categoryId', category.id);
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
                                                    'category',
                                                    subCategory.name
                                                  );
                                                  form.setValue(
                                                    'categoryId',
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
                                                              'category',
                                                              `${category.name} / ${subCategory.name} / ${subSubCategory.name}`
                                                            );
                                                            form.setValue(
                                                              'categoryId',
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
                                                  'category',
                                                  `${category.name} / ${subCategory.name}`
                                                );
                                                form.setValue(
                                                  'categoryId',
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
                                  form.setValue('categoryId', category.id);
                                  form.setValue('category', category.name);
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
                      This is the category the entity will be stored in.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Entities title"
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="body"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Body</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descrbe the entity"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  {/*<FormDescription>
                    You can <span>@mention</span> other users and organizations.
                  </FormDescription>*/}
                  <FormMessage />
                </FormItem>
              )}
            />
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
