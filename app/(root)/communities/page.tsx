import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import PostVuel from "@/components/forms/PostVuel";
import { fetchUser, fetchUsers } from "@/lib/actions/user.actions";
import ProfileHeader from "@/components/shared/ProfileHeader";
import { profileTabs } from "@/constants";
import Image from "next/image";
import VuelPostsTab from "@/components/shared/VuelPostsTab";
import UserCard from "@/components/cards/UserCard";
import { fetchCommunities } from "@/lib/actions/community.actions";
import CommunityCard from "@/components/cards/CommunityCards";



async function page() {
    const user = await currentUser();
    if (!user) return null;

    // fetch organization list created by user
    const userInfo = await fetchUser(user.id);
    if (!userInfo?.onboarded) redirect("/onboarding");

    //fetch communities

    const result = await fetchCommunities({
        searchString: "",
        pageNumber: 1,
        pageSize: 25
    })

  return (
    <section>
        <h1 className='head-text'> Search</h1>

        <div className="mt-14 flex gap-9">
            { result.communities.length === 0 ? (
                <p className="no-result"> No communities</p>
            ) : (
                <>
                    {result.communities.map((communities) => (
                        <CommunityCard
                            key={communities.id}
                            id={communities.id}
                            name={communities.name}
                            username={communities.username}
                            imgUrl={communities.image}
                            bio={communities.bio}
                            members={communities.members}
                        />
                    ))}
                </>
            )}

        </div>
    </section>
  )
}

export default page