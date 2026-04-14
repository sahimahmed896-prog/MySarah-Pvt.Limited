"use client";

import { FormEvent, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

interface SolarFormData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  addressLine: string;
  city: string;
  state: string;
  pincode: string;
  propertyType: "residential" | "commercial" | "industrial";
  roofType: "rcc" | "metal-sheet" | "tile" | "ground-mount";
  monthlyBill: string;
  sanctionedLoad: string;
  desiredCapacity: string;
  timeline: "urgent" | "30-days" | "60-days" | "planning";
  latitude: string;
  longitude: string;
  notes: string;
}

const initialForm: SolarFormData = {
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  addressLine: "",
  city: "",
  state: "Assam",
  pincode: "",
  propertyType: "residential",
  roofType: "rcc",
  monthlyBill: "",
  sanctionedLoad: "",
  desiredCapacity: "",
  timeline: "30-days",
  latitude: "",
  longitude: "",
  notes: "",
};

export default function SolarApplicationForm() {
  const { t } = useTranslation();
  const [form, setForm] = useState<SolarFormData>(initialForm);
  const [loading, setLoading] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsStatus, setGpsStatus] = useState("");
  const [result, setResult] = useState("");

  const isDisabled = useMemo(() => {
    return !form.firstName || !form.lastName || !form.phone || !form.addressLine || !form.city || !form.pincode;
  }, [form]);

  const addressForMaps = `${form.addressLine}, ${form.city}, ${form.state}, ${form.pincode}`.trim();

  function openMapPicker() {
    const hasCoordinates = form.latitude && form.longitude;
    const mapUrl = hasCoordinates
      ? `https://www.google.com/maps?q=${form.latitude},${form.longitude}`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addressForMaps)}`;

    window.open(mapUrl, "_blank", "noopener,noreferrer");
  }

  function handleUseCurrentLocation() {
    setGpsStatus("");

    if (!("geolocation" in navigator)) {
      setGpsStatus(t("GPS is not available in this browser."));
      return;
    }

    setGpsLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setForm((prev) => ({
          ...prev,
          latitude: position.coords.latitude.toFixed(6),
          longitude: position.coords.longitude.toFixed(6),
        }));
        setGpsStatus(t("GPS captured successfully."));
        setGpsLoading(false);
      },
      () => {
        setGpsStatus(t("Unable to fetch GPS. Please allow location permission and try again."));
        setGpsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 },
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setResult("");
    setLoading(true);

    const payload = {
      name: `${form.firstName} ${form.lastName}`.trim(),
      phone: form.phone,
      location: `${form.addressLine}, ${form.city}, ${form.state} ${form.pincode}${
        form.latitude && form.longitude ? ` | lat:${form.latitude} lng:${form.longitude}` : ""
      }`,
      type: "quote",
      message: [
        t("Solar Digital Application"),
        `Email: ${form.email || t("Not provided")}`,
        `${t("Property Type")}: ${form.propertyType}`,
        `${t("Roof Type")}: ${form.roofType}`,
        `${t("Monthly Bill")}: ${form.monthlyBill || t("Not provided")}`,
        `${t("Sanctioned Load")}: ${form.sanctionedLoad || t("Not provided")}`,
        `${t("Desired Capacity")}: ${form.desiredCapacity || t("Not provided")}`,
        `${t("Installation Timeline")}: ${form.timeline}`,
        `GPS: ${form.latitude && form.longitude ? `${form.latitude}, ${form.longitude}` : t("Not provided")}`,
        `${t("Notes")}: ${form.notes || t("None")}`,
      ].join("\n"),
    };

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        setResult(data.error || t("Unable to submit the application right now."));
      } else {
        setResult(t("Application submitted successfully. Our team will review and contact you."));
        setForm(initialForm);
        setGpsStatus("");
      }
    } catch {
      setResult(t("Network issue while submitting. Please try again."));
    } finally {
      setLoading(false);
    }
  }

  return (
    <article className="solar-form-shell">
      <div className="solar-form-topbar">
        <div>
          <p className="solar-form-kicker">{t("Digital Intake")}</p>
          <h3>{t("Solar Installation Application")}</h3>
        </div>
        <span className="solar-form-badge">{t("Structured and trackable")}</span>
      </div>

      <form className="solar-form" onSubmit={handleSubmit}>
        <label>
          {t("First Name")}
          <input
            type="text"
            value={form.firstName}
            onChange={(event) => setForm((prev) => ({ ...prev, firstName: event.target.value }))}
            placeholder={t("Your given name")}
            required
            autoComplete="given-name"
          />
        </label>

        <label>
          {t("Last Name")}
          <input
            type="text"
            value={form.lastName}
            onChange={(event) => setForm((prev) => ({ ...prev, lastName: event.target.value }))}
            placeholder={t("Your surname")}
            required
            autoComplete="family-name"
          />
        </label>

        <label>
          {t("Phone Number")}
          <input
            type="tel"
            value={form.phone}
            onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
            placeholder={t("10-digit mobile number")}
            required
            autoComplete="tel"
          />
        </label>

        <label>
          {t("Email")}
          <input
            type="email"
            value={form.email}
            onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
            placeholder={t("yourname@example.com")}
            autoComplete="email"
          />
        </label>

        <label className="solar-form-col-2">
          {t("Address")}
          <input
            type="text"
            value={form.addressLine}
            onChange={(event) => setForm((prev) => ({ ...prev, addressLine: event.target.value }))}
            placeholder={t("Street address or building name")}
            required
            autoComplete="street-address"
          />
        </label>

        <label>
          {t("City")}
          <input
            type="text"
            value={form.city}
            onChange={(event) => setForm((prev) => ({ ...prev, city: event.target.value }))}
            placeholder={t("City or town")}
            required
            autoComplete="address-level2"
          />
        </label>

        <label>
          {t("State")}
          <input
            type="text"
            value={form.state}
            onChange={(event) => setForm((prev) => ({ ...prev, state: event.target.value }))}
            placeholder={t("State or province")}
            autoComplete="address-level1"
          />
        </label>

        <label>
          {t("Pincode")}
          <input
            type="text"
            value={form.pincode}
            onChange={(event) => setForm((prev) => ({ ...prev, pincode: event.target.value }))}
            placeholder={t("6-digit postal code")}
            required
            autoComplete="postal-code"
          />
        </label>

        <label>
          {t("Property Type")}
          <select
            value={form.propertyType}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                propertyType: event.target.value as SolarFormData["propertyType"],
              }))
            }
          >
            <option value="residential">{t("Residential")}</option>
            <option value="commercial">{t("Commercial")}</option>
            <option value="industrial">{t("Industrial")}</option>
          </select>
        </label>

        <label>
          {t("Roof Type")}
          <select
            value={form.roofType}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                roofType: event.target.value as SolarFormData["roofType"],
              }))
            }
          >
            <option value="rcc">RCC</option>
            <option value="metal-sheet">{t("Metal Sheet")}</option>
            <option value="tile">{t("Tile")}</option>
            <option value="ground-mount">{t("Ground Mount")}</option>
          </select>
        </label>

        <label>
          {t("Monthly Electricity Bill (INR)")}
          <input
            type="number"
            min="0"
            value={form.monthlyBill}
            onChange={(event) => setForm((prev) => ({ ...prev, monthlyBill: event.target.value }))}
            placeholder={t("e.g. 4500")}
          />
        </label>

        <label>
          {t("Sanctioned Load (kW)")}
          <input
            type="number"
            min="0"
            step="0.1"
            value={form.sanctionedLoad}
            onChange={(event) => setForm((prev) => ({ ...prev, sanctionedLoad: event.target.value }))}
            placeholder={t("e.g. 5")}
          />
        </label>

        <label>
          {t("Preferred System Size (kW)")}
          <input
            type="number"
            min="0"
            step="0.1"
            value={form.desiredCapacity}
            onChange={(event) => setForm((prev) => ({ ...prev, desiredCapacity: event.target.value }))}
            placeholder={t("e.g. 3")}
          />
        </label>

        <label>
          {t("Installation Timeline")}
          <select
            value={form.timeline}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                timeline: event.target.value as SolarFormData["timeline"],
              }))
            }
          >
            <option value="urgent">{t("Urgent (Within 2 weeks)")}</option>
            <option value="30-days">{t("Within 30 days")}</option>
            <option value="60-days">{t("Within 60 days")}</option>
            <option value="planning">{t("Just exploring")}</option>
          </select>
        </label>

        <div className="solar-gps-card solar-form-col-2">
          <div className="solar-gps-head">
            <h4>{t("GPS Coordinates")}</h4>
            <div className="solar-gps-actions">
              <button type="button" className="button button-outline" onClick={handleUseCurrentLocation}>
                {gpsLoading ? t("Fetching GPS...") : t("Use Current GPS")}
              </button>
              <button type="button" className="button button-outline" onClick={openMapPicker}>
                {t("Open in Map")}
              </button>
            </div>
          </div>

          <div className="solar-gps-grid">
            <label>
              {t("Latitude")}
              <input
                type="text"
                value={form.latitude}
                onChange={(event) => setForm((prev) => ({ ...prev, latitude: event.target.value }))}
                placeholder={t("e.g. 26.144516")}
              />
            </label>
            <label>
              {t("Longitude")}
              <input
                type="text"
                value={form.longitude}
                onChange={(event) => setForm((prev) => ({ ...prev, longitude: event.target.value }))}
                placeholder={t("e.g. 91.736237")}
              />
            </label>
          </div>

          <p className="solar-gps-help">{t("Capture GPS for exact rooftop location and faster feasibility checks.")}</p>
          {gpsStatus ? <p className="solar-gps-status">{gpsStatus}</p> : null}
        </div>

        <label className="solar-form-col-2">
          {t("Site Notes")}
          <textarea
            rows={4}
            value={form.notes}
            onChange={(event) => setForm((prev) => ({ ...prev, notes: event.target.value }))}
            placeholder={t("Any roof condition, shading, access notes, or preferred call time")}
          />
        </label>

        <div className="solar-submit-row solar-form-col-2">
          <button type="submit" className="button" disabled={loading || isDisabled}>
            {loading ? t("Submitting Application...") : t("Submit Digital Application")}
          </button>
          {result ? <p className="form-feedback">{result}</p> : null}
        </div>
      </form>
    </article>
  );
}
