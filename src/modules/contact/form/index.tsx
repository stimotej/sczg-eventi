"use client";

import { contactEmail } from "@/lib/data/contact";
import { cn } from "@/lib/utils/cn";
import { useActionState } from "react";
import SubmitButton from "./submit-btn";

export default function ContactForm() {
  const [response, formAction] = useActionState(contactEmail, null);

  return (
    <>
      <form className="space-y-4" action={formAction}>
        {/* Honeypot field */}
        <div className="hidden" aria-hidden="true">
          <label htmlFor="website">Website (leave empty)</label>
          <input
            type="text"
            id="website"
            name="website"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="name" className="font-semibold text-neutral-800">
            Ime
          </label>
          <input
            type="text"
            id="name"
            name="name"
            autoComplete="name"
            className="mt-0.5 p-2 border border-neutral-300 transition-colors hover:border-neutral-800 focus:!border-(--primary) invalid:!border-red-500 outline-none"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="phone" className="font-semibold text-neutral-800">
            Broj telefona
          </label>
          <input
            id="phone"
            type="tel"
            name="phone"
            autoComplete="tel"
            className="mt-0.5 p-2 border border-neutral-300 transition-colors hover:border-neutral-800 focus:!border-(--primary) invalid:!border-red-500 outline-none"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="message" className="font-semibold text-neutral-800">
            Poruka
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            className="mt-0.5 p-2 border border-neutral-300 transition-colors hover:border-neutral-800 focus:!border-(--primary) invalid:!border-red-500 outline-none"
          />
        </div>
        <SubmitButton>Pošalji</SubmitButton>
      </form>

      {response && !!response.message && (
        <p
          className={cn(
            "mt-4",
            response.success ? "text-green-600" : "text-red-600"
          )}
        >
          {response.message}
        </p>
      )}
    </>
  );
}
