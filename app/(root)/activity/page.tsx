import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import PostVuel from "@/components/forms/PostVuel";
import { fetchUser, fetchUsers, getActivity } from "@/lib/actions/user.actions";
import ProfileHeader from "@/components/shared/ProfileHeader";
import { profileTabs } from "@/constants";
import Image from "next/image";
import VuelPostsTab from "@/components/shared/VuelPostsTab";
import UserCard from "@/components/cards/UserCard";
import Link from "next/link";



async function page() {
    const user = await currentUser();
    if (!user) return null;

    // fetch organization list created by user
    const userInfo = await fetchUser(user.id);
    if (!userInfo?.onboarded) redirect("/onboarding");

    const activity = await getActivity(userInfo._id)

  return (
    <section>
      <h1 className='head-text'> Activity</h1>

      <section className="mt-10 flex flex-col gap-5">
        {activity.length > 0 ? (
          <>
            {activity.map((activity) => (
              <Link key={activity._id} href={`/vuelpost/${activity.parentId}`}>
                <article className="activity-card">
                  <Image 
                  src={activity.author.image}
                  alt="ProfilePicture"
                  width={20}
                  height={20}
                  className="rounded-full object-cover"
                  />
                  <p className="text-small-regular text-light-1">
                    <span className="mr-1 text-primary-500">
                      {activity.author.name}
                    </span>
                    replied to your post
                  </p>
                </article>
              </Link>
            ))}
          </>
        ): 
          <p className="text-base-regular text-light-3"> No activity yet!</p>

        }

      </section>
    </section>
  )
}

export default page