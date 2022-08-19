import {
  Avatar,
  Button,
  Divider,
  Empty,
  Input,
  Spin,
  Tabs,
  Upload,
} from "antd";
import ImgCrop from "antd-img-crop";
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";
import { HiMail, HiUser, HiUsers } from "react-icons/hi";
import Post from "./Post";
import { useAuth } from "../contexts/auth";
import { trpc } from "../utils/trpc";
import UserAvatar from "./UserAvatar";
import { AiFillCamera } from "react-icons/ai";
function Profile() {
  const router = useRouter();
  const { user: currentUser } = useAuth();
  const { data: user, isLoading } = trpc.useQuery([
    "users.user",
    { username: router.query.username as string },
  ]);
  const canEdit = user?.id === currentUser?.id;
  console.log(user);
  return (
    <div>
      <>
        {isLoading ? (
          <div className="flex w-full min-h-screen items-center justify-center  ">
            <Spin size="default" tip="Loading..." />
          </div>
        ) : (
          user &&
          currentUser && (
            <div className="container mx-auto">
              <div className="grid sm:gap-4 min-h-screen grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 m-0 sm:m-5 ">
                <div className="profile flex  mx-8 sm:mx-2 md:mx-0  bg-white rounded-t-2xl  overflow-hidden sm:shadow-xl dark:bg-gray-900/20 items-start justify-start flex-col ">
                  <div className="profile-head mb-16  h-32  w-full flex flex-cols   relative justify-center items-end ">
                    <Image
                      layout="fill"
                      src={user.Profile?.banner as string}
                      alt={`${user.name?.split(" ")[0]}'s header`}
                      className="h-full w-full object-cover absolute inset-0 "
                    />
                    <span className=" w-10 h-10 flex justify-center items-center absolute bottom-2 right-2 z-10 text-xl text-white rounded-full bg-gray-900/50">
                      <AiFillCamera />
                    </span>

                    <div className="relative translate-y-16 w-28 h-28 cursor-pointer ">
                      <UserAvatar
                        src={user.Profile?.avatar}
                        size={112}
                        alt={user.name}
                      />
                      <span className="  w-full h-full transition opacity-0 hover:opacity-100 flex justify-center items-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2  z-10 text-xl text-white rounded-full bg-gray-900/50">
                        <AiFillCamera />
                      </span>
                    </div>
                  </div>
                  <div className="text-center w-full">
                    <div className=" text-gray-800  dark:text-gray-300 font-bold text-xl">
                      {user.name}
                    </div>
                    <Divider style={{ marginTop: 0 }}>{user.username}</Divider>
                  </div>
                  <div className="px-4 w-full">{user.Profile?.bio}</div>
                </div>

                <div className="md:col-span-1 lg:col-span-2 xl:col-span-3 2xl:col-span-4  pt-4">
                  <Tabs defaultActiveKey="1">
                    <Tabs.TabPane
                      tab={`${user.name?.split(" ")[0]}'s Posts `}
                      key="1"
                    >
                      <div className="grid gap-4  grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 ">
                        {user.Posts.length ? (
                          user.Posts.map(({ id }) => <Post id={id} key={id} />)
                        ) : (
                          <div className="col-span-full  flex items-center justify-center">
                            <Empty
                              description={`${
                                currentUser?.id === user?.id
                                  ? "You"
                                  : user.name?.split(" ")[0]
                              } didn't post anything yet`}
                            />
                          </div>
                        )}
                      </div>
                    </Tabs.TabPane>
                    <Tabs.TabPane
                      tab={`${user.name?.split(" ")[0]}'s Saved Posts `}
                      key="2"
                    >
                      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                        {user.SavedPosts.length ? (
                          user.SavedPosts.map(({ postId }) => (
                            <Post id={postId} key={postId} />
                          ))
                        ) : (
                          <div className="col-span-full  flex items-center justify-center">
                            <Empty
                              description={`${
                                currentUser.id === user.id
                                  ? "You"
                                  : user.name?.split(" ")[0]
                              } didn't save any post yet`}
                            />
                          </div>
                        )}
                      </div>
                    </Tabs.TabPane>
                  </Tabs>
                </div>
              </div>
            </div>
          )
        )}
      </>
    </div>
  );
}

export default Profile;
