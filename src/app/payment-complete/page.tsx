import Stripe from "stripe";

export const dynamic = "force-dynamic";

type PaymentCompletePageProps = {
  searchParams?: Promise<{
    payment_intent?: string;
    mock?: string;
  }>;
};

type StatusDisplay = {
  tone: "success" | "pending" | "error";
  title: string;
  description: string;
};

function getStatusDisplay(status: Stripe.PaymentIntent.Status): StatusDisplay {
  if (status === "succeeded") {
    return {
      tone: "success",
      title: "Plaćanje uspješno",
      description: "Vaša uplata je evidentirana i narudžba je potvrđena.",
    };
  }

  if (status === "processing" || status === "requires_capture") {
    return {
      tone: "pending",
      title: "Plaćanje je u obradi",
      description:
        "Transakcija je zaprimljena i trenutno se obrađuje. Status će biti ažuriran uskoro.",
    };
  }

  return {
    tone: "error",
    title: "Plaćanje nije dovršeno",
    description:
      "Plaćanje trenutno nije uspješno potvrđeno. Pokušajte ponovno ili koristite drugu karticu.",
  };
}

function StatusIcon({ tone }: { tone: StatusDisplay["tone"] }) {
  if (tone === "success") {
    return (
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-700">
        <svg
          viewBox="0 0 24 24"
          className="h-7 w-7"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M20 6 9 17l-5-5" />
        </svg>
      </div>
    );
  }

  if (tone === "pending") {
    return (
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-amber-700">
        <svg
          viewBox="0 0 24 24"
          className="h-7 w-7"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </svg>
      </div>
    );
  }

  return (
    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-700">
      <svg
        viewBox="0 0 24 24"
        className="h-7 w-7"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="m15 9-6 6" />
        <path d="m9 9 6 6" />
      </svg>
    </div>
  );
}

export default async function PaymentCompletePage({
  searchParams,
}: PaymentCompletePageProps) {
  const params = await searchParams;
  const paymentIntentId = params?.payment_intent;
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

  if (!paymentIntentId) {
    return (
      <main className="mx-auto min-h-screen max-w-2xl px-4 py-20 md:px-6">
        <section className="rounded-xl border border-red-200 bg-red-50 p-8 text-center">
          <div className="mx-auto mb-4 flex w-fit justify-center">
            <StatusIcon tone="error" />
          </div>
          <h1 className="text-2xl font-bold text-neutral-900">
            Nedostaje identifikator plaćanja
          </h1>
          <p className="mt-2 text-sm text-neutral-700">
            Nije moguće provjeriti status transakcije bez parametra
            {" `payment_intent`"}.
          </p>
        </section>
      </main>
    );
  }

  if (!stripeSecretKey) {
    return (
      <main className="mx-auto min-h-screen max-w-2xl px-4 py-20 md:px-6">
        <section className="rounded-xl border border-red-200 bg-red-50 p-8 text-center">
          <div className="mx-auto mb-4 flex w-fit justify-center">
            <StatusIcon tone="error" />
          </div>
          <h1 className="text-2xl font-bold text-neutral-900">
            Neispravna konfiguracija
          </h1>
          <p className="mt-2 text-sm text-neutral-700">
            Stripe konfiguracija nije dostupna.
          </p>
        </section>
      </main>
    );
  }

  let display: StatusDisplay;

  try {
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2025-12-15.clover",
    });
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    display = getStatusDisplay(paymentIntent.status);
  } catch {
    display = {
      tone: "error",
      title: "Nije moguće dohvatiti status plaćanja",
      description:
        "Došlo je do pogreške prilikom provjere transakcije. Pokušajte ponovno kasnije.",
    };
  }

  return (
    <main className="mx-auto min-h-screen max-w-2xl px-4 py-20 md:px-6">
      <section className="rounded-xl border border-neutral-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex w-fit justify-center">
          <StatusIcon tone={display.tone} />
        </div>
        <h1 className="text-3xl font-bold text-neutral-900">{display.title}</h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-neutral-600">
          {display.description}
        </p>
      </section>
    </main>
  );
}
