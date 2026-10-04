"use client";

import { useActionState } from "react";
import { login } from "@/app/actions/auth";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(login, {});

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-4">
      <form
        action={formAction}
        className="w-full max-w-sm rounded-xl border border-stone-200 bg-white p-6 shadow-sm"
      >
        <h1 className="mb-1 text-xl font-semibold text-stone-900">
          German Learning Cards
        </h1>
        <p className="mb-6 text-sm text-stone-500">
          Enter the password to continue.
        </p>

        <label className="mb-1 block text-sm font-medium text-stone-700">
          Password
        </label>
        <input
          type="password"
          name="password"
          autoFocus
          required
          className="mb-3 w-full rounded-md border border-stone-300 px-3 py-2 text-base outline-none focus:border-accent"
        />

        {state.error && (
          <p className="mb-3 text-sm text-rose-600">{state.error}</p>
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
