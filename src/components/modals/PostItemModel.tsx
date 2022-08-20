import { message, Spin, Avatar, Divider, Popconfirm, Drawer } from "antd";
import moment from "moment";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useRef } from "react";
import {
  BsBookmark,
  BsBookmarkFill,
  BsChatDots,
  BsCode,
  BsHash,
  BsHeart,
  BsHeartFill,
  BsLockFill,
} from "react-icons/bs";
import { FiLock } from "react-icons/fi";
import {
  SiAdobeillustrator,
  SiAdobephotoshop,
  SiAdobexd,
  SiFigma,
  SiSketch,
} from "react-icons/si";
import { usePalette } from "react-palette";
import { useAuth } from "../../contexts/auth";
import { inferQueryOutput, trpc } from "../../utils/trpc";
import Post from "../Post";
import UserAvatar from "../UserAvatar";
import EditPostModal from "./EditPostModal";
import { AiOutlineClose } from "react-icons/ai";
import { AnimatePresence, motion } from "framer-motion";
type Props = {
  post: inferQueryOutput<"posts.post">;
  isOpen: boolean;
  onClose: () => void;
};

function PostItem({ post, onClose, isOpen }: Props) {
  const router = useRouter();
  const utils = trpc.useContext();
  const { user } = useAuth();

  const [isUpdatePostModel, setIsUpdatePostModel] = React.useState(false);
  const [isImageOpenModel, setIsImageOpenModel] = React.useState(false);
  const DeletePostMutation = trpc.useMutation("posts.deletePost", {
    onSuccess: () => {
      utils.invalidateQueries("posts.post");
      onClose();
    },
  });
  const likePostMutation = trpc.useMutation("posts.likePost", {
    onSuccess: () => {
      utils.invalidateQueries(["posts.likedPosts"]);
      utils.invalidateQueries(["posts.post", { id: post?.id! }]);
    },
  });
  const savePostMutation = trpc.useMutation("posts.savePost", {
    onSuccess: () => {
      utils.invalidateQueries(["posts.savedPosts"]);
      utils.invalidateQueries([
        "users.user",
        { username: user?.username as string },
      ]);
    },
  });
  const likedPostsQuery = trpc.useQuery(["posts.likedPosts"]);
  const savedPostQuery = trpc.useQuery(["posts.savedPosts"]);
  const isLiked = likedPostsQuery.data?.some((p) => p.postId === post?.id);
  const isSaved = savedPostQuery.data?.some((p) => p.postId === post?.id);

  const { data: postImageData } = usePalette(post?.image as string);
  const imageColorPallete = Object.keys(postImageData).map(function (key) {
    return postImageData[key];
  });
  // remove duplicates
  const imageColorPalleteUnique = imageColorPallete.filter(
    (item, pos) => imageColorPallete.indexOf(item) === pos
  );

  if (!post) {
    onClose();
    message.error("Post not found");
    return null;
  }

  const handlePostDelete = async () => {
    try {
      await DeletePostMutation.mutateAsync({ id: post.id });
      router.push("/posts");
    } catch (error) {
      console.error(error);
      if (DeletePostMutation.isError) {
        message.error(DeletePostMutation.error.message);
        return;
      }
      message.error("Something wrong happended");
    }
  };

  const handlePostLike = async () => {
    try {
      await likePostMutation.mutateAsync({
        id: post.id,
      });
    } catch (error: any) {
      message.error(error.message);
    }
  };

  const handlePostSave = async () => {
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
      <AnimatePresence>
        {isImageOpenModel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            className="fixed flex items-center justify-center inset-0 z-[2000] bg-gray-900/40"
            onClick={() => setIsImageOpenModel(false)}
          >
            <Image
              quality={100}
              alt="post"
              src={post.image}
              className="object-center object-cover"
              width={700}
              height={500}
            />
          </motion.div>
        )}
      </AnimatePresence>
      <Drawer
        placement={"bottom"}
        onClose={onClose}
        visible={isOpen}
        destroyOnClose={true}
        height={600}
        closable={false}
      >
        <div className="relative lg:p-10">
          <div className="absolute top-3 right-4 text-center text-gray-500 ">
            <button
              className=" flex h-10  w-10 flex-col items-center justify-center rounded-full border bg-white p-2 text-xl"
              onClick={onClose}
            >
              <AiOutlineClose />
            </button>
            Esc
          </div>
          <div className="flex items-center justify-start p-4 py-0">
            <UserAvatar src={post.author.image} size={40} />
            <div className="m-4">
              <div className="text-xs text-gray-400">Posted by:</div>
              <div className="text-lg font-bold">{post.author.name}</div>
            </div>
          </div>
          <div className="mt-4 grid min-h-screen md:grid-cols-2 md:grid-rows-1 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div
                onClick={() => setIsImageOpenModel(true)}
                style={{ backgroundColor: postImageData.lightMuted }}
                className={`relative flex 	cursor-pointer h-full  items-start justify-center lg:col-span-2`}
              >
                <Image
                  quality={100}
                  priority={true}
                  className="h-full min-w-max object-contain"
                  src={post.image}
                  alt={post.title}
                  width={1000}
                  height={800}
                />
              </div>
            </div>
            <div className="bg-gray-50">
              <div className="p-5">
                <div className="flex flex-grow justify-between gap-2">
                  <div className="flex items-center gap-1 text-xs">
                    {post.LikedPosts.length ? (
                      <div className="ml-auto  inline-flex flex-shrink-0 items-center gap-2">
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

                    {post.LikedPosts.length ? (
                      <>
                        {`Liked by ${post.LikedPosts[0]?.user.name.substring(
                          0,
                          15
                        )}`}
                        {post.LikedPosts.length > 1
                          ? ` and 
                                  ${post.LikedPosts.length - 1} other ${
                              post.LikedPosts.length - 1 > 1 ? "s" : ""
                            }`
                          : null}
                      </>
                    ) : null}
                  </div>
                  <div className="flex gap-2 ">
                    <button
                      className="rounded-md border bg-white p-2  px-4 text-base text-gray-400 disabled:cursor-not-allowed  "
                      disabled={likePostMutation.isLoading}
                      onClick={() => handlePostLike()}
                    >
                      {isLiked ? (
                        <div className="flex items-center gap-2  text-indigo-400 ">
                          <BsHeartFill /> Liked
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 ">
                          <BsHeart />
                          Like
                        </div>
                      )}
                    </button>
                    <button
                      className="rounded-md border bg-white p-2  px-4 text-base text-gray-400 disabled:cursor-not-allowed  "
                      disabled={savePostMutation.isLoading}
                      onClick={() => handlePostSave()}
                    >
                      {savedPostQuery.isLoading ? (
                        <BsChatDots />
                      ) : isSaved ? (
                        <BsBookmarkFill className="text-indigo-400" />
                      ) : (
                        <BsBookmark />
                      )}
                    </button>
                  </div>
                </div>
                {post.isPrivate && (
                  <div
                    title="This post is visible only to you"
                    className="mt-4 inline-flex items-center   gap-2 rounded-md border  bg-white p-2 px-3 text-center text-gray-500"
                  >
                    <FiLock />
                    Private
                  </div>
                )}
                <div className="mt-4 text-xl  font-bold  capitalize">
                  {post.title}
                </div>
                <div className="font-light text-gray-400">
                  {moment(post.createdAt).fromNow()}{" "}
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-start gap-2 ">
                  {post.softwares?.split(",").map((software, i) => (
                    <Link href={`/?q=${software}`} key={software}>
                      <a className="inline-flex flex-shrink-0 items-center gap-2 rounded-xl border bg-white p-2 px-3 text-indigo-400  transition-all  hover:border-indigo-400">
                        {software == "Figma" && <SiFigma />}
                        {software === "Adobe XD" && <SiAdobexd />}
                        {software === "Adobe Photoshop" && <SiAdobephotoshop />}
                        {software === "Adobe Illustrator" && (
                          <SiAdobeillustrator />
                        )}
                        {software === "Sketch" && <SiSketch />}
                        {software}
                      </a>
                    </Link>
                  ))}
                </div>
                <div className="mt-4 border bg-white p-4 py-8 text-center">
                  <div className=" text-xl font-semibold text-gray-700">
                    Color Pallet
                  </div>
                  <div className="mt-1 text-sm text-gray-300 ">
                    Click the color to copy code.
                  </div>
                  <div className="mt-4  grid grid-cols-2 items-center  justify-start gap-2 lg:grid-cols-3">
                    {imageColorPalleteUnique.map((HexClr, i) => {
                      return (
                        <div
                          key={HexClr}
                          className="flex-shrink-0 cursor-pointer items-center gap-1 rounded-xl border  bg-white p-2  px-3 transition-all hover:border-indigo-400"
                          onClick={() => {
                            navigator.clipboard.writeText(HexClr as string);
                            message.success("Copied");
                          }}
                        >
                          <div
                            className={`flex h-full w-full items-center justify-center gap-2`}
                          >
                            <div
                              className="h-4 w-4 rounded-full "
                              style={{ backgroundColor: HexClr }}
                            ></div>
                            <div className="text-xs text-gray-400">
                              {HexClr}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap items-center justify-start gap-2">
                  {post.tags?.split(",").map((tag, i) => (
                    <Link href={`/?q=${tag}`} key={tag}>
                      <a className="inline-flex  flex-shrink-0 items-center gap-1 rounded-xl border bg-white p-2 px-3  text-indigo-400 transition-all hover:border-indigo-400">
                        <BsHash className="text-xl" /> {tag}
                      </a>
                    </Link>
                  ))}
                </div>
                {post.author.id === user?.id && (
                  <div className="flex-wrdap mt-8 flex w-full  items-center gap-2">
                    <button
                      onClick={() => setIsUpdatePostModel(true)}
                      className=" w-full  items-center justify-center gap-2 rounded-xl border bg-white p-2 px-3 text-center transition-all    hover:border-indigo-400 hover:text-indigo-400"
                    >
                      {"Edit Post "}
                    </button>
                    <Popconfirm
                      title="Are you sure you want to delete this post?"
                      onConfirm={handlePostDelete}
                    >
                      <button className=" w-full items-center justify-center gap-2 rounded-xl border bg-white p-2 px-3 text-center transition-all hover:border-red-400    hover:bg-red-50/75 hover:text-red-400">
                        {"Delete Post "}
                      </button>
                    </Popconfirm>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="bg-gray-50 py-8 lg:p-8">
            <Divider>
              <UserAvatar src={post.author.image} size={80} />
            </Divider>
            <div className="flex flex-col items-center justify-center">
              <div className="text-center text-lg  font-bold  ">
                {post.author.name}
              </div>
              <div className=" text-center font-light  text-gray-400  ">
                @{post.author.username}
              </div>
              <Link href={`/${post.author.username}`}>
                <a className=" mt-4 rounded-md bg-indigo-600 p-2 px-3 font-light text-white transition-all hover:bg-indigo-500  hover:text-white ">
                  View Profile
                </a>
              </Link>
            </div>
            {post.author.Posts.length && (
              <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3 ">
                <div className="col-span-full   p-3 px-8">
                  More by{" "}
                  <span className="font-semibold">{post.author.name}</span>
                </div>
                {post.author.Posts.map(({ id }) => (
                  <Post key={id} id={id} />
                ))}
              </div>
            )}
          </div>
        </div>
      </Drawer>
      <EditPostModal
        isOpen={isUpdatePostModel}
        post={post}
        onClose={() => setIsUpdatePostModel(false)}
      />
    </>
  );
}

export default PostItem;
