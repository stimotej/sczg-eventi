import Image from "next/image";
import clearHtmlFromString from "@/lib/utils/clear-html-from-string";
import getRentiqeImageUrl from "@/lib/utils/rentiqe-image-loader";
import DisplayHTML from "@/modules/common/components/display-html";
import type { RentiqeListing } from "@/lib/data/rentiqe-types";

type PostDetailsProps = {
  listing: RentiqeListing;
};

export default function PostDetails({ listing }: PostDetailsProps) {
  const image = listing.images[0];

  return (
    <section className="rounded-lg border border-neutral-200 p-5 md:p-6">
      {image ? (
        <Image
          src={getRentiqeImageUrl(image.url, 900)}
          alt={image.alt || listing.name}
          className="w-full h-[280px] object-cover rounded-lg"
          width={900}
          height={280}
        />
      ) : null}
      <DisplayHTML
        as="h3"
        className="text-2xl font-semibold mt-4"
        html={clearHtmlFromString(listing.name)}
      />
      <DisplayHTML
        as="p"
        className="mt-3 text-base text-neutral-700"
        html={clearHtmlFromString(listing.description)}
      />
    </section>
  );
}
