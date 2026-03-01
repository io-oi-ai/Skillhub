export default function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6 lg:px-8">
        <p className="text-sm text-text-muted">
          &copy; {new Date().getFullYear()} SkillHub
        </p>
        <p className="text-sm text-text-muted">
          Built for the AI era.
        </p>
      </div>
    </footer>
  );
}
