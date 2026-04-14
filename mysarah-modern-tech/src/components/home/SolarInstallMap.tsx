"use client";

import { CircleMarker, MapContainer, Popup, TileLayer } from "react-leaflet";
import { useTranslation } from "react-i18next";
import type { SolarInsights } from "@/types/lead";

interface SolarInstallMapProps {
  locations: SolarInsights["locations"];
}

const defaultCenter: [number, number] = [22.9734, 78.6569];

export default function SolarInstallMap({ locations }: SolarInstallMapProps) {
  const { t } = useTranslation();
  const plotted = locations.filter((location) => location.latitude !== null && location.longitude !== null);

  return (
    <MapContainer center={defaultCenter} zoom={4} scrollWheelZoom={false} className="insights-leaflet-map">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {plotted.map((location) => {
        const radius = 8 + Math.min(location.count * 2, 16);
        return (
          <CircleMarker
            key={location.name}
            center={[location.latitude as number, location.longitude as number]}
            radius={radius}
            pathOptions={{
              color: "#145f34",
              fillColor: "#2f9555",
              fillOpacity: 0.65,
              weight: 2,
            }}
          >
            <Popup>
              <strong>{location.name}</strong>
              <br />
              {location.count} {t("installs")}
            </Popup>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
}
