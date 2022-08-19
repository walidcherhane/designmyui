import React, { useRef } from "react";
import { inferQueryOutput, trpc } from "../utils/trpc";
import Link from "next/link";
import Image from "next/image";
import UserAvatar from "./UserAvatar";
import {
  BsBookmarkFill,
  BsBookmark,
  BsHeart,
  BsHeartFill,
  BsEye,
  BsChatDots,
} from "react-icons/bs";
import AuthModel from "./modals/AuthModel";
import { useAuth } from "../contexts/auth";
import moment from "moment";
import { Avatar, message } from "antd";
import PostItemModel from "./modals/PostItemModel";
import ContentLoader from "react-content-loader";
import { motion } from "framer-motion";

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
  const modelRef = useRef<HTMLDivElement>(null);

  const likedPostsQuery = trpc.useQuery(["posts.likedPosts"]);
  const savedPostQuery = trpc.useQuery(["posts.savedPosts"]);
  const isLiked = likedPostsQuery.data?.some((p) => p.postId === id);
  const isSaved = savedPostQuery.data?.some((p) => p.postId === id);
  const [isAuthModelOpen, setIsAuthModelOpen] = React.useState(false);
  const [isPostModelOpen, setIsPostModelOpen] = React.useState(false);

  if (isLoading) {
    return (
      <ContentLoader
        className="mx-auto"
        viewBox="0 0 400 475"
        height={475}
        width={400}
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
        className={`group w-full font-default flex flex-col gap-4 p-2 bg-white border shadow-2xl shadow-gray-200   rounded-xl max-w-sm mx-auto relative   text-gray-800 `}
      >
        <div className="relative bg-white rounded-xl overflow-hidden">
          <div className="relative h-full  min-h-[219px] ">
            <>
              <Image
                quality={100}
                src={post.image}
                className=" z-0 group-hover:scale-125  bg-white  transition duration-500 object-cover object-center h-full w-full "
                alt={post.title}
                priority={true}
                layout="fill"
              />
            </>
          </div>

          <div className="absolute  flex z-10 bottom-0 inset-x-0 p-4  bg-gradient-to-t  from-white   via-white/80    text-gray-800">
            <div
              className="relative max-w-full"
              onClick={() => {
                setIsPostModelOpen(true);
              }}
            >
              <div className="w-full  cursor-pointer ">
                <h1
                  title={post.title}
                  className="capitalize  text-xl  font-bold  truncate max-w-[75%]  "
                >
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur, qui.
                </h1>

              </div>
              <div className="text-sm font-light truncate mr-4 flex w-full max-w-[75%] ">
                  By{" "}
                  <div className="truncate px-1 ">{post.author.name}</div> -{" "}
                  {moment(post.createdAt).fromNow()}{" "}
                </div>
            </div>
            <div className=" absolute bottom-4 right-2 ">
              <div className="flex gap-2 flex-grow ">
                <button
                  className="bg-white border text-gray-400 disabled:cursor-not-allowed  text-base p-2 rounded-md  "
                  disabled={likePostMutation.isLoading}
                  onClick={() => handlePostLike()}
                >
                  {isLiked ? <BsHeartFill /> : <BsHeart />}
                </button>
                <button
                  className="bg-white border text-gray-400 disabled:cursor-not-allowed  text-base p-2 rounded-md  "
                  disabled={savePostMutation.isLoading}
                  onClick={() => handlePostSave()}
                >
                  {savedPostQuery.isLoading ? (
                    <BsChatDots />
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
        <div className=" relative text-start flex justify-start items-center gap-4">
          <Link href={`/${post.author.username}`}>
            <div className=" flex gap-3  items-center w-full cursor-pointer">
              <UserAvatar
                src={post.author.Profile?.avatar}
                size={40}
                radius={10}
              />
              <div className="relative  max-w-[70%]">
                <div className="truncate">
                  <span className="truncate  ">{post.author.name}</span>
                  <br />
                  <div className="text-sm text-gray-700   truncate">
                    @{post.author.username}
                  </div>
                </div>
              </div>
            </div>
          </Link>
          {post.LikedPosts.length ? (
            <div className="inline-flex  flex-shrink-0 gap-2 ml-auto items-center">
              <span className="text-sm w-full">Liked by</span>
              <Avatar.Group maxCount={2}>
                {post.LikedPosts?.map((p) => (
                  <Avatar
                    key={p.id}
                    src={p.user.Profile?.avatar}
                    size="small"
                  />
                ))}
              </Avatar.Group>
            </div>
          ) : null}
        </div>
        {post.isPrivate && (
          <div
            title="This post is visible only to you"
            className="absolute top-4 right-2  bg-gray-50 text-gray-500  text-sm p-1 px-3 rounded-full  border-[1px] border-gray-500 "
          >
            Private
          </div>
        )}
      </motion.div>
    </>
  );
}

export default Post;
