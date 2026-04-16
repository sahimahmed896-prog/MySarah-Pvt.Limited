"use client";

import { FormEvent, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import StatusPopup from "@/components/shared/StatusPopup";

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

type UploadDocumentKey =
  | "aadhaarCard"
  | "panCard"
  | "electricityBill"
  | "bankPassbook"
  | "jamaBandiCertificate"
  | "gpsPhoto"
  | "signature"
  | "passportSizePhotos";

interface UploadedDocument {
  label: string;
  url: string;
  fileName: string;
  publicId: string;
}

interface ChecklistItem {
  key: UploadDocumentKey;
  label: string;
  helper: string;
  acceptedFiles: string;
  requiredCount: number;
  multiple?: boolean;
}

const documentChecklist: Array<ChecklistItem | { key: "contactNumber" | "emailId"; label: string; helper: string; kind: "captured" }> = [
  {
    key: "aadhaarCard",
    label: "Aadhaar Card",
    helper: "Upload a clear front-side scan/photo or PDF.",
    acceptedFiles: "image/*,application/pdf",
    requiredCount: 1,
  },
  {
    key: "panCard",
    label: "PAN Card",
    helper: "Upload a readable image or PDF copy of the PAN card.",
    acceptedFiles: "image/*,application/pdf",
    requiredCount: 1,
  },
  {
    key: "electricityBill",
    label: "Latest Electricity Bill",
    helper: "Upload the most recent bill image or PDF.",
    acceptedFiles: "image/*,application/pdf",
    requiredCount: 1,
  },
  {
    key: "bankPassbook",
    label: "Bank Passbook",
    helper: "Upload the front page as an image or PDF.",
    acceptedFiles: "image/*,application/pdf",
    requiredCount: 1,
  },
  {
    key: "jamaBandiCertificate",
    label: "Jama Bandi / Khajna Receipt / Gaon Bura Certificate",
    helper: "Upload any one ownership/site verification image or PDF.",
    acceptedFiles: "image/*,application/pdf",
    requiredCount: 1,
  },
  {
    key: "gpsPhoto",
    label: "GPS Photo (Solar Installation Area)",
    helper: "Upload a photo that shows the installation area clearly.",
    acceptedFiles: "image/*",
    requiredCount: 1,
  },
  {
    key: "signature",
    label: "Signature",
    helper: "Upload a clean signature image on plain paper.",
    acceptedFiles: "image/*",
    requiredCount: 1,
  },
  {
    key: "contactNumber",
    label: "Contact Number (with registered Aadhaar and electricity bill phone number)",
    helper: "Captured in the phone field above.",
    kind: "captured",
  },
  {
    key: "emailId",
    label: "E-mail ID",
    helper: "Captured in the email field above.",
    kind: "captured",
  },
  {
    key: "passportSizePhotos",
    label: "2 Copy Passport Size Photo",
    helper: "Upload two recent passport-size photos.",
    acceptedFiles: "image/*",
    requiredCount: 2,
    multiple: true,
  },
];

const uploadItems = documentChecklist.filter((item): item is ChecklistItem => item.key !== "contactNumber" && item.key !== "emailId");

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

function createEmptyUploads() {
  return uploadItems.reduce<Record<UploadDocumentKey, UploadedDocument[]>>((accumulator, item) => {
    accumulator[item.key] = [];
    return accumulator;
  }, {} as Record<UploadDocumentKey, UploadedDocument[]>);
}

async function uploadToCloudinary(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  let response: Response;
  try {
    response = await fetch("/api/uploads/cloudinary", {
      method: "POST",
      body: formData,
    });
  } catch {
    throw new Error("Unable to reach upload service. Check internet/VPN/firewall and try again.");
  }

  const data = (await response.json().catch(() => null)) as
    | { error?: string; url?: string; publicId?: string; fileName?: string }
    | null;

  if (!response.ok) {
    throw new Error(data?.error || "Unable to upload document right now.");
  }

  if (!data?.url || !data.publicId) {
    throw new Error("Cloudinary did not return a secure file URL.");
  }

  return {
    label: file.name,
    url: data.url,
    fileName: data.fileName || file.name,
    publicId: data.publicId,
  } satisfies UploadedDocument;
}

export default function SolarApplicationForm() {
  const { t } = useTranslation();
  const [form, setForm] = useState<SolarFormData>(initialForm);
  const [loading, setLoading] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsStatus, setGpsStatus] = useState("");
  const [notice, setNotice] = useState<{ message: string; tone: "success" | "error" } | null>(null);
  const [uploads, setUploads] = useState<Record<UploadDocumentKey, UploadedDocument[]>>(createEmptyUploads);
  const [uploadingDocument, setUploadingDocument] = useState<UploadDocumentKey | null>(null);
  const [documentErrors, setDocumentErrors] = useState<Partial<Record<UploadDocumentKey, string>>>({});

  const isDisabled = useMemo(() => {
    const requiredUploadsComplete = uploadItems.every((item) => uploads[item.key].length >= item.requiredCount);

    return (
      !form.firstName ||
      !form.lastName ||
      !form.phone ||
      !form.addressLine ||
      !form.city ||
      !form.pincode ||
      !requiredUploadsComplete ||
      Boolean(uploadingDocument) ||
      loading
    );
  }, [form, loading, uploadingDocument, uploads]);

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

    if (!window.isSecureContext) {
      setGpsStatus(t("GPS requires HTTPS (or localhost). Open this site on localhost or secure HTTPS URL to enable location."));
      return;
    }

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
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          setGpsStatus(t("Location access is blocked. Allow location permission for this site and retry."));
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          setGpsStatus(t("Location is currently unavailable. Try moving to an open area and retry."));
        } else if (error.code === error.TIMEOUT) {
          setGpsStatus(t("GPS request timed out. Please try again."));
        } else {
          setGpsStatus(t("Unable to fetch GPS. Please allow location permission and try again."));
        }
        setGpsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 },
    );
  }

  async function handleDocumentUpload(key: UploadDocumentKey, files: FileList | null) {
    if (!files || files.length === 0) {
      return;
    }

    const item = uploadItems.find((entry) => entry.key === key);
    if (!item) {
      return;
    }

    setNotice(null);
    setDocumentErrors((previous) => ({ ...previous, [key]: "" }));
    setUploadingDocument(key);

    try {
      const existingCount = uploads[key].length;
      const remainingSlots = Math.max(item.requiredCount - existingCount, 0);
      const selectedFiles = Array.from(files).slice(0, remainingSlots || item.requiredCount);

      if (selectedFiles.length === 0) {
        setDocumentErrors((previous) => ({
          ...previous,
          [key]: `Maximum ${item.requiredCount} file(s) allowed for this document.`,
        }));
        return;
      }

      const uploadedFiles = await Promise.all(selectedFiles.map((file) => uploadToCloudinary(file)));

      setUploads((previous) => ({
        ...previous,
        [key]: [...previous[key], ...uploadedFiles].slice(0, item.requiredCount),
      }));
    } catch (error) {
      setDocumentErrors((previous) => ({
        ...previous,
        [key]: error instanceof Error ? error.message : t("Unable to upload document right now."),
      }));
    } finally {
      setUploadingDocument(null);
    }
  }

  function removeUploadedDocument(key: UploadDocumentKey, index: number) {
    setUploads((previous) => ({
      ...previous,
      [key]: previous[key].filter((_, currentIndex) => currentIndex !== index),
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice(null);
    setLoading(true);

    const attachments = uploadItems.flatMap((item) =>
      uploads[item.key].map((uploadedFile) => ({
        label: item.label,
        url: uploadedFile.url,
        fileName: uploadedFile.fileName,
        publicId: uploadedFile.publicId,
      })),
    );

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
        "Required Documents:",
        ...documentChecklist.map((item) => {
          if ("kind" in item && item.kind === "captured") {
            return `${item.label}: ${t("Captured above")}`;
          }

          const uploadedCount = uploads[item.key].length;
          return `${item.label}: ${uploadedCount}/${item.requiredCount} uploaded`;
        }),
        `${t("Notes")}: ${form.notes || t("None")}`,
      ].join("\n"),
      attachments,
    };

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        const fieldMessages = data.fieldErrors ? Object.values(data.fieldErrors).flat().join(" ") : "";
        setNotice({
          message: [data.error || t("Unable to submit the application right now."), fieldMessages].filter(Boolean).join(" "),
          tone: "error",
        });
      } else {
        setNotice({ message: t("Application submitted successfully. Our team will review and contact you."), tone: "success" });
        setForm(initialForm);
        setUploads(createEmptyUploads());
        setDocumentErrors({});
        setGpsStatus("");
      }
    } catch {
      setNotice({ message: t("Network issue while submitting. Please try again."), tone: "error" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <article className="solar-form-shell">
      {notice ? <StatusPopup message={notice.message} tone={notice.tone} onClose={() => setNotice(null)} /> : null}
      <div className="solar-form-topbar">
        <div>
          <p className="solar-form-kicker">{t("Digital Intake")}</p>
          <h3>{t("Solar Installation Application")}</h3>
        </div>
        <span className="solar-form-badge">{t("Cloudinary-backed uploads")}</span>
      </div>

      <form className="solar-form" onSubmit={handleSubmit}>
        <label>
          {t("First Name")}
          <input
            type="text"
            value={form.firstName}
            onChange={(event) => setForm((previous) => ({ ...previous, firstName: event.target.value }))}
            placeholder={t("Your given name")}
            minLength={2}
            maxLength={40}
            required
            autoComplete="given-name"
          />
        </label>

        <label>
          {t("Last Name")}
          <input
            type="text"
            value={form.lastName}
            onChange={(event) => setForm((previous) => ({ ...previous, lastName: event.target.value }))}
            placeholder={t("Your surname")}
            minLength={2}
            maxLength={40}
            required
            autoComplete="family-name"
          />
        </label>

        <label>
          {t("Phone Number")}
          <input
            type="tel"
            value={form.phone}
            onChange={(event) => setForm((previous) => ({ ...previous, phone: event.target.value }))}
            placeholder={t("10-digit mobile number")}
            minLength={7}
            maxLength={20}
            pattern="[0-9+\- ()]{7,20}"
            required
            autoComplete="tel"
          />
        </label>

        <label>
          {t("Email")}
          <input
            type="email"
            value={form.email}
            onChange={(event) => setForm((previous) => ({ ...previous, email: event.target.value }))}
            placeholder={t("yourname@example.com")}
            autoComplete="email"
          />
        </label>

        <label className="solar-form-col-2">
          {t("Address")}
          <input
            type="text"
            value={form.addressLine}
            onChange={(event) => setForm((previous) => ({ ...previous, addressLine: event.target.value }))}
            placeholder={t("Street address or building name")}
            minLength={2}
            maxLength={120}
            required
            autoComplete="street-address"
          />
        </label>

        <label>
          {t("City")}
          <input
            type="text"
            value={form.city}
            onChange={(event) => setForm((previous) => ({ ...previous, city: event.target.value }))}
            placeholder={t("City or town")}
            minLength={2}
            maxLength={80}
            required
            autoComplete="address-level2"
          />
        </label>

        <label>
          {t("State")}
          <input
            type="text"
            value={form.state}
            onChange={(event) => setForm((previous) => ({ ...previous, state: event.target.value }))}
            placeholder={t("State or province")}
            minLength={2}
            maxLength={80}
            autoComplete="address-level1"
          />
        </label>

        <label>
          {t("Pincode")}
          <input
            type="text"
            value={form.pincode}
            onChange={(event) => setForm((previous) => ({ ...previous, pincode: event.target.value }))}
            placeholder={t("6-digit postal code")}
            minLength={4}
            maxLength={10}
            required
            autoComplete="postal-code"
          />
        </label>

        <label>
          {t("Property Type")}
          <select
            value={form.propertyType}
            onChange={(event) =>
              setForm((previous) => ({
                ...previous,
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
              setForm((previous) => ({
                ...previous,
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
            max="999999"
            value={form.monthlyBill}
            onChange={(event) => setForm((previous) => ({ ...previous, monthlyBill: event.target.value }))}
            placeholder={t("e.g. 4500")}
          />
        </label>

        <label>
          {t("Sanctioned Load (kW)")}
          <input
            type="number"
            min="0"
            step="0.1"
            max="999999"
            value={form.sanctionedLoad}
            onChange={(event) => setForm((previous) => ({ ...previous, sanctionedLoad: event.target.value }))}
            placeholder={t("e.g. 5")}
          />
        </label>

        <label>
          {t("Preferred System Size (kW)")}
          <input
            type="number"
            min="0"
            step="0.1"
            max="999999"
            value={form.desiredCapacity}
            onChange={(event) => setForm((previous) => ({ ...previous, desiredCapacity: event.target.value }))}
            placeholder={t("e.g. 3")}
          />
        </label>

        <label>
          {t("Installation Timeline")}
          <select
            value={form.timeline}
            onChange={(event) =>
              setForm((previous) => ({
                ...previous,
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

        <section className="solar-document-section solar-form-col-2">
          <div className="solar-document-head">
            <div>
              <p className="solar-document-kicker">{t("Required documents")}</p>
              <h4>{t("Upload the documents listed for the solar application")}</h4>
            </div>
            <span className="solar-document-note">{t("Saved securely in Cloudinary")}</span>
          </div>

          <div className="solar-document-grid">
            {documentChecklist.map((item) => {
              if ("kind" in item && item.kind === "captured") {
                return (
                  <article key={item.key} className="solar-document-card solar-document-card-captured">
                    <div className="solar-document-card-head">
                      <div>
                        <h5>{t(item.label)}</h5>
                        <p>{t(item.helper)}</p>
                      </div>
                      <span className="solar-document-badge">{t("Captured")}</span>
                    </div>
                  </article>
                );
              }

              const uploaded = uploads[item.key] || [];
              const countLabel = `${uploaded.length}/${item.requiredCount}`;

              return (
                <article key={item.key} className="solar-document-card">
                  <div className="solar-document-card-head">
                    <div>
                      <h5>{t(item.label)}</h5>
                      <p>{t(item.helper)}</p>
                    </div>
                    <span className={`solar-document-badge ${uploaded.length >= item.requiredCount ? "is-complete" : ""}`}>
                      {countLabel}
                    </span>
                  </div>

                  <input
                    type="file"
                    accept={item.acceptedFiles}
                    multiple={item.multiple}
                    onChange={(event) => {
                      void handleDocumentUpload(item.key, event.currentTarget.files);
                      event.currentTarget.value = "";
                    }}
                  />

                  <div className="solar-document-meta">
                    <span>{uploadingDocument === item.key ? t("Uploading to Cloudinary...") : t("Images and PDF scans are stored as secure URLs.")}</span>
                    {documentErrors[item.key] ? <span className="solar-document-error">{documentErrors[item.key]}</span> : null}
                  </div>

                  {uploaded.length > 0 ? (
                    <ul className="solar-document-files">
                      {uploaded.map((file, index) => (
                        <li key={`${file.publicId}-${index}`}>
                          <span>{file.fileName}</span>
                          <button type="button" className="solar-document-remove" onClick={() => removeUploadedDocument(item.key, index)}>
                            {t("Remove")}
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </article>
              );
            })}
          </div>
        </section>

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
                onChange={(event) => setForm((previous) => ({ ...previous, latitude: event.target.value }))}
                placeholder={t("e.g. 26.144516")}
              />
            </label>
            <label>
              {t("Longitude")}
              <input
                type="text"
                value={form.longitude}
                onChange={(event) => setForm((previous) => ({ ...previous, longitude: event.target.value }))}
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
            onChange={(event) => setForm((previous) => ({ ...previous, notes: event.target.value }))}
            placeholder={t("Any roof condition, shading, access notes, or preferred call time")}
            maxLength={1200}
          />
        </label>

        <div className="solar-submit-row solar-form-col-2">
          <p className="solar-submit-helper">
            {t("Please verify that your contact number and email match the uploaded identity and utility documents.")}
          </p>
          <button type="submit" className="button" disabled={isDisabled}>
            {loading ? t("Submitting Application...") : t("Submit Digital Application")}
          </button>
        </div>
      </form>
    </article>
  );
}