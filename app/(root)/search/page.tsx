import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import PostVuel from "@/components/forms/PostVuel";
import { fetchUser, fetchUsers } from "@/lib/actions/user.actions";
import ProfileHeader from "@/components/shared/ProfileHeader";
import { profileTabs } from "@/constants";
import Image from "next/image";
import VuelPostsTab from "@/components/shared/VuelPostsTab";
import UserCard from "@/components/cards/UserCard";



async function page() {
    const user = await currentUser();
    if (!user) return null;

    // fetch organization list created by user
    const userInfo = await fetchUser(user.id);
    if (!userInfo?.onboarded) redirect("/onboarding");

    //fetch users

    const result = await fetchUsers({
        userId: user.id,
        searchString: "",
        pageNumber: 1,
        pageSize: 25
    })

  return (
    <section>
        <h1 className='head-text'> Search</h1>

        <div className="mt-14 flex flex-col gap-9">
            { result.users.length === 0 ? (
                <p className="no-result"> No users</p>
            ) : (
                <>
                    {result.users.map((person) => (
                        <UserCard
                            key={person.id}
                            id={person.id}
                            name={person.name}
                            username={person.username}
                            imgUrl={person.image}
                            personType="User"
                        />
                    ))}
                </>
            )}

        </div>
    </section>
  )
}

export default page