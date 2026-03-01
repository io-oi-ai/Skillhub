import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SkillGrid from "@/components/SkillGrid";
import RetroComputer from "@/components/RetroComputer";
import { getAllSkills } from "@/lib/skills";

export default function Home() {
  const skills = getAllSkills();

  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="px-4 pb-20 pt-16 sm:px-6 sm:pt-24 lg:px-8 lg:pb-28 lg:pt-32">
          <div className="mx-auto grid max-w-7xl items-start gap-12 lg:grid-cols-[1fr_1fr] lg:gap-20">
            {/* Left: Text */}
            <div className="pt-4">
              <h1 className="font-serif text-[3.5rem] font-normal leading-[1.1] tracking-[-0.02em] text-text-primary sm:text-[4.5rem] lg:text-[5.5rem]">
                Introducing
                <br />
                <em>AI Skills.</em>
              </h1>

              <p className="mt-8 max-w-[460px] text-[1.125rem] leading-[1.7] text-text-secondary">
                Not just prompts. SkillHub thinks, drafts your
                workflows, organizes your tools, and learns how you
                work. The future of AI productivity is here. And it
                fits in your browser.
              </p>

              <div className="mt-10 flex items-center gap-6">
                <a
                  href="#skills"
                  className="inline-flex items-center rounded-lg bg-accent px-7 py-4 text-[0.9375rem] font-medium text-white transition-colors hover:bg-accent-hover"
                >
                  Browse Skills
                </a>
                <span className="font-mono text-[0.9375rem] tracking-wide text-text-muted">
                  Free & Open Source
                </span>
              </div>

              {/* Feature Grid */}
              <div className="mt-16 grid grid-cols-2 gap-x-20 gap-y-8 border-t border-border pt-10">
                <div>
                  <p className="font-mono text-[0.6875rem] font-medium uppercase tracking-[0.15em] text-text-muted">
                    Platforms
                  </p>
                  <p className="mt-1.5 font-mono text-[0.875rem] text-text-primary">
                    Claude · Cursor · ChatGPT · OpenClaw
                  </p>
                </div>
                <div>
                  <p className="font-mono text-[0.6875rem] font-medium uppercase tracking-[0.15em] text-text-muted">
                    Community
                  </p>
                  <p className="mt-1.5 font-mono text-[0.875rem] text-text-primary">
                    Open Source
                  </p>
                </div>
                <div>
                  <p className="font-mono text-[0.6875rem] font-medium uppercase tracking-[0.15em] text-text-muted">
                    Install
                  </p>
                  <p className="mt-1.5 font-mono text-[0.875rem] text-text-primary">
                    One-click Setup
                  </p>
                </div>
                <div>
                  <p className="font-mono text-[0.6875rem] font-medium uppercase tracking-[0.15em] text-text-muted">
                    Coverage
                  </p>
                  <p className="mt-1.5 font-mono text-[0.875rem] text-text-primary">
                    11 Roles · 10 Scenes
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Retro Computer Illustration */}
            <div className="hidden lg:flex lg:items-center lg:justify-center" style={{ minHeight: 600 }}>
              <RetroComputer />
            </div>
          </div>
        </section>

        {/* Skills */}
        <section id="skills" className="border-t border-border px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <SkillGrid skills={skills} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
