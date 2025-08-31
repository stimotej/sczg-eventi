import { getPostById } from "@/lib/data/posts";
import clearHtmlFromString from "@/lib/utils/clear-html-from-string";
import { kontaktPostId } from "@/lib/utils/constants";
import DisplayHTML from "@/modules/common/components/display-html";
import ContactForm from "@/modules/contact/form";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Kontakt",
};

export default async function KontaktPage() {
  const post = await getPostById(kontaktPostId);

  if (!post) notFound();

  return (
    <main className="max-w-6xl mx-auto min-h-screen">
      <section className="w-full relative">
        <Image
          src={post.image_url}
          alt={clearHtmlFromString(post.title.rendered)}
          className="w-full h-[250px] sm:h-[350px] md:h-[450px] object-cover"
          width={1149}
          height={552}
          priority
        />
        <div className="absolute inset-0 flex items-center justify-center px-4">
          <DisplayHTML
            as="h1"
            className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-[0.01] text-(--background)"
            html={clearHtmlFromString(post.title.rendered)}
          />
        </div>
      </section>
      <section className="px-4 md:px-6 lg:px-10 py-20 flex flex-col gap-12 lg:flex-row">
        <div className="flex-1">
          <DisplayHTML
            className="[&_a]:text-blue-500 [&_a]:hover:underline [&_h1]:text-4xl [&_h2]:text-3xl [&_h3]:text-2xl [&_h4]:text-xl [&_h5]:text-lg"
            html={post.content.rendered}
          />
        </div>
        <div className="flex-1">
          <ContactForm />
        </div>
      </section>
    </main>
  );
}
