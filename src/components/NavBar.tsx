import Link from "next/link";
import { logout } from "@/app/actions/auth";

export default function NavBar() {
  return (
    <header className="flex items-center justify-between border-b border-stone-200 px-4 py-3">
      <Link href="/" className="text-base font-semibold">
        German Learning Cards
      </Link>
      <nav className="flex items-center gap-4 text-sm">
        <Link
          href="/stats"
          className="text-stone-600 transition-colors hover:text-accent"
        >
          Stats
        </Link>
        <form action={logout}>
          <button
            type="submit"
            className="text-stone-600 transition-colors hover:text-accent"
          >
            Logout
          </button>
        </form>
      </nav>
    </header>
  );
}
