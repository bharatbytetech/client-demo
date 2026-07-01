import "@artsdiva/styles/globals.css";
import type { AppProps } from "next/app";
import Link from "next/link";
import { useRouter } from "next/router";
import { GlobalSearchContainer } from "@artsdiva/containers/GlobalSearchContainer";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const showHeader = router.pathname !== "/login";

  return (
    <>
      {showHeader && (
        <header className="flex items-center gap-4 border-b px-4 py-2 text-sm">
          <Link href="/">Home</Link>
          <Link href="/artworks">Artworks</Link>
          <Link href="/artists">Artists</Link>
          <Link href="/clients">Clients</Link>
          <div className="ml-auto">
            <GlobalSearchContainer />
          </div>
        </header>
      )}
      <Component {...pageProps} />
    </>
  );
}
