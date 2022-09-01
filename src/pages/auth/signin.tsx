import type { GetServerSideProps, NextPage } from "next";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { HiOutlineLockOpen, HiOutlineUser } from "react-icons/hi";
import { MdOutlineVisibility, MdOutlineVisibilityOff } from "react-icons/md";
import { authOptions } from "../api/auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth";
import { useRouter } from "next/router";
import { message } from "antd";
import { AiFillGithub, AiFillGoogleCircle } from "react-icons/ai";
import { ILogin, loginSchema } from "../../schema/auth";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await unstable_getServerSession(
    ctx.req,
    ctx.res,
    authOptions
  );

  if (session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return {
    props: {} as any,
  };
};

const Home: NextPage = () => {
  const { register, handleSubmit } = useForm<ILogin>({
    resolver: zodResolver(loginSchema),
  });
  const [error, setError] = useState<string | null>(null);
  const [passwordVisibility, setPasswordVisibility] = useState<boolean>(false);
  const router = useRouter();
  useEffect(() => {
    if (router.query.error) {
      switch (router.query.error) {
        case "OAuthAccountNotLinked":
          setError(
            "Email on the account is already linked with different account"
          );
          break;
        case "OAuthSignin":
          setError("We had a problem signing you in, please try again");
          break;
        default:
          setError("Sorry something went wrong, please try again later");
          break;
      }
    }
  }, [router.query.error]);
  const onSubmit = useCallback(
    async (data: ILogin) => {
      await signIn("credentials", {
        ...data,
        callbackUrl: "/",
        redirect: false,
      }).then((res) => {
        if (res?.ok) {
          router.push("/");
        } else {
          message.error("Invalid email or password");
        }
      });
    },
    [router]
  );
  const onProviderSignIn = useCallback(
    async (provider: string) => {
      await signIn(provider, {
        callbackUrl: "/",
        redirect: false,
      })
        .then((res) => {
          if (res?.ok) {
            router.push("/");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    [router]
  );

  return (
    <div className=" w-50 relative mx-auto flex max-w-md flex-col  border-8 border-indigo-600/40 bg-white px-4 py-8 shadow-md sm:px-6  md:px-8 lg:px-10 ">
      <div className="self-center text-3xl font-bold sm:text-3xl ">
        {" "}
        Welcome Back{" "}
      </div>
      <div className="mx-10 mt-4 self-center text-center text-sm sm:text-sm ">
        {" "}
        Enter your credentials to access your account{" "}
      </div>
      {error && (
        <div className="my-4 bg-red-100 p-2 text-center text-sm text-red-500   ">
          {" "}
          {error}{" "}
        </div>
      )}
      <div className="mt-4">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-5 flex flex-col">
            <label htmlFor="text" className="mb-2 text-xs tracking-wide ">
              E-Mail Address OR Username:
            </label>
            <div className="relative">
              <div className="  absolute  left-0  top-0  inline-flex  h-full  w-10  items-center  justify-center text-gray-400">
                <HiOutlineUser />
              </div>
              <input
                type="text"
                className=" w-full border  border-gray-400 bg-transparent  py-2  pl-10    pr-4 text-sm  text-gray-900  placeholder-gray-500  focus:border-blue-400 focus:outline-none"
                placeholder="Email Adress"
                {...register("email", {
                  required: "email is required",
                })}
              />
            </div>
          </div>
          <div className="mb-6 flex flex-col">
            <label htmlFor="password" className="mb-2 text-xs tracking-wide ">
              Password:
            </label>
            <div className="relative">
              <span className="  absolute  left-0  top-0  inline-flex  h-full  w-10  items-center  justify-center  text-gray-400">
                <HiOutlineLockOpen />
              </span>
              <input
                type={passwordVisibility ? "text" : "password"}
                className=" w-full border  border-gray-400 bg-transparent py-2 pl-10  pr-4 text-sm text-gray-900 placeholder-gray-500 focus:border-blue-400 focus:outline-none "
                placeholder="Enter your password"
                {...register("password", {
                  required: "Password is required",
                })}
              />
              <button
                onClick={() => setPasswordVisibility(!passwordVisibility)}
                type="button"
                className="  absolute  right-0  top-0  inline-flex  h-full  w-10  items-center  justify-center  text-gray-400"
              >
                {passwordVisibility ? (
                  <MdOutlineVisibilityOff />
                ) : (
                  <MdOutlineVisibility />
                )}
              </button>
            </div>
          </div>
          <div className="flex w-full">
            <button
              type="submit"
              className=" mt-2 flex w-full items-center justify-center bg-blue-500 py-2 text-sm text-white transition  duration-150 ease-in hover:bg-blue-600 focus:outline-none sm:text-base"
            >
              Login
            </button>
          </div>
        </form>
        <div className="flex gap-2">
          <button
            type="submit"
            onClick={() => onProviderSignIn("google")}
            className=" mt-2 flex w-full items-center justify-center gap-3 bg-red-500 py-2 text-sm text-white transition  duration-150 ease-in hover:bg-red-600 focus:outline-none sm:text-base"
          >
            <AiFillGoogleCircle />
            Google
          </button>
          <button
            type="submit"
            onClick={() => onProviderSignIn("github")}
            className=" mt-2 flex w-full items-center justify-center gap-3 bg-gray-800 py-2 text-sm text-white transition  duration-150 ease-in hover:bg-gray-600 focus:outline-none sm:text-base"
          >
            <AiFillGithub />
            Github
          </button>
        </div>
      </div>
      <div className="mt-6 flex items-center justify-center gap-2">
        Need an account?
        <Link href="/auth/signup">Sign up</Link>
      </div>
    </div>
  );
};

export default Home;
