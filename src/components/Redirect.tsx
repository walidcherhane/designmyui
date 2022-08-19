import Router from "next/router";
import { useEffect } from "react";

const Redirect: React.FC<{
  to: string;
}> = ({ to }) => {
  useEffect(() => {
    Router.push(to);
  }, [to]);
  return <>
    Redirecting...
  </>;
};

export default Redirect;
