import { useState } from "react";
import { useLeases } from "@artsdiva/hooks/useLeases";
import { LeaseForm, type LeaseFormValues } from "@artsdiva/components/LeaseForm";

const emptyValues: LeaseFormValues = { clientId: "", startDate: "", terms: "" };

interface LeaseFormContainerProps {
  artworkId: string;
  onLeased: () => void;
  onCancel?: () => void;
}

export function LeaseFormContainer({ artworkId, onLeased, onCancel }: LeaseFormContainerProps) {
  const { isSubmitting, error, fieldErrors, createLease } = useLeases({ onMutate: onLeased });
  const [values, setValues] = useState<LeaseFormValues>(emptyValues);

  const handleChange = <K extends keyof LeaseFormValues>(field: K, value: LeaseFormValues[K]): void => {
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (): void => {
    void createLease({
      artworkId,
      clientId: values.clientId,
      startDate: values.startDate,
      terms: values.terms || undefined,
    }).then((lease) => {
      if (lease) setValues(emptyValues);
    });
  };

  return (
    <LeaseForm
      values={values}
      artworkId={artworkId}
      isSubmitting={isSubmitting}
      error={error}
      fieldErrors={fieldErrors}
      onChange={handleChange}
      onSubmit={handleSubmit}
      onCancel={onCancel}
    />
  );
}
