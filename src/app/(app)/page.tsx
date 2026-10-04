import TypeSelector from "@/components/TypeSelector";

export default function HomePage() {
  return (
    <div className="flex w-full flex-1 flex-col items-center justify-center">
      <h1 className="mb-2 text-2xl font-semibold text-stone-900">
        Choose what to practice
      </h1>
      <p className="mb-8 text-sm text-stone-500">
        Select at least one word type to start a session.
      </p>
      <TypeSelector />
    </div>
  );
}
