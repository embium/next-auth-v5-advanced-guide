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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  CaretSortIcon,
  CheckIcon,
  ResetIcon,
  ArrowRightIcon,
} from '@radix-ui/react-icons';
import { cn } from '@/lib/utils';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import { Textarea } from '../ui/textarea';

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

  const [_categories, setCategories] = useState(categories);
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof EntitySchema>>({
    resolver: zodResolver(EntitySchema),
    defaultValues: {
      category: undefined,
      title: undefined,
      body: undefined,
      categoryId: undefined,
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
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              'w-[200px] justify-between',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? field.value : 'Select category'}
                            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-0">
                        <Command>
                          <CommandInput
                            placeholder="Search categories..."
                            className="h-9"
                          />
                          <CommandEmpty>No categories found.</CommandEmpty>
                          <CommandGroup>
                            {_categories.filter(
                              (category) =>
                                category.childrenCategories === undefined
                            ).length > 0 ? (
                              <CommandItem
                                onSelect={() => {
                                  setCategories(categories);
                                }}
                              >
                                Go back
                                <ResetIcon className={cn('ml-auto h-4 w-4')} />
                              </CommandItem>
                            ) : (
                              ''
                            )}
                            {_categories.map((category) => (
                              <CommandItem
                                value={category.name}
                                key={category.id}
                                onSelect={() => {
                                  if (
                                    category.childrenCategories &&
                                    category.childrenCategories.length > 0
                                  ) {
                                    setCategories(category.childrenCategories);
                                  } else {
                                    form.setValue('category', category.name);
                                    form.setValue('categoryId', category.id);
                                  }
                                }}
                              >
                                {category.name}
                                {category.childrenCategories &&
                                category.childrenCategories.length > 0 ? (
                                  <ArrowRightIcon
                                    className={cn('ml-auto h-4 w-4')}
                                  />
                                ) : (
                                  <CheckIcon
                                    className={cn(
                                      'ml-auto h-4 w-4',
                                      category.name === field.value
                                        ? 'opacity-100'
                                        : 'opacity-0'
                                    )}
                                  />
                                )}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      This is the category that will be used for this entity.
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
