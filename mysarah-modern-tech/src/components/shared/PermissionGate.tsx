"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const LOCATION_PROMPT_KEY = "mysarah.permissions.location.prompted";
const LOCATION_GRANTED_KEY = "mysarah.permissions.location.granted";

export default function PermissionGate() {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [requesting, setRequesting] = useState(false);
  const [message, setMessage] = useState("");

  const syncPermissionState = useCallback(async () => {
    if (typeof window === "undefined" || !("geolocation" in navigator)) {
      return;
    }

    const granted = localStorage.getItem(LOCATION_GRANTED_KEY) === "1";
    if (granted) {
      setVisible(false);
      setMessage("");
      return;
    }

    let state: PermissionState | "unknown" = "unknown";

    try {
      if ("permissions" in navigator && navigator.permissions?.query) {
        const status = await navigator.permissions.query({ name: "geolocation" });
        state = status.state;
      }
    } catch {
      state = "unknown";
    }

    if (state === "granted") {
      localStorage.setItem(LOCATION_GRANTED_KEY, "1");
      setVisible(false);
      setMessage("");
      return;
    }

    if (state === "denied") {
      setVisible(true);
      setMessage(t("Location is blocked in browser settings. Enable location for this site and retry."));
      return;
    }

    const prompted = localStorage.getItem(LOCATION_PROMPT_KEY) === "1";
    if (!prompted) {
      setVisible(true);
    }
  }, [t]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    void syncPermissionState();

    const onFocus = () => {
      void syncPermissionState();
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        void syncPermissionState();
      }
    };

    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [syncPermissionState]);

  useEffect(() => {
    if (!("permissions" in navigator) || !navigator.permissions?.query) {
      return;
    }

    let cleanup: (() => void) | null = null;

    void navigator.permissions.query({ name: "geolocation" }).then((status) => {
      const handleChange = () => {
        void syncPermissionState();
      };

      status.addEventListener("change", handleChange);
      cleanup = () => status.removeEventListener("change", handleChange);
    }).catch(() => undefined);

    return () => {
      if (cleanup) {
        cleanup();
      }
    };
  }, [syncPermissionState]);

  function requestLocationPermission() {
    if (!("geolocation" in navigator)) {
      setMessage(t("GPS is not available in this browser."));
      return;
    }

    setRequesting(true);
    setMessage("");

    navigator.geolocation.getCurrentPosition(
      () => {
        localStorage.setItem(LOCATION_GRANTED_KEY, "1");
        localStorage.setItem(LOCATION_PROMPT_KEY, "1");
        setRequesting(false);
        setVisible(false);
        setMessage("");
      },
      (error) => {
        localStorage.setItem(LOCATION_PROMPT_KEY, "1");

        if (error.code === error.PERMISSION_DENIED) {
          setMessage(t("Location permission was denied. Please allow it in browser site settings."));
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          setMessage(t("Location is unavailable right now. Try again in a better signal area."));
        } else if (error.code === error.TIMEOUT) {
          setMessage(t("Location request timed out. Please try again."));
        } else {
          setMessage(t("Unable to fetch location at this time."));
        }

        setRequesting(false);
      },
      { enableHighAccuracy: false, timeout: 15000, maximumAge: 30000 },
    );
  }

  function dismissPrompt() {
    localStorage.setItem(LOCATION_PROMPT_KEY, "1");
    setVisible(false);
  }

  if (!visible) {
    return null;
  }

  return (
    <div className="permission-gate-overlay" role="dialog" aria-modal="true" aria-label={t("Required Permissions")}>
      <div className="permission-gate-card">
        <p className="permission-gate-kicker">{t("Required Permissions")}</p>
        <h3>{t("Allow location access for GPS capture")}</h3>
        <p>
          {t("We use location only to auto-fill rooftop GPS coordinates in the solar application form. You can still enter coordinates manually if needed.")}
        </p>

        {message ? <p className="permission-gate-message">{message}</p> : null}

        <div className="permission-gate-actions">
          <button type="button" className="button" onClick={requestLocationPermission} disabled={requesting}>
            {requesting ? t("Requesting permission...") : t("Allow Location")}
          </button>
          <button type="button" className="button button-outline" onClick={() => void syncPermissionState()}>
            {t("I have allowed, recheck")}
          </button>
          <button type="button" className="button button-outline" onClick={dismissPrompt}>
            {t("Not now")}
          </button>
        </div>
      </div>
    </div>
  );
}