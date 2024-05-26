import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { communityTabs } from "@/constants";

import PostVuel from "@/components/forms/PostVuel";
import { fetchUser } from "@/lib/actions/user.actions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { profileTabs } from "@/constants";
import Image from "next/image";
import VuelPostsTab from "@/components/shared/VuelPostsTab";
import { fetchCommunityDetails } from "@/lib/actions/community.actions";
import ProfileHeader from "@/components/shared/ProfileHeader";
import UserCard from "@/components/cards/UserCard";



async function page({params} :{ params: {id: string }}) {
    const user = await currentUser();
    if (!user) return null;

    const communityDetails = await fetchCommunityDetails(params.id);
    
    return (
        <section>
            <ProfileHeader
                accountId={communityDetails.id}
                authUserId={communityDetails.id}
                name={communityDetails.name}
                username={communityDetails.username}
                imgUrl={communityDetails.image}
                bio={communityDetails.bio}
                type="Community"
            />
        <div className="mt-9 ">

        </div>
            <Tabs defaultValue="vuelPosts" className="w-full">
                <TabsList className="tab">
                    {communityTabs.map((tab) => (
                        <TabsTrigger key={tab.label} value={tab.value} className="tab">
                            <Image
                                src={tab.icon}
                                alt={tab.label}
                                width={24}
                                height={24}
                                className="object-contain"
                            
                            />
                            <p className="max-sm:hidden">{tab.label}</p>

                            {tab.label === "Posts" && (
                                <p className="ml-1 rounded-sm bg-light-4 px-2 py-1 text-tiny-medium text-light-2">
                                    {communityDetails?.vuelPosts?.length} 
                                </p>
                            )}
                        </TabsTrigger>
                    ))}
                </TabsList> 
                    <TabsContent value="vuelPosts" className="w-full text-ligh-1">
                        <VuelPostsTab currentUserId={user.id} accountId={communityDetails._id} accountType="Community"/>
                    </TabsContent>

                    <TabsContent value="members" className="w-full text-ligh-1">
                        <section className="mt-9 flex flex-col gap-10">
                            {communityDetails?.members.map((member: any) => (
                                <UserCard
                                    key={member._id}
                                    id={member.id}
                                    name={member.name}
                                    username={member.username}
                                    imgUrl={member.image}
                                    personType="User"
                                />
                            ))}

                        </section>
                    </TabsContent>

                    <TabsContent value="requests" className="w-full text-ligh-1">
                        <VuelPostsTab currentUserId={user.id} accountId={communityDetails.id} accountType="Community"/>
                    </TabsContent>
            </Tabs>
        </section>


    )
}

export default page