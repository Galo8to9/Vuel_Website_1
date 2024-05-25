import { fetchPosts } from '@/lib/actions/post.action'
import { currentUser } from "@clerk/nextjs/server";
import { UserButton } from '@clerk/nextjs'
import React from 'react'
import VuelPostCard from '@/components/cards/VuelPostCard';

const page = async () => {

  const result = await fetchPosts(1,30)
  const user = await currentUser();
  if (!user) return null;

  return (
    <div>
		  <h1 className='head-text text-left'>Home</h1>

      <section className='mt-9 flex flex-col gap-10'>
        {result.posts.length === 0 ? (
          <p className='no-result'>No posts found</p>
        ) : (
          <>
            {result.posts.map((post) => (
              <VuelPostCard
                key={post._id}
                id={post._id}
                currentUserId={user?.id || ""}
                parentId={post.parentId}
                content={post.text}
                author={post.author}
                community={post.community}
                createdAt={post.createdAt}
                comments={post.children}
              />
            ))}
          </>
        )}
      </section>
    
    </div>
  )
}

export default page