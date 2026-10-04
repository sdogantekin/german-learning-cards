import Link from "next/link";
import { logout } from "@/app/actions/auth";

export default function NavBar() {
  return (
    <header className="flex items-center justify-between border-b border-neutral-200 px-4 py-3 dark:border-neutral-800">
      <Link href="/" className="text-base font-semibold">
        German Learning Cards
      </Link>
      <nav className="flex items-center gap-4 text-sm">
        <Link
          href="/stats"
          className="text-neutral-600 transition-colors hover:text-accent dark:text-neutral-400"
        >
          Stats
        </Link>
        <form action={logout}>
          <button
            type="submit"
            className="text-neutral-600 transition-colors hover:text-accent dark:text-neutral-400"
          >
            Logout
          </button>
        </form>
      </nav>
    </header>
  );
}
