"use client";

import { FormEvent, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { trackEvent } from "@/lib/analytics";
import StatusPopup from "@/components/shared/StatusPopup";

type LeadType = "quote" | "contact" | "order";

interface LeadFormProps {
  variant?: LeadType;
  title?: string;
}

interface FormData {
  name: string;
  phone: string;
  location: string;
  message: string;
}

function createIdempotencyKey() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

const initialForm: FormData = {
  name: "",
  phone: "",
  location: "",
  message: "",
};

export default function LeadForm({ variant, title }: LeadFormProps) {
  const { t } = useTranslation();
  const [form, setForm] = useState<FormData>({ ...initialForm });
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<{ message: string; tone: "success" | "error" } | null>(null);

  const formTitle = title || t("Get in touch");

  const disabled = useMemo(() => {
    return !form.name || !form.phone || !form.location || !form.message;
  }, [form]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setNotice(null);

    trackEvent("lead_form_submit_attempt", {
      lead_type: variant ?? "contact",
      form_name: "lead_form",
    });

    try {
      const idempotencyKey = createIdempotencyKey();

      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-idempotency-key": idempotencyKey,
        },
        body: JSON.stringify({
          ...form,
          ...(variant ? { type: variant } : {}),
        }),
      });

      const payload = await response.json();

      if (!response.ok) {
        trackEvent("lead_form_submit_failed", {
          lead_type: variant ?? "contact",
          form_name: "lead_form",
          status_code: response.status,
        });

        const fieldMessages = payload.fieldErrors ? Object.values(payload.fieldErrors).flat().join(" ") : "";
        setNotice({
          message: [payload.error || t("Unable to submit request."), fieldMessages].filter(Boolean).join(" "),
          tone: "error",
        });
      } else {
        trackEvent("lead_form_submit_success", {
          lead_type: variant ?? "contact",
          form_name: "lead_form",
        });

        setNotice({ message: t("Thank you. Our team will contact you shortly."), tone: "success" });
        setForm({ ...initialForm });
      }
    } catch {
      trackEvent("lead_form_submit_failed", {
        lead_type: variant ?? "contact",
        form_name: "lead_form",
        status_code: 0,
      });

      setNotice({ message: t("Network issue. Please try again."), tone: "error" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="lead-form-wrap">
      {notice ? <StatusPopup message={notice.message} tone={notice.tone} onClose={() => setNotice(null)} /> : null}
      <h3>{formTitle}</h3>
      <form className="lead-form" onSubmit={handleSubmit}>
        <label>
          {t("Name")}
          <input
            type="text"
            value={form.name}
            onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
            placeholder={t("Your full name")}
            minLength={2}
            maxLength={80}
            required
            autoComplete="name"
          />
        </label>

        <label>
          {t("Phone")}
          <input
            type="tel"
            value={form.phone}
            onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
            placeholder={t("10-digit mobile number")}
            minLength={7}
            maxLength={20}
            pattern="[0-9+\- ()]{7,20}"
            required
            autoComplete="tel"
          />
        </label>

        <label>
          {t("Location")}
          <input
            type="text"
            value={form.location}
            onChange={(event) => setForm((prev) => ({ ...prev, location: event.target.value }))}
            placeholder={t("City, District, or Address")}
            minLength={2}
            maxLength={120}
            required
            autoComplete="street-address"
          />
        </label>

        <label>
          {t("Message")}
          <textarea
            rows={4}
            value={form.message}
            onChange={(event) => setForm((prev) => ({ ...prev, message: event.target.value }))}
            placeholder={t("Tell us about your project...")}
            minLength={10}
            maxLength={1200}
            required
          />
        </label>

        <button type="submit" className="button" disabled={loading || disabled}>
          {loading ? t("Submitting...") : t("Submit")}
        </button>
      </form>
    </div>
  );
}
