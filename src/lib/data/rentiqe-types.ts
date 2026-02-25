export type RentiqeUnit = "piece" | "meter" | "meter_squared" | "hour";
export type RentiqeType = "rent" | "sale" | "subscription";
export type RentiqeBillingPeriod = "hour" | "day" | "week" | "month" | "year";

export interface RentiqeCategory {
  name: string;
  icon: string | null;
  slug: string;
  parentId: string | null;
}

export interface RentiqeInventory {
  slug: string;
  address: string;
  quantity: number;
  lat: number;
  lng: number;
  warehouseId: string;
}

export interface RentiqeImage {
  url: string;
  alt: string | null;
  width: number;
  height: number;
}

export interface RentiqeListing {
  similarityRank?: number;
  rank?: string;
  id: string;
  createdAt: string;
  name: string;
  description: string;
  slug: string;
  minimalPeriod: number;
  price: number;
  unit: RentiqeUnit;
  type: RentiqeType;
  billingPeriod: RentiqeBillingPeriod;
  notAvailableAt: string[] | null;
  url: string;
  minDistance: string | null;
  categories: RentiqeCategory[];
  inventories: RentiqeInventory[];
  images: RentiqeImage[];
}

export interface RentiqeListingsResponse {
  listings: RentiqeListing[];
  nextCursor:
    | {
        createdAt: string;
        distance?: string;
        similarityRank?: number;
        rank?: string;
      }
    | undefined;
}

export interface RentiqeListingsParams {
  search?: string;
  limit?: number;
  categories?: string[];
  locationSlugs?: string[];
  priceMin?: number;
  priceMax?: number;
  startDate?: string;
  endDate?: string;
}

export interface RentiqeListingOrder {
  date: string;
  quantity: number;
}

export interface RentiqeListingOrdersParams {
  listingSlug: string;
  warehouseId: string;
}

export interface RentiqeCheckoutAddress {
  lat: number;
  lng: number;
  country: string;
  postal: string;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  state?: string | null;
  message?: string | null;
}

export interface RentiqeCheckoutParticipant {
  fullName: string;
  taxNumber: string;
  isInitiator: boolean;
}

export interface RentiqeCreateOrderPayload {
  cartId: string;
  guestEmail?: string;
  vatNumber?: string;
  companyName?: string;
  billingLocation: RentiqeCheckoutAddress;
}

export interface RentiqeCreateOrderResponse {
  id: string;
  orderNumber: string;
  storeSlug: string | null;
}

export interface RentiqeDeleteOrderPayload {
  cartId: string;
}

export interface RentiqeDeleteOrderResponse {
  ok: boolean;
}

export interface RentiqeCartItemListingImage {
  url: string;
  alt: string | null;
  width: number;
  height: number;
}

export interface RentiqeCartItemListingStore {
  id: string;
  name: string;
  image: string | null;
  slug: string;
}

export interface RentiqeCartItemListing {
  id: string;
  name: string;
  price: number;
  url: string;
  periodDiscounts: PeriodDiscounts | null;
  unit: RentiqeUnit;
  minimalPeriod: number;
  changedPriceAt: ChangedPriceAt | null;
  depositType: "none" | "booking_amount" | "products_value" | "fixed_amount";
  depositPrice: number | null;
  billingPeriod: RentiqeBillingPeriod;
  notAvailableAt: string[] | null;
  maxDeliveryDistance: number | null;
  advanceNotice: number;
  type: RentiqeType;
  value: number;
  deliveryDistances: DeliveryDistances | null;
  delivery: boolean;
  installation: boolean;
  installationPrice: number | null;
  addons: ListingAddons | null;
  image: RentiqeCartItemListingImage;
  store: RentiqeCartItemListingStore;
}

export interface RentiqeCartItem {
  total: number;
  depositTotal: number;
  id: string;
  quantity: number;
  startDate: string;
  endDate: string;
  delivery: boolean;
  cartEventId: string | null;
  installation: boolean;
  addons: string[] | null;
  warehouseId: string;
  availableQuantity: number;
  lat: number;
  lng: number;
  address: string;
  listing: RentiqeCartItemListing;
}

export interface RentiqeCartEvent {
  id: string;
  startDate: string;
  endDate: string;
  quantity: number;
  eventId: string | null;
  name: string;
  slug: string;
  image: string | null;
}

export interface RentiqeCartLocation {
  id: string;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  state: string | null;
  postal: string;
  country: string;
  lat: number;
  lng: number;
}

export type PeriodDiscounts = Record<string, unknown>;
export type ChangedPriceAt = Record<string, unknown>;
export type DeliveryDistances = Record<string, unknown>;
export type ListingAddons = Record<string, unknown>;

export interface DeliveryStore {
  id: string;
  image: string | null;
  name: string;
  address: string;
  slug: string;
}

export interface Delivery {
  cartItems: string[];
  store: DeliveryStore;
  warehouseId: string;
  date: string;
}

export interface RentiqeCartResponse {
  location: RentiqeCartLocation | null;
  billingLocation: RentiqeCartLocation | null;
  id: string;
  storeId: string | null;
  stripePaymentIntentId: string | null;
  currency: string;
  items: RentiqeCartItem[];
  itemsTotal: number;
  depositsTotal: number;
  deliveriesTotal: number;
  total: number;
  events: RentiqeCartEvent[];
  deliveries: Delivery[];
  returnDeliveries: Delivery[];
}

export interface RentiqeCartAddItemPayload {
  cartId: string;
  listingId: string;
  warehouseId: string;
  quantity: number;
  startDate?: string;
  endDate?: string;
  participants?: RentiqeCheckoutParticipant[];
  delivery?: boolean;
  installation?: boolean;
  addons?: string[];
  cartEventId?: string;
  eventId?: string;
}

export interface RentiqeCartAddItemResponse {
  cartEventId: string | null;
  cartEventCreated: boolean;
}

export interface RentiqeCartUpdateItemPayload {
  cartId: string;
  warehouseId?: string;
  quantity?: number;
  startDate?: string;
  endDate?: string;
  delivery?: boolean;
  installation?: boolean;
  addons?: string[];
}

export interface RentiqeCartPaymentIntentPayload {
  cartId: string;
}

export interface RentiqeCartPaymentIntentResponse {
  clientSecret: string;
  customerSessionClientSecret?: string;
}
