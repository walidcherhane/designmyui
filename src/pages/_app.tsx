import { withTRPC } from "@trpc/next";
import type { AppRouter } from "../server/router";
import type { AppType } from "next/dist/shared/lib/utils";
import superjson from "superjson";
import { SessionProvider } from "next-auth/react";
import { AuthProvider } from "../contexts/auth";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import "../styles/globals.css";
import { NextSeo } from "next-seo";
import Head from "next/head";

const MyApp: AppType = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <AuthProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </AuthProvider>
    </SessionProvider>
  );
};

const Layout: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NextSeo
        title="The ultimate way to discover design inspiration"
        description="Designmyui.com is a design inspiration resource that features the best User Interface designs across the web. It showcase beautiful, creative and well-made user interfaces from Dribbble, Behance, deviantArt, Pixpa..."
        openGraph={{
          url: "designmyui.software",
          title: "The ultimate way to discover design inspiration",
          description:
            "Designmyui.com is a design inspiration resource that features the best User Interface designs across the web. It showcase beautiful, creative and well-made user interfaces from Dribbble, Behance, deviantArt, Pixpa...",
          images: [
            {
              url: "https://ik.imagekit.io/buw7k7rvw40/twitter_card_120-05_WK4pi1BS-.png?ik-sdk-version=javascript-1.4.3&updatedAt=1661165595249",
            },
          ],
          site_name: "Design My UI",
        }}
        twitter={{
          handle: "@cherhane_walid",
          site: "@designmyui",
          cardType: "summary",
        }}
      />
      <NavBar />
      <div className="my-24">{children}</div>
      <Footer />
    </>
  );
};

const getBaseUrl = () => {
  if (typeof window !== "undefined") {
    return "";
  }
  if (process.browser) return ""; // Browser should use current path
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url

  return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
};

export default withTRPC<AppRouter>({
  config({ ctx }) {
    const url = `${getBaseUrl()}/api/trpc`;
    return {
      url,
      transformer: superjson,
    };
  },
  ssr: false,
})(MyApp);
