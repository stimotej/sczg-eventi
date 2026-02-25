"use server";

import type {
  RentiqeCartAddItemPayload,
  RentiqeCartAddItemResponse,
  RentiqeCartPaymentIntentPayload,
  RentiqeCartPaymentIntentResponse,
  RentiqeCartResponse,
  RentiqeCartUpdateItemPayload,
  RentiqeCreateOrderPayload,
  RentiqeCreateOrderResponse,
  RentiqeDeleteOrderPayload,
  RentiqeDeleteOrderResponse,
  RentiqeListingOrder,
  RentiqeListingOrdersParams,
  RentiqeListingsParams,
  RentiqeListingsResponse,
} from "./rentiqe-types";
import { revalidateTime } from "../utils/constants";

const RENTIQE_BASE_URL = process.env.NEXT_PUBLIC_RENTIQE_API_BASE_URL;

export async function getRentiqeListings(
  params: RentiqeListingsParams = {},
  options: RequestInit = {},
): Promise<RentiqeListingsResponse> {
  if (!RENTIQE_BASE_URL) {
    throw new Error("NEXT_PUBLIC_RENTIQE_API_BASE_URL is not set");
  }

  const storeSlug = process.env.RENTIQE_STORE_SLUG;
  const connectionKey = process.env.RENTIQE_CONNECTION_KEY;

  if (!storeSlug || !connectionKey) {
    throw new Error(
      "RENTIQE_STORE_SLUG and RENTIQE_CONNECTION_KEY must be set",
    );
  }

  const baseUrl = RENTIQE_BASE_URL.replace(/\/$/, "");
  const query = new URLSearchParams();

  if (params.search) {
    query.set("q", params.search);
  }

  if (typeof params.limit === "number") {
    query.set("limit", params.limit.toString());
  }

  if (params.categories?.length) {
    params.categories.forEach((category) => query.append("c", category));
  }

  if (params.locationSlugs?.length) {
    params.locationSlugs.forEach((location) => query.append("l", location));
  }

  if (typeof params.priceMin === "number") {
    query.set("min", params.priceMin.toString());
  }

  if (typeof params.priceMax === "number") {
    query.set("max", params.priceMax.toString());
  }

  if (params.startDate) {
    query.set("start", params.startDate);
  }

  if (params.endDate) {
    query.set("end", params.endDate);
  }

  const url = `${baseUrl}/store/${storeSlug}/listings${
    query.toString() ? `?${query.toString()}` : ""
  }`;

  const response = await fetch(url, {
    cache: "force-cache",
    next: {
      revalidate: revalidateTime,
    },
    ...options,
    headers: {
      "Content-Type": "application/json",
      "X-Store-Connection-Code": connectionKey,
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `HTTP error! status: ${response.status}`,
    );
  }

  return response.json() as Promise<RentiqeListingsResponse>;
}

export async function getRentiqeListingOrders(
  params: RentiqeListingOrdersParams,
  options: RequestInit = {},
): Promise<RentiqeListingOrder[]> {
  if (!RENTIQE_BASE_URL) {
    throw new Error("NEXT_PUBLIC_RENTIQE_API_BASE_URL is not set");
  }

  const storeSlug = process.env.RENTIQE_STORE_SLUG;
  const connectionKey = process.env.RENTIQE_CONNECTION_KEY;

  if (!storeSlug || !connectionKey) {
    throw new Error(
      "RENTIQE_STORE_SLUG and RENTIQE_CONNECTION_KEY must be set",
    );
  }

  const baseUrl = RENTIQE_BASE_URL.replace(/\/$/, "");
  const query = new URLSearchParams();
  query.set("warehouseId", params.warehouseId);

  const url = `${baseUrl}/store/${storeSlug}/listings/${params.listingSlug}/orders?${query.toString()}`;

  const response = await fetch(url, {
    cache: "no-store",
    ...options,
    headers: {
      "Content-Type": "application/json",
      "X-Store-Connection-Code": connectionKey,
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `HTTP error! status: ${response.status}`,
    );
  }

  return response.json() as Promise<RentiqeListingOrder[]>;
}

export async function createRentiqeOrder(
  payload: RentiqeCreateOrderPayload,
  options: RequestInit = {},
): Promise<RentiqeCreateOrderResponse> {
  if (!RENTIQE_BASE_URL) {
    throw new Error("NEXT_PUBLIC_RENTIQE_API_BASE_URL is not set");
  }

  const storeSlug = process.env.RENTIQE_STORE_SLUG;
  const connectionKey = process.env.RENTIQE_CONNECTION_KEY;

  if (!storeSlug || !connectionKey) {
    throw new Error(
      "RENTIQE_STORE_SLUG and RENTIQE_CONNECTION_KEY must be set",
    );
  }

  const baseUrl = RENTIQE_BASE_URL.replace(/\/$/, "");
  const url = `${baseUrl}/store/${storeSlug}/create-order`;

  const response = await fetch(url, {
    method: "POST",
    cache: "no-store",
    ...options,
    headers: {
      "Content-Type": "application/json",
      "X-Store-Connection-Code": connectionKey,
      ...(options.headers || {}),
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `HTTP error! status: ${response.status}`,
    );
  }

  return response.json() as Promise<RentiqeCreateOrderResponse>;
}

export async function deleteRentiqeOrder(
  payload: RentiqeDeleteOrderPayload,
  options: RequestInit = {},
): Promise<RentiqeDeleteOrderResponse> {
  if (!RENTIQE_BASE_URL) {
    throw new Error("NEXT_PUBLIC_RENTIQE_API_BASE_URL is not set");
  }

  const storeSlug = process.env.RENTIQE_STORE_SLUG;
  const connectionKey = process.env.RENTIQE_CONNECTION_KEY;

  if (!storeSlug || !connectionKey) {
    throw new Error(
      "RENTIQE_STORE_SLUG and RENTIQE_CONNECTION_KEY must be set",
    );
  }

  const baseUrl = RENTIQE_BASE_URL.replace(/\/$/, "");
  const url = `${baseUrl}/store/${storeSlug}/delete-order`;

  const response = await fetch(url, {
    method: "POST",
    cache: "no-store",
    ...options,
    headers: {
      "Content-Type": "application/json",
      "X-Store-Connection-Code": connectionKey,
      ...(options.headers || {}),
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message ||
        errorData.error ||
        `HTTP error! status: ${response.status}`,
    );
  }

  return response.json() as Promise<RentiqeDeleteOrderResponse>;
}

export async function getRentiqeCart(
  cartId: string,
  options: RequestInit = {},
): Promise<RentiqeCartResponse> {
  if (!RENTIQE_BASE_URL) {
    throw new Error("NEXT_PUBLIC_RENTIQE_API_BASE_URL is not set");
  }

  const storeSlug = process.env.RENTIQE_STORE_SLUG;
  const connectionKey = process.env.RENTIQE_CONNECTION_KEY;

  if (!storeSlug || !connectionKey) {
    throw new Error(
      "RENTIQE_STORE_SLUG and RENTIQE_CONNECTION_KEY must be set",
    );
  }

  const baseUrl = RENTIQE_BASE_URL.replace(/\/$/, "");
  const query = new URLSearchParams({ cartId });
  const url = `${baseUrl}/store/${storeSlug}/cart?${query.toString()}`;

  const response = await fetch(url, {
    cache: "no-store",
    ...options,
    headers: {
      "Content-Type": "application/json",
      "X-Store-Connection-Code": connectionKey,
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `HTTP error! status: ${response.status}`,
    );
  }

  return response.json() as Promise<RentiqeCartResponse>;
}

export async function addRentiqeCartItem(
  payload: RentiqeCartAddItemPayload,
  options: RequestInit = {},
): Promise<RentiqeCartAddItemResponse> {
  if (!RENTIQE_BASE_URL) {
    throw new Error("NEXT_PUBLIC_RENTIQE_API_BASE_URL is not set");
  }

  const storeSlug = process.env.RENTIQE_STORE_SLUG;
  const connectionKey = process.env.RENTIQE_CONNECTION_KEY;

  if (!storeSlug || !connectionKey) {
    throw new Error(
      "RENTIQE_STORE_SLUG and RENTIQE_CONNECTION_KEY must be set",
    );
  }

  const baseUrl = RENTIQE_BASE_URL.replace(/\/$/, "");
  const url = `${baseUrl}/store/${storeSlug}/cart/items`;

  const response = await fetch(url, {
    method: "POST",
    cache: "no-store",
    ...options,
    headers: {
      "Content-Type": "application/json",
      "X-Store-Connection-Code": connectionKey,
      ...(options.headers || {}),
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `HTTP error! status: ${response.status}`,
    );
  }

  return response.json() as Promise<RentiqeCartAddItemResponse>;
}

export async function updateRentiqeCartItem(
  itemId: string,
  payload: RentiqeCartUpdateItemPayload,
  options: RequestInit = {},
): Promise<unknown> {
  if (!RENTIQE_BASE_URL) {
    throw new Error("NEXT_PUBLIC_RENTIQE_API_BASE_URL is not set");
  }

  const storeSlug = process.env.RENTIQE_STORE_SLUG;
  const connectionKey = process.env.RENTIQE_CONNECTION_KEY;

  if (!storeSlug || !connectionKey) {
    throw new Error(
      "RENTIQE_STORE_SLUG and RENTIQE_CONNECTION_KEY must be set",
    );
  }

  const baseUrl = RENTIQE_BASE_URL.replace(/\/$/, "");
  const url = `${baseUrl}/store/${storeSlug}/cart/items/${itemId}`;

  const response = await fetch(url, {
    method: "PATCH",
    cache: "no-store",
    ...options,
    headers: {
      "Content-Type": "application/json",
      "X-Store-Connection-Code": connectionKey,
      ...(options.headers || {}),
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `HTTP error! status: ${response.status}`,
    );
  }

  return response.json() as Promise<unknown>;
}

export async function removeRentiqeCartItem(
  itemId: string,
  cartId: string,
  options: RequestInit = {},
): Promise<unknown> {
  if (!RENTIQE_BASE_URL) {
    throw new Error("NEXT_PUBLIC_RENTIQE_API_BASE_URL is not set");
  }

  const storeSlug = process.env.RENTIQE_STORE_SLUG;
  const connectionKey = process.env.RENTIQE_CONNECTION_KEY;

  if (!storeSlug || !connectionKey) {
    throw new Error(
      "RENTIQE_STORE_SLUG and RENTIQE_CONNECTION_KEY must be set",
    );
  }

  const baseUrl = RENTIQE_BASE_URL.replace(/\/$/, "");
  const query = new URLSearchParams({ cartId });
  const url = `${baseUrl}/store/${storeSlug}/cart/items/${itemId}?${query.toString()}`;

  const response = await fetch(url, {
    method: "DELETE",
    cache: "no-store",
    ...options,
    headers: {
      "Content-Type": "application/json",
      "X-Store-Connection-Code": connectionKey,
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `HTTP error! status: ${response.status}`,
    );
  }

  return response.json() as Promise<unknown>;
}

export async function refreshRentiqeCartPaymentIntent(
  payload: RentiqeCartPaymentIntentPayload,
  options: RequestInit = {},
): Promise<RentiqeCartPaymentIntentResponse> {
  if (!RENTIQE_BASE_URL) {
    throw new Error("NEXT_PUBLIC_RENTIQE_API_BASE_URL is not set");
  }

  const storeSlug = process.env.RENTIQE_STORE_SLUG;
  const connectionKey = process.env.RENTIQE_CONNECTION_KEY;

  if (!storeSlug || !connectionKey) {
    throw new Error(
      "RENTIQE_STORE_SLUG and RENTIQE_CONNECTION_KEY must be set",
    );
  }

  const baseUrl = RENTIQE_BASE_URL.replace(/\/$/, "");
  const url = `${baseUrl}/store/${storeSlug}/cart/payment-intent`;

  const response = await fetch(url, {
    method: "POST",
    cache: "no-store",
    ...options,
    headers: {
      "Content-Type": "application/json",
      "X-Store-Connection-Code": connectionKey,
      ...(options.headers || {}),
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `HTTP error! status: ${response.status}`,
    );
  }

  return response.json() as Promise<RentiqeCartPaymentIntentResponse>;
}
