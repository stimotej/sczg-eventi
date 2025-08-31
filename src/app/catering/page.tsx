import { getPostById } from "@/lib/data/posts";
import clearHtmlFromString from "@/lib/utils/clear-html-from-string";
import { cn } from "@/lib/utils/cn";
import { cateringPostId } from "@/lib/utils/constants";
import { buttonClassName } from "@/modules/common/components/button";
import DisplayHTML from "@/modules/common/components/display-html";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Catering",
};

export default async function CateringPage() {
  const post = await getPostById(cateringPostId);

  if (!post) notFound();

  return (
    <main className="max-w-6xl mx-auto min-h-screen px-4 md:px-6 lg:px-10 py-20">
      <h2 className="text-3xl md:text-4xl font-bold text-center">Catering</h2>
      <section className="mt-10 flex flex-col gap-8 lg:flex-row">
        <div className="flex-1">
          <Image
            src={post.image_url}
            alt={clearHtmlFromString(post.title.rendered)}
            className=" w-full h-[350px] object-cover rounded-lg"
            width={510}
            height={340}
          />
        </div>
        <div className="flex-1">
          <DisplayHTML html={post.content.rendered} className="text-lg" />
          <Link
            className={cn(buttonClassName, "mx-auto mt-8")}
            href={post.meta.link}
          >
            Saznaj više
          </Link>
        </div>
      </section>
    </main>
  );
}
