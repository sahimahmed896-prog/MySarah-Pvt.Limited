import { Schema, model, models } from "mongoose";

const SolarCounterSchema = new Schema(
  {
    scope: { type: String, required: true, unique: true, default: "global" },
    installedTotal: { type: Number, required: true, default: 1200 },
    visitConfirmedTotal: { type: Number, required: true, default: 1200 },
  },
  {
    timestamps: true,
  },
);

SolarCounterSchema.index({ scope: 1 }, { unique: true });

export const SolarCounter = models.SolarCounter || model("SolarCounter", SolarCounterSchema);
