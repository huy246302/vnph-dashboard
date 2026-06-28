"use client";

import { useState, useEffect } from "react";
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
  const [localValue, setLocalValue] = useState(value);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    let raw = e.target.value.replace(/[^\d]/g, ""); // strip everything but digits
    if (raw.length > 8) raw = raw.slice(0, 8);

    let formatted = raw;
    if (raw.length > 4) {
      formatted = `${raw.slice(0, 2)}/${raw.slice(2, 4)}/${raw.slice(4)}`;
    } else if (raw.length > 2) {
      formatted = `${raw.slice(0, 2)}/${raw.slice(2)}`;
    }

    setLocalValue(formatted);
    onChange(formatted);
  }

  const showError = touched && localValue.length === 10 && !isValidDisplayDate(localValue);

  return (
    <div>
      <input
        type="text"
        name={name}
        inputMode="numeric"
        value={localValue}
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