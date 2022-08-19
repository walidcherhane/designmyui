import { Button, Input, Radio, Spin } from "antd";
import React from "react";
import Post from "../components/Post";
import { trpc } from "../utils/trpc";
import { useDebounce } from "ahooks";
import { useRouter } from "next/router";
import Link from "next/link";
import ContentLoader from "react-content-loader";
import { motion } from "framer-motion";
import { Footer } from "antd/lib/layout/layout";
const { Search } = Input;
function Posts() {
  const router = useRouter();
  const q = router.query.q;
  const [searchVal, setSearch] = React.useState("");
  const debouncedValue = useDebounce(searchVal || q);
  const { data, isLoading } = trpc.useQuery([
    "posts.allPosts",
    { search: debouncedValue as string },
  ]);

  return (
    <>
      <div className="container mx-auto min-h-screen">
        <div className="flex  gap-1 md:gap-0  w-full justify-between  items-center   sm:mx-auto my-3  ">
          <div className="w-11/12  md:w-1/2 xl:w-2/3">
            <Search
              placeholder="Enter any kehyword to search"
              onChange={(e) => {
                setSearch(e.target.value);
              }}
            />
          </div>
        </div>
        {debouncedValue && !data?.length ? (
          <div className="flex flex-col items-center justify-center  h-full">
            <h1 className="text-xl font-heading font-semibold text-gray-300 text-center">
              No Posts Found for your criteria <br />{" "}
              <u className="m-2">{debouncedValue}</u>{" "}
            </h1>
          </div>
        ) : (
          debouncedValue && (
            <div className=" mx-5  ">
              Search Results for
              <u className="m-2 font-semibold">{debouncedValue}</u>
            </div>
          )
        )}

        <motion.div
          layout
          className="  grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4  mt-8 mx-auto content-start "
        >
          {isLoading
            ? new Array(3).fill(0).map((_, i) => (
                <ContentLoader
                  key={i}
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
              ))
            : data?.map((post) => <Post key={post.id} id={post.id} />)}
        </motion.div>
      </div>
    </>
  );
}

export default Posts;
