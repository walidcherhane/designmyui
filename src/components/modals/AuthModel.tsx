import { zodResolver } from "@hookform/resolvers/zod";
import { Divider, message, Modal } from "antd";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import {
  AiFillGithub,
  AiOutlineLock,
  AiOutlineMail,
  AiFillGoogleCircle,
} from "react-icons/ai";
import { FiAtSign } from "react-icons/fi";
import { MdOutlineVisibility, MdOutlineVisibilityOff } from "react-icons/md";
import { ISignUp, signUpSchema } from "../../schema/auth";
import { trpc } from "../../utils/trpc";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

function AuthModel({ isOpen, onClose }: Props) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ISignUp>({
    resolver: zodResolver(signUpSchema),
  });
  const [passwordVisibility, setPasswordVisibility] = useState<boolean>(false);
  const mutation = trpc.useMutation("users.signup");
  const { mutateAsync } = mutation;
  const onSubmit = useCallback(
    async (data: ISignUp) => {
      try {
        const result = await mutateAsync(data);
        if (result.status === 201) {
          router.push("/posts");
        }
      } catch (error: any) {
        if (error.data.code === "CONFLICT") {
          message.error("User already exists");
          return;
        }
        console.log({ error });
      }
    },
    [mutateAsync, router]
  );

  const onProviderSignIn = useCallback(
    async (provider: string) => {
      await signIn(provider, {
        callbackUrl: "/",
        redirect: false,
      })
        .then((res) => {
          if (res?.ok) {
            router.push("/posts");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    [router]
  );

  return (
    <>
      <Modal
        width={500}
        visible={isOpen}
        confirmLoading={mutation.isLoading}
        onCancel={onClose}
        footer={null}
      >
        <h1 className="text-center text-3xl font-bold sm:text-3xl ">
          Join us Now
        </h1>
        <p className="mx-10 mt-4 text-center text-sm sm:text-sm ">
          Enter your credentials and be apart of us
        </p>
        <Divider />
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="my-4 flex flex-col gap-2">
            {mutation.isSuccess && (
              <p className="bg-gray-50 p-4 text-center font-semibold capitalize text-green-500">
                User created successfully. <Link href="/auth/login">Login</Link>
              </p>
            )}
            <div className="flex w-full flex-col">
              <label htmlFor="username" className="mb-1 text-xs tracking-wide ">
                Username :
              </label>
              <div className="relative">
                <span className=" absolute left-0 top-0 inline-flex h-full w-10 items-center justify-center text-gray-400 ">
                  <FiAtSign />
                </span>
                <input
                  type="text"
                  className="  w-full   border border-gray-400 bg-transparent py-2  pl-10    pr-4 text-sm  text-gray-900  placeholder-gray-500  focus:border-blue-400 focus:outline-none"
                  placeholder="How do you want to be called ?"
                  {...register("username", {
                    required: "Username is required",
                  })}
                />
              </div>
            </div>
            <div className="flex w-full  flex-col">
              <label htmlFor="email" className="mb-1 text-xs tracking-wide ">
                E-Mail Address:
              </label>
              <div className="relative">
                <span className="  absolute  left-0  top-0  inline-flex  h-full  w-10  items-center  justify-center  text-gray-400">
                  <AiOutlineMail />
                </span>
                <input
                  type="email"
                  className="  w-full   border border-gray-400 bg-transparent py-2  pl-10    pr-4 text-sm  text-gray-900  placeholder-gray-500  focus:border-blue-400 focus:outline-none"
                  placeholder="Enter your email"
                  {...register("email", {
                    required: "Email Address is required",
                  })}
                />
              </div>
              <div className="text-red-500 ">
                {errors.email && errors.email.message}
              </div>
            </div>
            <div className="flex w-full flex-col">
              <label htmlFor="password" className="mb-1 text-xs tracking-wide">
                Password:
              </label>
              <div className="relative">
                <span className="  absolute  left-0  top-0  inline-flex  h-full  w-10  items-center  justify-center  text-gray-400">
                  <AiOutlineLock />
                </span>
                <input
                  type={passwordVisibility ? "text" : "password"}
                  id="password"
                  className="w-full  border border-gray-400 bg-transparent py-2 pl-10  pr-4 text-sm text-gray-900 placeholder-gray-500 focus:outline-none"
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
                  )}{" "}
                </button>
              </div>
              <div className="text-red-500 ">
                {errors.password && errors.password.message}
              </div>
            </div>
          </div>
          <div className="col-span-full  flex	">
            <button
              type="submit"
              className=" mt-2 flex w-full items-center justify-center bg-blue-500 py-2 text-sm text-white transition  duration-150 ease-in hover:bg-blue-600 focus:outline-none sm:text-base"
            >
              Sign Up
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
        <div className="mt-6 flex items-center justify-center gap-x-2">
          Already have an account?
          <Link href={"/auth/signin"}>Log in</Link>
        </div>
      </Modal>
    </>
  );
}

export default AuthModel;
