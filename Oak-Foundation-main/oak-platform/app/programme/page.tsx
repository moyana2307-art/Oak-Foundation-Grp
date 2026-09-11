import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth";
import ProgrammeTabs from "./ProgrammeTabs";
import type { DailyPost } from "@/app/components/register/types";

export default async function ProgrammePage() {
  const session = await requireRole(["oak_staff", "coordination_team", "presenter", "observer", "partner"]);
  if (!session) {
    redirect("/");
  }

  const supabase = await createClient();

  const { data: rawPosts, error: postsError } = await supabase
    .from("daily_posts")
    .select("*")
    .order("day_number", { ascending: true });

  const posts = (rawPosts ?? []) as DailyPost[];

  if (postsError) {
    return (
      <main className="min-h-screen bg-[#F4F5F7]">
        <div className="mx-auto max-w-[520px] px-4 py-10 md:px-6">
          <div className="rounded-[24px] border border-[#E3E8EF] bg-white p-6 text-center">
            <h1 className="text-lg font-bold text-[#162E55]">Programme</h1>
            <p className="mt-2 text-[13px] text-[#6B7A90]">
              Unable to load the programme right now. Please try again shortly.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F4F5F7]">
      <div className="mx-auto max-w-[560px] md:max-w-[760px] px-4 py-6 md:px-6">
        <header className="rounded-[24px] bg-gradient-to-br from-[#263D61] via-[#1D3150] to-[#162E55] px-6 py-8 shadow-[0_18px_40px_-18px_rgba(22,46,85,0.55)]">
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#8FB1DE]">
            OAK Partner Convening 2026
          </p>
          <h1 className="mt-1.5 text-[26px] font-extrabold leading-tight tracking-tight text-white">
            Programme
          </h1>
          <p className="mt-2 text-[13px] text-[#A8BAD9]">
            Day-by-day schedule across the three days in Harare.
          </p>
        </header>

        <ProgrammeTabs
          sessionName={`${session.firstName} ${session.lastName}`.trim()}
          sessionOrg={session.organisation}
        />

        {posts.length > 0 && (
          <section className="mt-6" aria-label="Daily documentation">
            <SectionHeading>Daily updates</SectionHeading>
            <div className="space-y-3">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="rounded-[20px] border border-[#E3E8EF] bg-white p-4 shadow-[0_10px_25px_-16px_rgba(22,46,85,0.3)]"
                >
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#5B6B84]">
                    {post.day_label}
                  </p>
                  <h3 className="mt-1 text-[16px] font-bold text-[#162E55]">{post.title}</h3>
                  {post.body && (
                    <p className="mt-2 whitespace-pre-line text-[13px] leading-relaxed text-[#43546C]">
                      {post.body}
                    </p>
                  )}
                  {post.photo_urls && post.photo_urls.length > 0 && (
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      {(post.photo_urls as string[]).map((url) => (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          key={url}
                          src={url}
                          alt=""
                          loading="lazy"
                          className="aspect-[4/3] w-full rounded-[12px] object-cover"
                        />
                      ))}
                    </div>
                  )}
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-2.5 mt-6 px-1 text-[11px] font-bold uppercase tracking-[0.18em] text-[#5B6B84]">
      {children}
    </h2>
  );
}