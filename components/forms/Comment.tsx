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
import { CommentValidation } from '@/lib/validations/vuelpost';
import Image from 'next/image';
import { addCommentToVuelPost } from '@/lib/actions/post.action';

// import { updateUser } from '@/lib/actions/user.actions';
// import { CommentValidation } from '@/lib/validations/vuelpost';
// import { createPost } from '@/lib/actions/post.action';

interface Props {
    vuelPostId: string;
    currentUserImg: string;
    currentUserId: string;
  }

const Comment = ({vuelPostId, currentUserImg, currentUserId}: Props) => {
    const router = useRouter()
    const pathname = usePathname()
    
    const form = useForm({
        resolver: zodResolver(CommentValidation),
        defaultValues: {
            vuelPost: "",
        },
    })

  const onSubmit = async (values: z.infer<typeof CommentValidation>) => {
    await addCommentToVuelPost(vuelPostId, values.vuelPost, JSON.parse(currentUserId), pathname)

    form.reset()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='comment-form'>
        <FormField
          control={form.control}
          name="vuelPost"
          render={({ field }) => (
            <FormItem className='flex gap-3 items-center w-full'>
            <FormLabel>
                <Image 
                    src={currentUserImg}
                    alt="ProfileImage"
                    width={48}
                    height={48}
                    className="rounded-full object-cover"
                />
            </FormLabel>
              <FormControl className='border-none bg-transparent'>
                <Input
                    type="text"
                    placeholder="Comment..."
                    className='no-focus text-light-1 outline-none'
                    {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type='submit' className='comment-form_btn'>
          Reply
        </Button>
      </form>
    </Form>
  )
}

export default Comment