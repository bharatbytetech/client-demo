import "@artsdiva/styles/globals.css";
import type { AppProps } from "next/app";
import Link from "next/link";
import { useRouter } from "next/router";
import { AuthProvider } from "@artsdiva/contexts/AuthProvider";
import { useAuth } from "@artsdiva/hooks/useAuth";
import { GlobalSearchContainer } from "@artsdiva/containers/GlobalSearchContainer";

function Header() {
  const router = useRouter();
  const { user } = useAuth();

  if (router.pathname === "/login") return null;

  return (
    <header className="flex items-center gap-4 border-b border-border px-4 py-3 text-sm">
      <Link href="/" className="font-medium">
        ArtsDiva
      </Link>

      {user && (
        <>
          <Link href="/artworks" className="text-muted hover:text-foreground">
            Artworks
          </Link>
          <Link href="/artists" className="text-muted hover:text-foreground">
            Artists
          </Link>
          <Link href="/clients" className="text-muted hover:text-foreground">
            Clients
          </Link>
          <div className="ml-auto">
            <GlobalSearchContainer />
          </div>
        </>
      )}

      {!user && (
        <Link href="/login" className="ml-auto text-muted hover:text-foreground">
          Log in
        </Link>
      )}
    </header>
  );
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Header />
      <Component {...pageProps} />
    </AuthProvider>
  );
}
