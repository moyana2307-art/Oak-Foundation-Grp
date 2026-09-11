import { createClient } from "@/lib/supabase/server";

export default async function SupabaseTestPage() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("programme_sessions")
    .select("id")
    .limit(1);

  return (
    <main className="min-h-screen p-10">
      <h1 className="text-2xl font-bold">Supabase Connection Test</h1>

      {error ? (
        <p className="mt-4 text-red-600">
          Connection failed: {error.message}
        </p>
      ) : (
        <p className="mt-4 text-green-600">
          Supabase connected successfully.
        </p>
      )}

      <pre className="mt-6">
        {JSON.stringify(data, null, 2)}
      </pre>
    </main>
  );
}