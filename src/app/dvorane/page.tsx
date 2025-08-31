import { getPostsByCategoryId } from "@/lib/data/posts";
import clearHtmlFromString from "@/lib/utils/clear-html-from-string";
import { dvoraneCategoryId } from "@/lib/utils/constants";
import DisplayHTML from "@/modules/common/components/display-html";
import { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Dvorane",
};

export default async function DvoranePage() {
  const posts = await getPostsByCategoryId(dvoraneCategoryId);

  return (
    <main className="max-w-6xl mx-auto min-h-screen px-4 md:px-6 lg:px-10 py-20">
      <h2 className="text-3xl md:text-4xl font-bold text-center">Događanja</h2>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
        {posts.map((post) => (
          <li key={post.id}>
            <figure>
              <Image
                src={post.image_url}
                alt={clearHtmlFromString(post.title.rendered)}
                className="w-full h-[250px] object-cover rounded-lg"
                width={600}
                height={250}
              />
              <DisplayHTML
                as="figcaption"
                className="text-center mt-3"
                html={clearHtmlFromString(post.title.rendered)}
              />
            </figure>
            <DisplayHTML
              as="p"
              className="mt-3"
              html={clearHtmlFromString(post.content.rendered)}
            />
          </li>
        ))}
      </ul>
    </main>
  );
}
