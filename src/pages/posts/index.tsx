import { GetServerSideProps } from "next";
export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  return {
    redirect: {
      destination: "/",
      permanent: false,
    },
  };
};

function Posts() {
  return null;
}

export default Posts;
