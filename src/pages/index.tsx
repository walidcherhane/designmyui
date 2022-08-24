import { Input } from "antd";
import React from "react";
import Post from "../components/Post";
import { trpc } from "../utils/trpc";
import { useDebounce } from "ahooks";
import { useRouter } from "next/router";
import ContentLoader from "react-content-loader";
import { motion } from "framer-motion";
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
        <div className="my-3  flex w-full  items-center justify-between  gap-1   sm:mx-auto md:gap-0  ">
          <div className="mx-auto  w-11/12 md:w-1/2 xl:w-2/3">
            <Search
              size="large"
              placeholder="Enter any kehyword to search"
              onChange={(e) => {
                setSearch(e.target.value);
              }}
            />
          </div>
        </div>
        {debouncedValue && !data?.length && !isLoading ? (
          <div className="flex h-full flex-col items-center  justify-center">
            <h1 className="text-center font-heading text-xl font-semibold text-gray-300">
              No Posts Found for your criteria <br />{" "}
              <u className="m-2">{debouncedValue}</u>{" "}
            </h1>
          </div>
        ) : (
          debouncedValue &&
          !isLoading && (
            <div className=" mt-5 text-center sm:text-left  ">
              Search Results for
              <u className="m-2 font-semibold">{debouncedValue}</u>
            </div>
          )
        )}

        <motion.div
          layout
          className="mx-auto mt-4 grid grid-cols-1 content-start gap-6  sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 "
        >
          {isLoading
            ? new Array(3).fill(0).map((_, i) => (
                <ContentLoader
                  key={i}
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
              ))
            : data
                ?.sort(
                  (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
                )
                .map((post) => <Post key={post.id} id={post.id} />)}
        </motion.div>
      </div>
    </>
  );
}

export default Posts;
