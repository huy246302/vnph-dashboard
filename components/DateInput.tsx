"use client";

import { useState } from "react";
import { isValidDisplayDate } from "@/lib/date-helpers";

type Props = {
  name: string;
  value: string;            // dd/mm/yyyy or empty
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  required?: boolean;
};

/**
 * A text input that displays and accepts dates strictly in dd/mm/yyyy
 * format, auto-inserting "/" as the user types. Use this anywhere a
 * date needs to be entered — never use <input type="date"> directly,
 * since its format is locale-dependent and can't be forced to dd/mm/yyyy.
 */
export default function DateInput({
  name, value, onChange, placeholder = "dd/mm/yyyy", className, required,
}: Props) {
  const [touched, setTouched] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 8);

    let formatted = raw;
    if (raw.length > 4) {
      formatted = `${raw.slice(0, 2)}/${raw.slice(2, 4)}/${raw.slice(4)}`;
    } else if (raw.length > 2) {
      formatted = `${raw.slice(0, 2)}/${raw.slice(2)}`;
    }

    onChange(formatted);
  }

  const showError = touched && value.length === 10 && !isValidDisplayDate(value);

  return (
    <div>
      <input
        type="text"
        name={name}
        inputMode="numeric"
        value={value}
        onChange={handleChange}
        onBlur={() => setTouched(true)}
        placeholder={placeholder}
        required={required}
        maxLength={10}
        className={className}
      />
      {showError && (
        <p className="text-xs text-red-500 mt-1">Enter a valid date as dd/mm/yyyy</p>
      )}
    </div>
  );
}