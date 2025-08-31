"use server";

import fetchApi from "../utils/api";

interface NewsletterResponse {
  success: boolean;
  message: string;
}

export async function contactEmail(
  _currentState: unknown,
  formData: FormData
): Promise<NewsletterResponse> {
  const name = formData.get("name") as string;
  const phone = formData.get("phone") as string;
  const message = formData.get("message") as string;
  const honeypot = formData.get("website") as string;

  if (honeypot) {
    return {
      success: true,
      message: "Poruka je uspješno poslana! Hvala Vam!",
    };
  }

  if (
    !name ||
    !phone ||
    !message ||
    typeof name !== "string" ||
    typeof phone !== "string" ||
    typeof message !== "string"
  ) {
    return { success: false, message: "Neispravan unos" };
  }

  try {
    await fetchApi("/contact/najam/submit", {
      method: "POST",
      body: JSON.stringify({ name, phone, message }),
    });

    return {
      success: true,
      message: "Poruka je uspješno poslana! Hvala Vam!",
    };
  } catch (error) {
    console.error("Error sending contact form:", error);
    return {
      success: false,
      message:
        "Došlo je do greške prilikom slanja poruke. Molimo pokušajte ponovno kasnije.",
    };
  }
}
