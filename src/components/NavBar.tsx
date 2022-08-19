import { Avatar, Divider, Dropdown, Menu, Space } from "antd";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useAuth } from "../contexts/auth";
import UserAvatar from "./UserAvatar";
import { IoExitOutline } from "react-icons/io5";
import { FiLock } from "react-icons/fi";
import { AiOutlineUser, AiOutlineUserDelete } from "react-icons/ai";
import ChangePasswordModal from "./modals/ChangePasswordModal";
import DeleteAccount from "./modals/DeleteProfileModal";
function NavBar() {
  const { user, isLoading } = useAuth();
  const [activeModelIndex, setActiveModelIndex] = React.useState<Number | null>(
    null
  );
  const navUserOverlay = (
    <Menu
      onClick={({ key }) => {
        setActiveModelIndex(parseInt(key));
      }}
      items={[
        {
          key: 0,
          label: (
            <Link href={`/${user?.username}`}>
              <a>
                <Space>
                  <AiOutlineUser />
                  <Divider className="mx-0 mr-2" type="vertical" />
                  Profile
                </Space>
              </a>
            </Link>
          ),
        },
        {
          key: 1,
          label: (
            <Space>
              <FiLock />
              <Divider className="mx-0 mr-2" type="vertical" />
              Change Password
            </Space>
          ),
        },
        {
          key: 2,
          label: (
            <button
              className="inline-flex items-center gap-2"
              onClick={() => signOut()}
            >
              <Space>
                <IoExitOutline />
                <Divider className="mx-0 mr-2" type="vertical" />
                Sign out
              </Space>
            </button>
          ),
        },
        {
          type: "divider",
        },
        {
          key: 3,
          danger: true,
          label: (
            <Space>
              <AiOutlineUserDelete />
              <Divider className="mx-0 mr-2" type="vertical" />
              Delete Account
            </Space>
          ),
        },
      ]}
    />
  );

  return (
    <>
      <div className="fixed top-0 z-50 w-full  bg-white p-3 text-gray-800 shadow-lg  shadow-gray-100  ">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div className="mr-auto p-2 text-xl font-bold">
              <Link href={"/"}>
                <a className="flex items-center  justify-center gap-4">
                  <Image src={"/logo.png"} width={40} height={40} alt="logo" />
                  <span className="font-default font-semibold">
                    Design my ui
                  </span>
                </a>
              </Link>
            </div>
            <div className="m-0 ml-auto mr-0 flex items-center justify-center gap-4 text-sm sm:gap-8 ">
              {isLoading ? (
                <>
                  <div className="h-2 w-20 rounded-full bg-gray-100 animate-pulse" />
                  <div className="h-10 w-10 rounded-lg bg-gray-100 animate-pulse" />
                </>
              ) : user ? (
                <>
                  <Link href="/posts/new">
                    <a className="rounded-lg  border border-gray-400 bg-transparent  py-2 px-4 font-semibold text-gray-800 hover:bg-gray-50 hover:text-gray-600">
                      New Post
                    </a>
                  </Link>
                  <Dropdown arrow overlay={navUserOverlay}>
                    <div>
                      <UserAvatar
                        classNames="cursor-pointer mt-1"
                        src={user?.Profile?.avatar}
                        size={35}
                        radius={8}
                      />
                    </div>
                  </Dropdown>
                </>
              ) : (
                <>
                  <Link href="/auth/signin">Login</Link>
                  <Link href="/auth/signup">Register</Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <ChangePasswordModal
        onClose={() => setActiveModelIndex(null)}
        isOpen={activeModelIndex === 1}
      />
      <DeleteAccount
        onClose={() => setActiveModelIndex(null)}
        isOpen={activeModelIndex === 3}
      />
    </>
  );
}

export default NavBar;
