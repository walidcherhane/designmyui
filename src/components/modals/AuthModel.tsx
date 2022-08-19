import { zodResolver } from "@hookform/resolvers/zod";
import { Divider, message, Modal } from "antd";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import {
  AiFillGithub,
  AiOutlineLock,
  AiOutlineMail,
  AiFillGoogleCircle,
} from "react-icons/ai";
import { FiAtSign } from "react-icons/fi";
import { MdOutlineVisibility } from "react-icons/md";
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
        <h1 className="font-bold text-center text-3xl sm:text-3xl dark:text-white ">
          Join us Now
        </h1>
        <p className="mx-10 mt-4 text-center text-sm sm:text-sm ">
          Enter your credentials and be apart of us
        </p>
        <Divider />
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-2 my-4">
            {mutation.isSuccess && (
              <p className="text-green-500 p-4 bg-gray-50 capitalize font-semibold text-center">
                User created successfully. <Link href="/auth/login">Login</Link>
              </p>
            )}
            <div className="flex flex-col w-full">
              <label htmlFor="username" className="mb-1 text-xs tracking-wide ">
                Username :
              </label>
              <div className="relative">
                <span className=" inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400 ">
                  <FiAtSign />
                </span>
                <input
                  type="text"
                  className="  text-sm  dark:text-white placeholder-gray-500 text-gray-900 bg-transparent pl-10  pr-4    border border-gray-400  w-full  py-2  focus:outline-none focus:border-blue-400"
                  placeholder="How do you want to be called ?"
                  {...register("username", {
                    required: "Username is required",
                  })}
                />
              </div>
            </div>
            <div className="flex flex-col  w-full">
              <label htmlFor="email" className="mb-1 text-xs tracking-wide ">
                E-Mail Address:
              </label>
              <div className="relative">
                <span className="  inline-flex  items-center  justify-center  absolute  left-0  top-0  h-full  w-10  text-gray-400">
                  <AiOutlineMail />
                </span>
                <input
                  type="email"
                  className="  text-sm  dark:text-white placeholder-gray-500 text-gray-900 bg-transparent pl-10  pr-4    border border-gray-400  w-full  py-2  focus:outline-none focus:border-blue-400"
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
            <div className="flex flex-col w-full">
              <label htmlFor="password" className="mb-1 text-xs tracking-wide">
                Password:
              </label>
              <div className="relative">
                <span className="  inline-flex  items-center  justify-center  absolute  left-0  top-0  h-full  w-10  text-gray-400">
                  <AiOutlineLock />
                </span>
                <input
                  id="password"
                  className="text-sm dark:text-white placeholder-gray-500 text-gray-900 bg-transparent pl-10 pr-4  border border-gray-400 w-full py-2 focus:outline-none"
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
              <div className="text-red-500 ">
                {errors.password && errors.password.message}
              </div>
            </div>
          </div>
          <div className="flex  col-span-full	">
            <button
              type="submit"
              className=" flex mt-2 items-center justify-center focus:outline-none text-white text-sm sm:text-base bg-blue-500 hover:bg-blue-600  py-2 w-full transition duration-150 ease-in"
            >
              Sign Up
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
        <div className="flex gap-x-2 justify-center items-center mt-6">
          Already have an account?
          <Link href={"/auth/signin"}>Log in</Link>
        </div>
      </Modal>
    </>
  );
}

export default AuthModel;
