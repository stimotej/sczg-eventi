import { getPostById } from "@/lib/data/posts";
import clearHtmlFromString from "@/lib/utils/clear-html-from-string";
import { pocetnaPostId } from "@/lib/utils/constants";
import DisplayHTML from "@/modules/common/components/display-html";
import {
  PhotoProvider,
  PhotoView,
} from "@/modules/common/components/photo-view";
import Image from "next/image";
import { notFound } from "next/navigation";

export default async function Home() {
  const post = await getPostById(pocetnaPostId);

  if (!post) notFound();

  return (
    <main className="max-w-6xl mx-auto min-h-screen">
      <section className="w-full relative">
        <Image
          src={post.image_url}
          alt={clearHtmlFromString(post.title.rendered)}
          className="w-full h-[285px] sm:h-[425px] md:h-[552px] object-cover"
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

      <div className="px-4 md:px-6 lg:px-10 py-20">
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {post.meta.features.map((feature, index) => (
            <div key={index}>
              <div className="flex items-center gap-3">
                <Image
                  className="w-12 h-12 object-contain"
                  src={feature.image_url}
                  alt={feature.title}
                  width={48}
                  height={48}
                />
                <h3 className="text-xl md:text-2xl font-medium tracking-[0.01]">
                  {feature.title}
                </h3>
              </div>
              <p className="text-lg font-medium text-neutral-500 mt-3">
                {feature.description}
              </p>
            </div>
          ))}
        </section>

        <section className="mt-20">
          <h2 className="text-3xl md:text-4xl font-bold text-center">
            Događanja
          </h2>
          <PhotoProvider maskOpacity={0.8}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">
              {post.meta.images.map((img, index) => (
                <PhotoView key={index} src={img}>
                  <div className="overflow-hidden">
                    <Image
                      src={img}
                      alt={`Događanje ${index + 1}`}
                      width={700}
                      height={256}
                      className="w-full h-64 object-cover transition-transform hover:scale-110 cursor-pointer"
                    />
                  </div>
                </PhotoView>
              ))}
            </div>
          </PhotoProvider>
        </section>
      </div>
    </main>
  );
}
