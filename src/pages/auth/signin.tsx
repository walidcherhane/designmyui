import type { GetServerSideProps, NextPage } from "next";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { HiOutlineLockOpen, HiOutlineUser } from "react-icons/hi";
import { MdOutlineVisibility } from "react-icons/md";
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
  const router = useRouter();
  useEffect(() => {
    if (router.query.error) {
      switch (router.query.error) {
        case "OAuthAccountNotLinked":
          setError("Email on the account is already linked with different account");
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
    <div className=" flex flex-col shadow-md sm:px-6 md:px-8 lg:px-10  w-50 max-w-md relative px-4 py-8 bg-white dark:bg-zinc-800 mx-auto  border-8 border-indigo-600/40 ">
      <div className="font-bold self-center text-3xl sm:text-3xl ">
        {" "}
        Welcome Back{" "}
      </div>
      <div className="mt-4 self-center mx-10 text-center text-sm sm:text-sm ">
        {" "}
        Enter your credentials to access your account{" "}
      </div>
      {error && (
        <div className="my-4 text-red-500 bg-red-100 text-center text-sm p-2   ">
          {" "}
          {error}{" "}
        </div>
      )}
      <div className="mt-4">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col mb-5">
            <label htmlFor="text" className="mb-2 text-xs tracking-wide ">
              E-Mail Address OR Username:
            </label>
            <div className="relative">
              <div className="  inline-flex  items-center  justify-center  absolute  left-0  top-0  h-full  w-10 text-gray-400">
                <HiOutlineUser />
              </div>
              <input
                type="text"
                className=" bg-transparent text-sm dark:text-white placeholder-gray-500 text-gray-900  pl-10  pr-4    border border-gray-400  w-full  py-2  focus:outline-none focus:border-blue-400"
                placeholder="Email Adress"
                {...register("email", {
                  required: "email is required",
                })}
              />
            </div>
          </div>
          <div className="flex flex-col mb-6">
            <label htmlFor="password" className="mb-2 text-xs tracking-wide ">
              Password:
            </label>
            <div className="relative">
              <span className="  inline-flex  items-center  justify-center  absolute  left-0  top-0  h-full  w-10  text-gray-400">
                <HiOutlineLockOpen />
              </span>
              <input
                type={"password"}
                className=" bg-transparent text-sm dark:text-white placeholder-gray-500 text-gray-900 pl-10 pr-4  border border-gray-400 w-full py-2 focus:outline-none focus:border-blue-400 "
                placeholder="Enter your password"
                {...register("password", {
                  required: "Password is required",
                })}
              />
              <button
                type="button"
                className="  inline-flex  items-center  justify-center  absolute  right-0  top-0  h-full  w-10  text-gray-400"
              >
                <MdOutlineVisibility />
              </button>
            </div>
            <p className="underline text-gray-400 mt-2 ">
              <button
                type="button"
                className="text-sm text-gray-400 hover:text-gray-600"
              >
                Forgot Password?
              </button>
            </p>
          </div>
          <div className="flex w-full">
            <button
              type="submit"
              className=" flex mt-2 items-center justify-center focus:outline-none text-white text-sm sm:text-base bg-blue-500 hover:bg-blue-600  py-2 w-full transition duration-150 ease-in"
            >
              Login
            </button>
          </div>
        </form>
        <div className="flex gap-2">
          <button
            type="submit"
            onClick={() => onProviderSignIn("google")}
            className=" flex gap-3 mt-2 items-center justify-center focus:outline-none text-white text-sm sm:text-base bg-red-500 hover:bg-red-600  py-2 w-full transition duration-150 ease-in"
          >
            <AiFillGoogleCircle />
            Google
          </button>
          <button
            type="submit"
            onClick={() => onProviderSignIn("github")}
            className=" flex gap-3 mt-2 items-center justify-center focus:outline-none text-white text-sm sm:text-base bg-gray-800 hover:bg-gray-600  py-2 w-full transition duration-150 ease-in"
          >
            <AiFillGithub />
            Github
          </button>
        </div>
      </div>
      <div className="flex gap-2 justify-center items-center mt-6">
        Need an account?
        <Link href="/auth/signup">Sign up</Link>
      </div>
    </div>
  );
};

export default Home;
