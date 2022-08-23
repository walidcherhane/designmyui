import { Empty, message, Spin, Tabs, Tooltip, Upload } from "antd";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import Post from "../../components/Post";
import { useAuth } from "../../contexts/auth";
import { trpc } from "../../utils/trpc";
import UserAvatar from "../../components/UserAvatar";
import {
  AiFillCamera,
  AiFillEdit,
  AiFillSave,
  AiOutlineClose,
} from "react-icons/ai";
import ImgCrop from "antd-img-crop";
import { RcFile } from "antd/lib/upload";
import Text from "../../components/Text";
import linkifyHtml from "linkify-html";
import { getBase64 } from "../../utils";

function Profile() {
  const utils = trpc.useContext();
  const router = useRouter();
  const { user: currentUser } = useAuth();

  const [editedUser, setEditedUser] = React.useState<{
    name?: string;
    bio?: string;
    avatar?: string;
    banner?: string;
  } | null>();
  const { data: user, isLoading } = trpc.useQuery([
    "users.user",
    { username: router.query.username as string },
  ]);
  useEffect(() => {
    if (!user && !isLoading) {
      router.push("/");
    }
  }, [user, router, isLoading]);
  const updateProfileMutation = trpc.useMutation("users.updateProfile", {
    onSuccess: () => {
      utils.invalidateQueries([
        "users.user",
        { username: currentUser?.username as string },
      ]);
      utils.invalidateQueries(["users.me"]);
    },
  });

  const beforeUpload = (file: RcFile | File) => {
    const isJpgOrPng =
      file.type === "image/jpeg" ||
      file.type === "image/png" ||
      file.type === "image/webp";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must smaller than 2MB!");
    }
    return isJpgOrPng && isLt2M;
  };
  const updateProfile = async () => {
    if (!editedUser) return;
    try {
      await updateProfileMutation.mutateAsync(editedUser);
      message.success("Profile updated successfully!");
      setEditedUser(null);
    } catch (error) {
      if (updateProfileMutation.isError) {
        message.error(updateProfileMutation.error.message);
        return;
      }
      message.error("Something wrong happended");
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen flex-col items-center justify-center ">
        <Spin tip="Loading..." />
      </div>
    );
  }

  if (!user) {
    return router.push("/posts");
  }
  const canEdit = user?.id === currentUser?.id;

  return (
    <>
      <div className="grid min-h-screen sm:grid-cols-2 sm:gap-4 md:grid-cols-3  lg:grid-cols-4  ">
        <div className="roundeds-xl relative  mx-8 flex  h-fit flex-col  items-start justify-start overflow-hidden    border-4  border-indigo-300 pb-10 sm:mx-2 ">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/header-beams-2.png"
            className="absolute inset-0 h-full w-full "
            alt=""
          />
          <div className="bg-gray-20s0 relative h-40 w-full ">
            {canEdit ? (
              <>
                <ImgCrop aspect={4 / 1.8} beforeCrop={beforeUpload}>
                  <Upload
                    name="banner"
                    listType="picture"
                    beforeUpload={beforeUpload}
                    showUploadList={false}
                    onChange={async ({ file }) => {
                      if (file.status === "done") {
                        getBase64(file.originFileObj as RcFile, (base64) => {
                          setEditedUser({ ...editedUser, banner: base64 });
                        });
                      }
                    }}
                  >
                    <Image
                      layout="fill"
                      src={
                        editedUser?.banner ||
                        user.Profile?.banner ||
                        "https://ik.imagekit.io/buw7k7rvw40/user_header_ztdMQDSVg.jpg?ik-sdk-version=javascript-1.4.3&updatedAt=1648647216517"
                      }
                      alt={`${user.name?.split(" ")[0]}'s header`}
                      className="absolute inset-0 h-full w-full object-cover "
                    />
                  </Upload>
                </ImgCrop>
                <span className=" absolute bottom-2 right-2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-gray-900/50 text-xl text-white">
                  <AiFillCamera />
                </span>
              </>
            ) : (
              <Image
                layout="fill"
                src={
                  user.Profile?.banner ||
                  "https://ik.imagekit.io/buw7k7rvw40/user_header_ztdMQDSVg.jpg?ik-sdk-version=javascript-1.4.3&updatedAt=1648647216517"
                }
                alt={`${user.name?.split(" ")[0]}'s header`}
                className="absolute inset-0 h-full w-full object-cover "
              />
            )}

            <div className="absolute top-full left-1/2 -ml-24 -mt-px h-8 -translate-x-1/2 overflow-hidden">
              <div className="flex h-[2px] w-96 -scale-x-100">
                <div className="w-full flex-none blur-sm [background-image:linear-gradient(90deg,rgba(56,189,248,0)_0%,#0EA5E9_32.29%,rgba(236,72,153,0.3)_67.19%,rgba(236,72,153,0)_100%)]" />
                <div className="-ml-[100%] w-full flex-none blur-[1px] [background-image:linear-gradient(90deg,rgba(56,189,248,0)_0%,#0EA5E9_32.29%,rgba(236,72,153,0.3)_67.19%,rgba(236,72,153,0)_100%)]" />
              </div>
            </div>
          </div>

          <div className=" relative mt-4 flex w-full flex-col items-center justify-center  px-3 text-center ">
            <div className="relative ">
              {canEdit ? (
                <ImgCrop shape="round" quality={1} beforeCrop={beforeUpload}>
                  <Upload
                    name="avatar"
                    listType="picture"
                    className="avatar-uploader"
                    showUploadList={false}
                    beforeUpload={beforeUpload}
                    onChange={async ({ file }) => {
                      if (file.status === "done") {
                        getBase64(file.originFileObj as RcFile, (base64) => {
                          setEditedUser({ ...editedUser, avatar: base64 });
                        });
                      }
                    }}
                  >
                    <UserAvatar
                      src={
                        editedUser?.avatar ||
                        user.Profile?.avatar ||
                        "https://ik.imagekit.io/buw7k7rvw40/avatar_p0Wyeh2b_.svg?ik-sdk-version=javascript-1.4.3&updatedAt=1660157803820"
                      }
                      size={112}
                      alt={user.name}
                      classNames="w-full cursor-pointer"
                    />
                    <span className="  absolute right-0 bottom-0 z-10 flex items-center  justify-center rounded-full border-4 border-gray-100 bg-white bg-clip-border p-2 text-xl text-gray-800">
                      <AiFillCamera />
                    </span>
                  </Upload>
                </ImgCrop>
              ) : (
                <UserAvatar
                  src={
                    user.Profile?.avatar ||
                    "https://ik.imagekit.io/buw7k7rvw40/avatar_p0Wyeh2b_.svg?ik-sdk-version=javascript-1.4.3&updatedAt=1660157803820"
                  }
                  size={112}
                  alt={user.name}
                  classNames="w-full"
                />
              )}
            </div>
            {canEdit && Boolean(editedUser) && (
              <div className="absolute right-6 top-0 m-0 flex flex-col">
                <Tooltip
                  placement="right"
                  title={
                    updateProfileMutation.isLoading
                      ? "Saving..."
                      : "Save changes"
                  }
                >
                  <button
                    disabled={updateProfileMutation.isLoading}
                    onClick={updateProfile}
                    className="rounded-full bg-gray-200 p-3 text-xl text-gray-400"
                  >
                    <AiFillSave />
                  </button>
                </Tooltip>
                <Tooltip placement="right" title={"Cancel all changes"}>
                  <button
                    disabled={updateProfileMutation.isLoading}
                    onClick={() => {
                      setEditedUser(undefined);
                    }}
                    className="mt-2 rounded-full bg-gray-200 p-3 text-xl text-gray-400"
                  >
                    <AiOutlineClose />
                  </button>
                </Tooltip>
              </div>
            )}
            <div className="mt-3 w-full font-default">
              <div className="flex flex-col text-xl  font-bold capitalize text-gray-800 ">
                <Text
                  onSave={(name) => {
                    setEditedUser({
                      ...editedUser,
                      name,
                    });
                  }}
                  type="text"
                  readOnly={!canEdit}
                >
                  {editedUser?.name || user.name}
                </Text>
                <span className="inline-flex items-center justify-center text-sm text-gray-400">
                  @{user.username}
                </span>
              </div>

              <Text
                type="html"
                placeholder="Tell us about yourself"
                readOnly={!canEdit}
                onSave={(bio) => {
                  setEditedUser({
                    ...editedUser,
                    bio,
                  });
                }}
                className="mt-4 text-left text-sm font-bold text-gray-600"
              >
                {linkifyHtml(editedUser?.bio || user.Profile?.bio || "", {
                  className: "text-blue-500",
                  ignoreTags: ["br"],
                  rel: "noopener",
                  target: "__blank",
                  validate: {
                    url: (value: any) =>
                      /^((https?|ftp|file):\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(
                        value
                      ),
                  },
                })}
              </Text>
            </div>
          </div>
        </div>

        <div className=" col-span-full col-start-2 w-full px-8 ">
          <Tabs defaultActiveKey="1">
            <Tabs.TabPane tab={`${user.name?.split(" ")[0]}'s Posts `} key="1">
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-2  ">
                {user.Posts.length ? (
                  user.Posts.sort(
                    (a, b) =>
                      new Date(b.createdAt).getTime() -
                      new Date(a.createdAt).getTime()
                  ).map(({ id }) => <Post id={id} key={id} />)
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
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                {user.SavedPosts.sort(
                  (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
                ).length ? (
                  user.SavedPosts.map(({ postId }) => (
                    <Post id={postId} key={postId} />
                  ))
                ) : (
                  <div className="col-span-full  flex items-center justify-center">
                    <Empty
                      description={`${
                        currentUser?.id === user.id
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
    </>
  );
}

export default Profile;
