import { fetchUserPosts } from '@/lib/actions/user.actions';
import { redirect } from 'next/navigation';
import React from 'react'
import VuelPostCard from '../cards/VuelPostCard';

interface Props {
    currentUserId: string;
    accountId: string;
    accountType: string;
  }

const VuelPostsTab = async ({ currentUserId, accountId, accountType }: Props) => {

    let result = await fetchUserPosts(accountId);

    if(!result) redirect("/")

  return (
    <div className='mt-9 flex flex-col gap-10'>
        {result.vuelPosts.map((vuelpost: any) => (
            <VuelPostCard
                key={vuelpost._id}
                id={vuelpost._id}
                currentUserId={currentUserId}
                parentId={vuelpost.parentId}
                content={vuelpost.text}
                author={accountType === "User" ? {
                    name: result.name, image: result.image, id: result.id 
                } : 
                    {name: vuelpost.author.name, image: vuelpost.author.image}
                }
                community={vuelpost.community}
                createdAt={vuelpost.createdAt}
                comments={vuelpost.children}
                isComment
            />

        ))}
    </div>
  )
}

export default VuelPostsTab