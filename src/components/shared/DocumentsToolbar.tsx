import { useRef, useEffect, ReactNode, useState } from "react";
import { Search, ChevronDown } from "lucide-react";

export type SortOrder = "title-asc" | "title-desc" | "date-desc" | "date-asc";

const SORT_OPTIONS: { value: SortOrder; label: string }[] = [
  { value: "date-desc", label: "Terbaru" },
  { value: "date-asc", label: "Terlama" },
  { value: "title-asc", label: "A - Z" },
  { value: "title-desc", label: "Z - A" },
];

interface DocumentsToolbarProps {
  // Search
  searchQuery: string;
  onSearchChange: (query: string) => void;
  searchPlaceholder?: string;

  // Sort
  sortOrder?: SortOrder;
  onSortChange?: (order: SortOrder) => void;

  // Year Filter
  showYearFilter?: boolean;
  selectedYear?: string;
  availableYears?: number[];
  onYearChange?: (year: string) => void;
  yearAllLabel?: string;
  yearLabel?: (year: number) => string;

  // Actions & Extras
  actionButton?: ReactNode;
  extraFilters?: ReactNode;
}

export function DocumentsToolbar({
  searchQuery,
  onSearchChange,
  searchPlaceholder = "Cari dokumen...",
  
  sortOrder,
  onSortChange,

  showYearFilter = false,
  selectedYear = "all",
  availableYears = [],
  onYearChange,
  yearAllLabel = "Semua Tahun",
  yearLabel = (y) => `Tahun ${y}`,

  actionButton,
  extraFilters,
}: DocumentsToolbarProps) {
  
  // Sort Dropdown State
  const [sortOpen, setSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  // Year Filter Dropdown State
  const [yearOpen, setYearOpen] = useState(false);
  const yearRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setSortOpen(false);
      }
      if (yearRef.current && !yearRef.current.contains(event.target as Node)) {
        setYearOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentSortLabel = sortOrder 
    ? (SORT_OPTIONS.find((o) => o.value === sortOrder)?.label ?? "Terbaru")
    : "Terbaru";

  const yearOptions = [
    { value: "all", label: yearAllLabel },
    ...availableYears.map((y) => ({ value: String(y), label: yearLabel(y) })),
  ];
  
  const currentYearLabel =
    yearOptions.find((o) => o.value === selectedYear)?.label ?? yearAllLabel;

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

        {sortOrder && onSortChange && (
          <div className="relative" ref={sortRef}>
            <button
              type="button"
              onClick={() => setSortOpen((prev) => !prev)}
              className="flex h-9 min-w-[120px] items-center justify-between gap-2.5 rounded-full border border-[#ececec] bg-white/95 px-3 text-left text-sm font-medium text-foreground shadow-[0_1px_0_0_rgba(0,0,0,0.02),0_6px_14px_rgba(24,44,106,0.05)] transition-all duration-150 hover:border-[#e6e6e6] hover:shadow-[0_1px_0_0_rgba(0,0,0,0.02),0_8px_16px_rgba(24,44,106,0.07)] focus:outline-none focus:ring-2 focus:ring-primary/10"
              aria-haspopup="listbox"
              aria-expanded={sortOpen}
            >
              <span className="truncate">{currentSortLabel}</span>
              <ChevronDown
                className={`h-3.5 w-3.5 shrink-0 text-body/35 transition-transform duration-150 ${
                  sortOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {sortOpen && (
              <div className="absolute right-0 top-full z-20 mt-2 min-w-full overflow-hidden rounded-2xl border border-[#ececec] bg-white p-1 shadow-[0_14px_24px_rgba(24,44,106,0.1)]">
                {SORT_OPTIONS.map((option) => {
                  const isSelected = sortOrder === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        onSortChange(option.value);
                        setSortOpen(false);
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
        )}

        {showYearFilter && onYearChange && (
          <div className="relative" ref={yearRef}>
            <button
              type="button"
              onClick={() => setYearOpen((prev) => !prev)}
              className="flex h-9 min-w-[132px] items-center justify-between gap-2.5 rounded-full border border-border bg-card/95 px-3 text-left text-sm font-medium text-foreground shadow-[0_1px_0_0_rgba(0,0,0,0.02),0_6px_14px_rgba(24,44,106,0.05)] transition-all duration-150 hover:border-border hover:shadow-[0_1px_0_0_rgba(0,0,0,0.02),0_8px_16px_rgba(24,44,106,0.07)] focus:outline-none focus:ring-2 focus:ring-primary/10"
              aria-haspopup="listbox"
              aria-expanded={yearOpen}
            >
              <span className="truncate">{currentYearLabel}</span>
              <ChevronDown
                className={`h-3.5 w-3.5 shrink-0 text-body/35 transition-transform duration-150 ${
                  yearOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {yearOpen && (
              <div className="absolute right-0 sm:left-0 top-full z-20 mt-2 min-w-[132px] overflow-hidden rounded-2xl border border-border bg-white p-1 shadow-[0_14px_24px_rgba(24,44,106,0.1)]">
                {yearOptions.map((option) => {
                  const isSelected = selectedYear === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        onYearChange(option.value);
                        setYearOpen(false);
                      }}
                      className={`flex w-full items-center rounded-xl px-3 py-2 text-left text-sm transition-colors duration-150 hover:bg-muted/50 ${
                        isSelected
                          ? "bg-primary text-white hover:bg-primary"
                          : "text-foreground"
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
        )}

        {extraFilters}
      </div>

      {actionButton}
    </div>
  );
}
