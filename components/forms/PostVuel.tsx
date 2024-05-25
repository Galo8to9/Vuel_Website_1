"use client"

import React, { ChangeEvent, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Form,  
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage, } from '../ui/form';
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from '../ui/input';
import * as z from "zod";
import { usePathname, useRouter } from 'next/navigation';

// import { updateUser } from '@/lib/actions/user.actions';
import { VuelPostValidation } from '@/lib/validations/vuelpost';
import { Textarea } from '../ui/textarea';
import { createPost } from '@/lib/actions/post.action';

interface Props {
    user: {
        id: string;
        objectId: string;
        username: string;
        name: string;
        bio: string;
        image: string;
    };
    btnTitle: string;
  }


function PostVuel({ userId }: {userId: string}) {
    const router = useRouter()
    const pathname = usePathname()
    
    const form = useForm({
        resolver: zodResolver(VuelPostValidation),
        defaultValues: {
            vuelPost: "",
            accountId: userId,
        },
    })

  const onSubmit = async (values: z.infer<typeof VuelPostValidation>) => {
    await createPost({
      text: values.vuelPost, 
      author: userId,
      communityId: null,
      path: pathname
    })
    router.push("/")
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='mt-10 flex flex-col justify-start gap-10'>
        <FormField
          control={form.control}
          name="vuelPost"
          render={({ field }) => (
            <FormItem className='flex flex-col gap-3 w-full'>
            <FormLabel className='text-base-semibold text-light-2'>Content</FormLabel>
              <FormControl className='no-focus border border-dark-4 bg-dark-3 text-light-1'>
                <Textarea
                  rows={15} 
                  {...field}
                />
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />
        <Button type='submit' className='bg-primary-500'>
          Post
        </Button>
      </form>
    </Form>
  )
}

export default PostVuel