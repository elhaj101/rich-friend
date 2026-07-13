"use client";

import { Suspense, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/LanguageContext";
import * as api from "@/lib/api";
import { DESTINATIONS } from "@/lib/types";
import PageHeading from "@/components/dashboard/PageHeading";
import { Field, TextArea, SelectField } from "@/components/dashboard/Field";
import PhotoUpload from "@/components/dashboard/PhotoUpload";

function NewOrderForm() {
  const { t } = useLanguage();
  const router = useRouter();
  const params = useSearchParams();

  const [itemName, setItemName] = useState(params.get("item") ?? "");
  const [brand, setBrand] = useState(params.get("brand") ?? "");
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [budget, setBudget] = useState("");
  const [destinationCountry, setDestination] = useState<string>(DESTINATIONS[0]);
  const [notes, setNotes] = useState(params.get("note") ?? "");
  const [photo, setPhoto] = useState<string | undefined>();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!itemName.trim() || !brand.trim() || !destinationCountry) {
      setError(t.dashOrderErrRequired);
      return;
    }
    setSubmitting(true);
    try {
      await api.createOrder({
        itemName: itemName.trim(),
        brand: brand.trim(),
        size: size.trim() || undefined,
        color: color.trim() || undefined,
        budget: budget.trim() || undefined,
        destinationCountry,
        notes: notes.trim() || undefined,
        referencePhoto: photo,
      });
      router.push("/dashboard/orders");
      router.refresh();
    } catch {
      setError(t.authErrGeneric);
      setSubmitting(false);
    }
  }

  return (
    <>
      <PageHeading title={t.dashNewOrderTitle} sub={t.dashNewOrderSub} />

      <motion.form
        onSubmit={onSubmit}
        noValidate
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-[620px]"
      >
        {error && (
          <div
            role="alert"
            className="mb-6 border px-4 py-3 font-sans text-[13px]"
            style={{
              borderColor: "rgba(192,57,43,0.35)",
              background: "rgba(192,57,43,0.06)",
              color: "#C0392B",
            }}
          >
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field
            label={t.dashFieldItem}
            placeholder={t.dashFieldItemPh}
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
          />
          <Field
            label={t.dashFieldBrand}
            placeholder={t.dashFieldBrandPh}
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
          />
          <Field
            label={t.dashFieldSize}
            hint={t.dashOptional}
            placeholder={t.dashFieldSizePh}
            value={size}
            onChange={(e) => setSize(e.target.value)}
          />
          <Field
            label={t.dashFieldColor}
            hint={t.dashOptional}
            placeholder={t.dashFieldColorPh}
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />
          <Field
            label={t.dashFieldBudget}
            hint={t.dashOptional}
            placeholder={t.dashFieldBudgetPh}
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
          />
          <SelectField
            label={t.dashFieldDest}
            value={destinationCountry}
            onChange={(e) => setDestination(e.target.value)}
          >
            {DESTINATIONS.map((d, i) => (
              <option key={d} value={d}>
                {t.dashDestinations[i]}
              </option>
            ))}
          </SelectField>
        </div>

        <div className="mt-5">
          <TextArea
            label={t.dashFieldNotes}
            hint={t.dashOptional}
            placeholder={t.dashFieldNotesPh}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <div className="mt-5">
          <PhotoUpload
            label={`${t.dashFieldPhoto} · ${t.dashOptional}`}
            value={photo}
            onChange={setPhoto}
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="mt-8 bg-charcoal text-ivory font-sans font-semibold text-[12px] tracking-[0.08em] px-8 py-3.5 hover:bg-charcoal/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitting ? t.dashSubmitting : t.dashSubmitOrder}
        </button>
      </motion.form>
    </>
  );
}

export default function NewOrderPage() {
  return (
    <Suspense fallback={null}>
      <NewOrderForm />
    </Suspense>
  );
}
