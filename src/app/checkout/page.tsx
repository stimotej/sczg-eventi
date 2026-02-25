import {
  getRentiqeCart,
  getRentiqeListingOrders,
  getRentiqeListings,
} from "@/lib/data/rentiqe";
import { notFound } from "next/navigation";
import CheckoutForm from "@/modules/checkout/components/checkout-form";
import PostDetails from "@/modules/checkout/components/post-details";

type CheckoutPageProps = {
  searchParams?: Promise<{
    listingId?: string;
    cartId?: string;
    warehouseId?: string;
  }>;
};

export default async function CheckoutPage({
  searchParams,
}: CheckoutPageProps) {
  const resolvedSearchParams = await searchParams;
  const { listings } = await getRentiqeListings();
  const listingId = resolvedSearchParams?.listingId;
  const cartId = resolvedSearchParams?.cartId;
  const listing = listings.find((item) => item.id === listingId) ?? listings[0];

  if (!listing) {
    notFound();
  }

  const warehouseId =
    resolvedSearchParams?.warehouseId ?? listing.inventories[0]?.warehouseId;
  const [cart, orderedItems] = await Promise.all([
    cartId ? getRentiqeCart(cartId) : Promise.resolve(null),
    warehouseId
      ? getRentiqeListingOrders({
          listingSlug: listing.slug,
          warehouseId,
        })
      : Promise.resolve([]),
  ]);

  return (
    <main className="max-w-6xl mx-auto min-h-screen px-4 md:px-6 lg:px-10 py-20">
      <h2 className="text-3xl md:text-4xl font-bold text-center">
        {listing.name}
      </h2>
      <div className="mt-10 grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-10 items-start">
        <PostDetails listing={listing} />
        <CheckoutForm
          cart={cart}
          listing={listing}
          orderedItems={orderedItems}
          warehouseId={warehouseId}
        />
      </div>
    </main>
  );
}
