"use client";

import { useState, useRef, useEffect, useMemo } from "react";

type Props = {
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
  required?: boolean;
  className?: string;
};

/**
 * A type-to-filter searchable dropdown. Type a few letters to narrow
 * the list, click or press Enter to select. Built without an external
 * combobox library to keep the bundle lean.
 */
export default function SearchableSelect({
  name, value, onChange, options, placeholder = "Search...", required, className,
}: Props) {
  // `query` is only used while the dropdown is open and the user is
  // actively typing. When closed, the displayed text always reflects
  // `value` directly — no effect needed to keep them in sync.
  const [query, setQuery] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const displayValue = query ?? value;

  const filtered = useMemo(() => {
    if (!query) return options;
    const q = query.toLowerCase();
    return options.filter((opt) => opt.toLowerCase().includes(q));
  }, [query, options]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        // Discard any unmatched typed text — fall back to the real value.
        setQuery(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function selectOption(opt: string) {
    onChange(opt);
    setQuery(null); // collapse back to controlled value display
    setOpen(false);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open && (e.key === "ArrowDown" || e.key === "Enter")) {
      setOpen(true);
      return;
    }
    if (!open) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filtered[highlightIndex]) selectOption(filtered[highlightIndex]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div ref={containerRef} className="relative">
      {/* Hidden input carries the actual value into FormData on submit */}
      <input type="hidden" name={name} value={value} required={required} />
      <input
        type="text"
        value={displayValue}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
          setHighlightIndex(0);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={className}
        autoComplete="off"
      />
      {open && filtered.length > 0 && (
        <ul className="absolute z-20 mt-1 w-full max-h-56 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg py-1">
          {filtered.map((opt, i) => (
            <li
              key={opt}
              onMouseDown={(e) => {
                e.preventDefault(); // prevent input blur before click registers
                selectOption(opt);
              }}
              onMouseEnter={() => setHighlightIndex(i)}
              className={`px-3 py-1.5 text-sm cursor-pointer ${
                i === highlightIndex ? "bg-blue-50 text-blue-700" : "text-gray-700"
              } ${opt === value ? "font-medium" : ""}`}
            >
              {opt}
            </li>
          ))}
        </ul>
      )}
      {open && filtered.length === 0 && (
        <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg px-3 py-2 text-sm text-gray-400">
          No matches
        </div>
      )}
    </div>
  );
}