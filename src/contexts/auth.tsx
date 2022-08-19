import { createContext, useContext, useEffect, useState } from "react";
import { inferQueryOutput, trpc } from "../utils/trpc";
import Redirect from "../components/Redirect";
import { signOut, useSession } from "next-auth/react";

interface AuthInterface {
  user: inferQueryOutput<"users.me">;
  isAuthenticated: boolean;
}

const AuthContext = createContext({} as AuthInterface);

export const useAuth = () => {
  const authContext = useContext(AuthContext);

  return authContext;
};

export const AuthenticatedOnly = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : null;
};

export const UnauthenticatedOnly = ({
  children,
}: {
  children: JSX.Element;
}) => {
  const { isAuthenticated } = useAuth();
  return !isAuthenticated ? children : null;
};

export const AuthProvider = ({ children }: { children: JSX.Element }) => {
  const { data: user } = trpc.useQuery(["users.me"]);
  const session = useSession();
  return (
    <AuthContext.Provider
      value={{
        user: user && session.status === "authenticated" ? user : null,
        isAuthenticated: session.status === "authenticated" && user !== null,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const PrivateRoutes = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Redirect to="/auth/signin" />;
};

export const PublicRoutes = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useAuth();
  return !isAuthenticated ? children : <Redirect to="/" />;
};
