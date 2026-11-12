interface PlaceholderPageProps {
  title: string;
  description: string;
}

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="font-display text-3xl font-bold text-white">
        {title}
      </h1>
      <p className="mt-2 text-ink-secondary">
        {description}
      </p>
    </main>
  );
}