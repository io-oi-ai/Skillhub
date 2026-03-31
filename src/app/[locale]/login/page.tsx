import { getDictionary } from "@/i18n/get-dictionary";
import { isValidLocale, type Locale } from "@/i18n/config";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LoginForm from "./LoginForm";

interface Props {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ next?: string }>;
}

export default async function LoginPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const query = await searchParams;
  if (!isValidLocale(locale)) notFound();

  const dict = await getDictionary(locale as Locale);
  const next = query.next && query.next.startsWith("/") ? query.next : undefined;

  return (
    <>
      <Header locale={locale as Locale} dict={dict} />
      <main className="flex flex-1 items-center justify-center bg-bg-primary px-4 py-16">
        <LoginForm dict={dict} locale={locale as Locale} next={next} />
      </main>
      <Footer locale={locale as Locale} dict={dict} />
    </>
  );
}
