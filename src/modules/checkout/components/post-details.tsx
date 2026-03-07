import clearHtmlFromString from "@/lib/utils/clear-html-from-string";
import DisplayHTML from "@/modules/common/components/display-html";
import type { RentiqeListing } from "@/lib/data/rentiqe-types";
import ListingImageCarousel from "@/modules/checkout/components/listing-image-carousel";
import {
  formatCurrency,
  getBillingPeriodLabel,
} from "@/modules/checkout/utils/pricing";

type PostDetailsProps = {
  listing: RentiqeListing;
};

export default function PostDetails({ listing }: PostDetailsProps) {
  return (
    <section className="rounded-lg border border-neutral-200 p-5 md:p-6">
      <ListingImageCarousel images={listing.images} listingName={listing.name} />
      <DisplayHTML
        as="h3"
        className="text-2xl font-semibold mt-4"
        html={clearHtmlFromString(listing.name)}
      />
      <p className="mt-2 text-base font-semibold text-neutral-900">
        {formatCurrency(listing.price)} / {getBillingPeriodLabel(listing.billingPeriod)}
      </p>
      <DisplayHTML
        as="p"
        className="mt-3 text-base text-neutral-700"
        html={clearHtmlFromString(listing.description)}
      />
    </section>
  );
}
