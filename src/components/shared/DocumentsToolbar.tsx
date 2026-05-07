import { useState, useRef, useEffect, ReactNode } from "react";
import { Search, ChevronDown } from "lucide-react";

export type SortOrder = "title-asc" | "title-desc" | "date-desc" | "date-asc";

interface DocumentsToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  searchPlaceholder?: string;
  sortOrder: SortOrder;
  onSortChange: (order: SortOrder) => void;
  actionButton?: ReactNode;
  extraFilters?: ReactNode;
}

export function DocumentsToolbar({
  searchQuery,
  onSearchChange,
  searchPlaceholder = "Cari dokumen...",
  sortOrder,
  onSortChange,
  actionButton,
  extraFilters,
}: DocumentsToolbarProps) {
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const sortDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sortDropdownRef.current &&
        !sortDropdownRef.current.contains(event.target as Node)
      ) {
        setSortDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 items-center gap-2 max-w-xl">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-body/40" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-9 w-full rounded-full border border-border bg-white pl-10 pr-3 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10"
          />
        </div>

        <div className="relative" ref={sortDropdownRef}>
          <button
            type="button"
            onClick={() => setSortDropdownOpen((open) => !open)}
            className="flex h-9 min-w-[120px] items-center justify-between gap-2.5 rounded-full border border-[#ececec] bg-white/95 px-3 text-left text-sm font-medium text-foreground shadow-[0_1px_0_0_rgba(0,0,0,0.02),0_6px_14px_rgba(24,44,106,0.05)] transition-all duration-150 hover:border-[#e6e6e6] hover:shadow-[0_1px_0_0_rgba(0,0,0,0.02),0_8px_16px_rgba(24,44,106,0.07)] focus:outline-none focus:ring-2 focus:ring-primary/10"
            aria-haspopup="listbox"
            aria-expanded={sortDropdownOpen}
          >
            <span className="truncate">
              {sortOrder === "title-asc" && "A - Z"}
              {sortOrder === "title-desc" && "Z - A"}
              {sortOrder === "date-desc" && "Terbaru"}
              {sortOrder === "date-asc" && "Terlama"}
            </span>
            <ChevronDown
              className={`h-3.5 w-3.5 shrink-0 text-body/35 transition-transform duration-150 ${
                sortDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {sortDropdownOpen && (
            <div className="absolute right-0 top-full z-20 mt-2 min-w-full overflow-hidden rounded-2xl border border-[#ececec] bg-white p-1 shadow-[0_14px_24px_rgba(24,44,106,0.1)]">
              {[
                { value: "title-asc", label: "A - Z" },
                { value: "title-desc", label: "Z - A" },
                { value: "date-desc", label: "Terbaru" },
                { value: "date-asc", label: "Terlama" },
              ].map((option) => {
                const isSelected = sortOrder === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      onSortChange(option.value as SortOrder);
                      setSortDropdownOpen(false);
                    }}
                    className={`flex w-full items-center rounded-xl px-3 py-2 text-left text-sm transition-colors duration-150 hover:bg-[#f5f8ff] ${
                      isSelected ? "bg-primary text-white hover:bg-primary" : "text-foreground"
                    }`}
                    role="option"
                    aria-selected={isSelected}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {extraFilters}
      </div>

      {actionButton}
    </div>
  );
}
