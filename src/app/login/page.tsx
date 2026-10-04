"use client";

import { useActionState } from "react";
import { login } from "@/app/actions/auth";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(login, {});

  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-50 p-4 dark:bg-neutral-950">
      <form
        action={formAction}
        className="w-full max-w-sm rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
      >
        <h1 className="mb-1 text-xl font-semibold text-neutral-900 dark:text-neutral-100">
          German Learning Cards
        </h1>
        <p className="mb-6 text-sm text-neutral-500 dark:text-neutral-400">
          Enter the password to continue.
        </p>

        <label className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
          Password
        </label>
        <input
          type="password"
          name="password"
          autoFocus
          required
          className="mb-3 w-full rounded-md border border-neutral-300 px-3 py-2 text-base outline-none focus:border-accent dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
        />

        {state.error && (
          <p className="mb-3 text-sm text-red-600 dark:text-red-400">
            {state.error}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-md bg-accent px-4 py-2 text-base font-medium text-accent-foreground transition-transform active:scale-95 disabled:opacity-50"
        >
          {pending ? "Checking..." : "Enter"}
        </button>
      </form>
    </main>
  );
}
