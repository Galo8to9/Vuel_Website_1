"use server"

import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import { connectToDB } from "../mongoose"
import VuelPost from "../models/post.model";
import { FilterQuery, SortOrder } from "mongoose";

interface Params {
	userId: string;
	username: string;
	name: string;
	bio: string;
	image: string;
	path: string;
}

export async function updateUser({
    userId,
    bio,
    name,
    path,
    username,
    image,
}: Params): Promise<void> {
    connectToDB()

    try {	
        await User.findOneAndUpdate(
            { id: userId },
            {
              username: username.toLowerCase(),
              name,
              bio,
              image,
              onboarded: true,
            },
            { upsert: true }
          );
          
          if (path === "/profile/edit") {
            revalidatePath(path);
          }
        
    } catch (error: any) {
        throw new Error(`Failed to create/update user: ${error.message}`)
    }
}

export async function fetchUser(userId: string) {
  try {
    connectToDB()

    return await User.findOne({id: userId})
    //.populate({
      // path: "communities", model: Community})
    
  } catch (error: any) {
    throw new Error(`Failed to fetch user: ${error.message}`)
    
  }
}

export async function fetchUserPosts(userId: string) {

  try {
    connectToDB()

    const VuelPosts = await User.findOne({ id: userId })
    .populate({
      path: "vuelPosts",
      model: VuelPost,
      populate: {
        path: "children",
        model: VuelPost,
        populate: {
          path: "author",
          model: User,
          select: "name image id"
        }
      }
    })

    return VuelPosts
    
  } catch (error: any) {
    throw new Error(`Failed to fetch posts: ${error.message}`)

  }

}

export async function fetchUsers({
  userId,
  searchString = "",
  pageNumber = 1,
  pageSize = 20,
  sortBy = "desc"
} : {
  userId: string,
  searchString?: string,
  pageNumber?: number,
  pageSize?: number,
  sortBy?: SortOrder,
}) {

  try {
    connectToDB()

    const skipAmount = (pageNumber -1 ) * pageSize

    const regex = new RegExp(searchString, "i")

    const query : FilterQuery<typeof User> = {
      id: { $ne: userId}
    }

    if(searchString.trim() !== "") {
      query.$or = [
        { username: { $regex: regex} },
        { name: {$regex: regex}}
      ]
    }

    const sortOptions = { createdAt: sortBy }

    const usersQuery = User.find(query)
    .sort(sortOptions)
    .skip(skipAmount)
    .limit(pageSize)

    const totalUsersCount = await User.countDocuments(query)

    const users = await usersQuery.exec()
    const isNext = totalUsersCount > skipAmount + users.length

    return { users, isNext }
  } catch (error: any) {
    throw new Error(`Failed to fetch posts: ${error.message}`)
  }
}

export async function getActivity(userId: string) {

  try {

    // find all posts created by user
    const userVuelPosts = await VuelPost.find({ author: userId})

    //Collect all the child posts id´s
    const childVuelPostIds = userVuelPosts.reduce((acc, userVuelPost) => {
      return acc.concat(userVuelPost.children)
    }, []) 

    const replies = await VuelPost.find({
      _id: { $in: childVuelPostIds },
      author: { $ne: userId}
    }).populate({
      path: "author",
      model: User,
      select: "name image _id"
    })

    return replies
    
  } catch (error: any ) {
    throw new Error(`Failed to fetch activity: ${error.message}`)
    
  }
}