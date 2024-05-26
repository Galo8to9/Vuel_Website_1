import { redirect } from "next/navigation";

import { fetchCommunityPosts } from "@/lib/actions/community.actions";
import { fetchUserPosts } from "@/lib/actions/user.actions";

import VuelPostCard from "../cards/VuelPostCard";

interface Result {
  name: string;
  image: string;
  id: string;
  threads: {
    _id: string;
    text: string;
    parentId: string | null;
    author: {
      name: string;
      image: string;
      id: string;
    };
    community: {
      id: string;
      name: string;
      image: string;
    } | null;
    createdAt: string;
    children: {
      author: {
        image: string;
      };
    }[];
  }[];
}

interface Props {
  currentUserId: string;
  accountId: string;
  accountType: string;
}

async function VuelPostsTab({ currentUserId, accountId, accountType }: Props) {
  let result: any;

  if (accountType === "Community") {
    result = await fetchCommunityPosts(accountId);
  } else {
    result = await fetchUserPosts(accountId);
  }

  if (!result) {
    redirect("/");
  }

  return (
    <section className='mt-9 flex flex-col gap-10'>
      {result.vuelPosts.map((vuelPost: any) => (
        <VuelPostCard
          key={vuelPost._id}
          id={vuelPost._id}
          currentUserId={currentUserId}
          parentId={vuelPost.parentId}
          content={vuelPost.text}
          author={
            accountType === "User"
              ? { name: result.name, image: result.image, id: result.id }
              : {
                  name: vuelPost.author.name,
                  image: vuelPost.author.image,
                  id: vuelPost.author.id,
                }
          }
          community={
            accountType === "Community"
              ? { name: result.name, id: result.id, image: result.image }
              : vuelPost.community
          }
          createdAt={vuelPost.createdAt}
          comments={vuelPost.children}
        />
      ))}
    </section>
  );
}

export default VuelPostsTab;