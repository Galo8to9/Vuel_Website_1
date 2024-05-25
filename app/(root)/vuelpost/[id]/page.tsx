import VuelPostCard from '@/components/cards/VuelPostCard'
import React from 'react'
import { currentUser } from "@clerk/nextjs/server"
import { fetchUser } from '@/lib/actions/user.actions'
import { redirect } from 'next/navigation'
import { fetchVuelPostById } from '@/lib/actions/post.action'
import Comment from '@/components/forms/Comment'
import VuelPost from '@/lib/models/post.model'


const page = async ( { params }: { params: {id:string }} ) => {

    if(!params.id) return null

    const user = await currentUser()
    if(!user) return null

    const userInfo = await fetchUser(user.id)
    if(!userInfo?.onboarded) redirect("/onboarding")

    const post = await fetchVuelPostById(params.id)


    return (
        <section className='relative'>
            <div>
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
            </div>

            <div className='mt-7 '>
                <Comment
                    vuelPostId={post.id}
                    currentUserImg={userInfo.image}
                    currentUserId={JSON.stringify(userInfo._id)}
                />
            </div>

            <div className='mt-10'>
                {post.children.map(( childItem: any ) => (
                    <VuelPostCard
                        key={childItem._id}
                        id={childItem._id}
                        currentUserId={childItem?.id || ""}
                        parentId={childItem.parentId}
                        content={childItem.text}
                        author={childItem.author}
                        community={childItem.community}
                        createdAt={childItem.createdAt}
                        comments={childItem.children}
                        isComment
                    />
                ))}
            </div>
        </section>
    )
}

export default page