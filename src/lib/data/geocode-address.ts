export type GeocodeResult = {
  lat: number | null;
  lng: number | null;
  error?: string;
};

export async function geocodeAddress(
  query: string,
  signal: AbortSignal,
): Promise<GeocodeResult> {
  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("format", "json");
  url.searchParams.set("q", query);
  url.searchParams.set("addressdetails", "0");
  url.searchParams.set("limit", "1");

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
    signal,
  });

  if (!response.ok) {
    return {
      lat: null,
      lng: null,
      error: "Došlo je do greške prilikom dohvaćanja lokacije.",
    };
  }

  const data = (await response.json()) as Array<{
    lat?: string;
    lon?: string;
  }>;

  const first = data[0];
  if (!first?.lat || !first?.lon) {
    return { lat: null, lng: null, error: "Lokacija nije pronađena." };
  }

  const lat = Number(first.lat);
  const lng = Number(first.lon);

  if (Number.isNaN(lat) || Number.isNaN(lng)) {
    return { lat: null, lng: null, error: "Nije moguće odrediti lokaciju." };
  }

  return { lat, lng };
}
