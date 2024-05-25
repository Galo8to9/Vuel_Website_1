"use server"

import { revalidatePath } from "next/cache"
import VuelPost from "../models/post.model"
import User from "../models/user.model"
import { connectToDB } from "../mongoose"


interface Params {
    text: string,
    author: string,
    communityId: string | null,
    path: string
}

export async function createPost({text, author, communityId, path}: Params) {

    try {
        connectToDB()

        const createPost = await VuelPost.create({
            text,
            author,
            community: null,
        })

        await User.findByIdAndUpdate( author, {
            $push: { vuelPosts: createPost._id }
        })

        revalidatePath(path)
        
    } catch (error: any) {
        throw new Error(`Error creating post: ${error.message}`)
    }
    
}


export async function fetchPosts (pageNumber = 1, pageSize =20) {
    connectToDB()

    //Calculate number of posts to skip
    const skipAmount = (pageNumber - 1) * pageSize

    //Fetch posts that have no parents 
    const postsQuery = VuelPost.find({parentId: { $in: [null, undefined] }})
    .sort({ createdAt:"desc" })
    .skip(skipAmount)
    .limit(pageSize)
    .populate({ path: "author", model: User })
    .populate({
        path: "children",
        populate:{
            path: "author",
            model: User,
            select: "_id parentID image"
        } 
    })

    const totalPostsCount = await VuelPost.countDocuments( {parentId: { $in: [null, undefined]}} )

    const posts = await postsQuery.exec()

    const isNext = totalPostsCount > skipAmount + posts.length;

    return { posts, isNext }
}

export async function fetchVuelPostById (id: string ) {

    connectToDB()

    try {
        const vuelPost = await VuelPost.findById(id)
        .populate({
            path: "author",
            model: User,
            select: "_id id name image"
        })
        .populate({
            path: "children",
            populate: [
                {
                    path: "author",
                    model: User,
                    select: "_id id name parentId image"
                },
                {
                    path: "children",
                    model: VuelPost,
                    populate: {
                        path: "author", // Populate the author field within nested children
                        model: User,
                        select: "_id id name parentId image", // Select only _id and username fields of the author
                      },
                }
            ]
        }).exec()

        return vuelPost
    } catch (error: any) {
        throw new Error(`Erro fetching VuelPost: ${error.message}`)
    }
}

export async function addCommentToVuelPost(vuelPostId: string, commentText: string, userId: string, path: string) {

    connectToDB

    try {
        //Find original VuelPost by its ID
        const originalVuelPost = await VuelPost.findById(vuelPostId)
        if(!originalVuelPost) {
            throw new Error(`VuelPost not found`)
        }

        // Create a new VuelPost with the comment text

        const commentVuelPost = new VuelPost({
            text: commentText,
            author: userId,
            parentId: vuelPostId,
        })

        //save new comment
        const savedCommentVuelPost = await commentVuelPost.save()

        //update original post
        originalVuelPost.children.push(savedCommentVuelPost._id)

        //save original post
        await originalVuelPost.save()

        revalidatePath(path)

    } catch (error: any) {
        throw new Error(`Erro adding comment to VuelPost: ${error.message}`)
    }
}
