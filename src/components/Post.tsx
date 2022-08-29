import React from "react";
import { trpc } from "../utils/trpc";
import Link from "next/link";
import Image from "next/image";
import UserAvatar from "./UserAvatar";
import {
  BsBookmarkFill,
  BsBookmark,
  BsHeart,
  BsHeartFill,
} from "react-icons/bs";
import AuthModel from "./modals/AuthModel";
import { useAuth } from "../contexts/auth";
import moment from "moment";
import { Avatar, message } from "antd";
import PostItemModel from "./modals/PostItemModel";
import ContentLoader from "react-content-loader";
import { motion } from "framer-motion";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

function Post({ id }: { id: string }) {
  const { user } = useAuth();
  const utils = trpc.useContext();

  const { data: post, isLoading } = trpc.useQuery(["posts.post", { id }]);
  const likePostMutation = trpc.useMutation("posts.likePost", {
    onSuccess: () => {
      utils.invalidateQueries(["posts.likedPosts"]);
      utils.invalidateQueries(["posts.post", { id }]);
    },
  });
  const savePostMutation = trpc.useMutation("posts.savePost", {
    onSuccess: (a) => {
      a;
      utils.invalidateQueries(["posts.savedPosts"]);
      utils.invalidateQueries([
        "users.user",
        { username: user?.username as string },
      ]);
    },
  });

  const likedPostsQuery = trpc.useQuery(["posts.likedPosts"]);
  const savedPostQuery = trpc.useQuery(["posts.savedPosts"]);
  const isLiked = likedPostsQuery.data?.some((p) => p.postId === id);
  const isSaved = savedPostQuery.data?.some((p) => p.postId === id);
  const [isAuthModelOpen, setIsAuthModelOpen] = React.useState(false);
  const [isPostModelOpen, setIsPostModelOpen] = React.useState(false);

  if (isLoading) {
    return (
      <ContentLoader
        className="mx-auto mt-4"
        viewBox="0 0 300 270"
        height={270}
        width={300}
      >
        <rect x="0" y="0" rx="4" ry="4" width="300" height="200" />
        <rect x="60" y="220" rx="1" ry="1" width="240" height="10" />
        <rect x="60" y="240" rx="1" ry="1" width="180" height="10" />
        <rect x="0" y="210" rx="4" ry="4" width="50" height="50" />
      </ContentLoader>
    );
  }

  if (!post) {
    return null;
  }

  const handlePostLike = async () => {
    if (!user) {
      setIsAuthModelOpen(true);
      return;
    }
    try {
      await likePostMutation.mutateAsync({
        id: post.id,
      });
    } catch (error: any) {
      message.error(error.message);
    }
  };

  const handlePostSave = async () => {
    if (!user) {
      setIsAuthModelOpen(true);
      return;
    }
    try {
      await savePostMutation.mutateAsync({
        id: post.id,
      });
    } catch (error: any) {
      message.error(error.message);
    }
  };
  return (
    <>
      <AuthModel
        isOpen={isAuthModelOpen}
        onClose={() => setIsAuthModelOpen(false)}
      />
      <PostItemModel
        post={post}
        isOpen={isPostModelOpen}
        onClose={() => setIsPostModelOpen(false)}
      />

      <motion.div
        layout
        className={`group relative mx-auto flex w-full max-w-sm flex-col gap-4 rounded-xl border bg-white   p-2 font-default text-gray-800 shadow-2xl   shadow-gray-200 `}
      >
        <div className="relative overflow-hidden rounded-xl bg-white">
          <div className="relative h-full  min-h-[219px] ">
            <>
              <Image
                quality={100}
                src={post.image}
                className=" z-0 h-full  w-full  bg-white object-cover object-center transition duration-500 group-hover:scale-125 "
                alt={post.title}
                priority={true}
                layout="fill"
              />
            </>
          </div>

          <div className="absolute  inset-x-0 bottom-0 z-10 flex bg-gradient-to-t  from-white  via-white/80   p-4    text-gray-800">
            <div
              className="relative max-w-full"
              onClick={() => {
                setIsPostModelOpen(true);
              }}
            >
              <div className="w-full  cursor-pointer ">
                <h1
                  title={post.title}
                  className="max-w-[75%]  truncate  text-xl  font-bold capitalize  "
                >
                  {post.title}
                </h1>
              </div>
              <div className="mr-4 flex w-full max-w-[75%] truncate text-sm font-light ">
                By <div className="truncate px-1 ">{post.author.name}</div> -{" "}
                {moment(post.createdAt).fromNow()}{" "}
              </div>
            </div>
            <div className=" absolute bottom-4 right-2 ">
              <div className="flex flex-grow gap-2 ">
                <button
                  className="rounded-md border bg-white p-2  text-base text-gray-400 disabled:cursor-not-allowed  "
                  disabled={likePostMutation.isLoading}
                  onClick={() => handlePostLike()}
                >
                  {likePostMutation.isLoading ? (
                    <AiOutlineLoading3Quarters className="animate-spin" />
                  ) : isLiked ? (
                    <BsHeartFill />
                  ) : (
                    <BsHeart />
                  )}
                </button>
                <button
                  className="rounded-md border bg-white p-2  text-base text-gray-400 disabled:cursor-not-allowed  "
                  disabled={savePostMutation.isLoading}
                  onClick={() => handlePostSave()}
                >
                  {savePostMutation.isLoading ? (
                    <AiOutlineLoading3Quarters className="animate-spin" />
                  ) : isSaved ? (
                    <BsBookmarkFill />
                  ) : (
                    <BsBookmark />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className=" relative flex items-center justify-start gap-4 text-start">
          <Link href={`/${post.author.username}`}>
            <div className=" flex w-full  cursor-pointer items-center gap-3">
              <UserAvatar
                src={post.author.Profile?.avatar}
                size={40}
                radius={10}
              />
              <div className="relative  max-w-[70%]">
                <div className="truncate">
                  <span className="truncate  ">{post.author.name}</span>
                  <br />
                  <div className="truncate text-sm   text-gray-700">
                    @{post.author.username}
                  </div>
                </div>
              </div>
            </div>
          </Link>
          {post.LikedPosts.length ? (
            <div className="ml-auto mr-1 text-indigo-400 font-semibold  inline-flex flex-shrink-0 items-center gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-4 w-4"
              >
                <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
              </svg>
              <span >
                {post.LikedPosts.length}
              </span>
            </div>
          ) : null}
        </div>
        {post.isPrivate && (
          <div
            title="This post is visible only to you"
            className="absolute top-4 right-2  rounded-full border-[1px]  border-gray-500 bg-gray-50 p-1 px-3  text-sm text-gray-500 "
          >
            Private
          </div>
        )}
      </motion.div>
    </>
  );
}

export default Post;
