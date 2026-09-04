import { useMemo, useState } from "react"
import { BarcodeDisplay } from "@/components/barcode-display"
import { VinDisplay } from "@/components/vin-display"
import {
  formatBodyClass,
  formatDriveType,
  formatEngine,
  formatModel,
  formatPlant,
  formatVehicleClass,
  type ProcessedVehicleData,
} from "@/lib/nhtsa-api"
import { type HistoryItem } from "@/lib/vin-utils"

interface IdentificationCardProps {
  vin: string
  onVinChange: (vin: string) => void
  onDecode: () => void
  onClear: () => void
  loading: boolean
  error: string | null
  data: ProcessedVehicleData | null
  decodedAt: string
  history: HistoryItem[]
  onHistoryLoad: (vin: string) => void
  onHistoryRemove: (vin: string) => void
}

const DASH = "—"

type SpecRow = {
  label: string
  value: string
}

export const IdentificationCard = ({
  vin,
  onVinChange,
  onDecode,
  onClear,
  loading,
  error,
  data,
  decodedAt,
  history,
  onHistoryLoad,
  onHistoryRemove,
}: IdentificationCardProps) => {
  const [expanded, setExpanded] = useState(false)
  const [filter, setFilter] = useState("")
  const [copied, setCopied] = useState("")

  const hasDecode = Boolean(data?.make || data?.model)

  const specs: SpecRow[] = [
    { label: "MAKE", value: data?.make || DASH },
    { label: "MODEL", value: data ? formatModel(data) || DASH : DASH },
    { label: "MODEL YEAR", value: data?.year || DASH },
    { label: "BODY CLASS", value: data ? formatBodyClass(data) || DASH : DASH },
    { label: "ENGINE", value: data ? formatEngine(data) || DASH : DASH },
    { label: "PLANT", value: data ? formatPlant(data) || DASH : DASH },
    { label: "DRIVE TYPE", value: data ? formatDriveType(data) || DASH : DASH },
    { label: "VEHICLE CLASS", value: data ? formatVehicleClass(data) || DASH : DASH },
  ]

  const statusText = loading
    ? "DECODING VIA NHTSA VPIC…"
    : hasDecode
      ? `DECODED CLEAN · ${[data?.year, data?.make].filter(Boolean).join(" ")}${decodedAt ? ` · ${decodedAt}` : ""}`
      : vin.length === 0
        ? "AWAITING VIN · 17 CHARACTERS"
        : `${vin.length} OF 17 CHARACTERS`

  const footnote = hasDecode
    ? `DECODED VIA NHTSA VPIC · ${decodedAt} · FIELDS RETURNED: ${data?.allFields.length ?? 0}`
    : "LIVE DECODE VIA NHTSA VPIC · NO KEY REQUIRED"

  const filteredFields = useMemo(() => {
    const query = filter.toLowerCase()
    const fields = data?.allFields ?? []
    if (!query) return fields
    return fields.filter(
      (field) =>
        field.label.toLowerCase().includes(query) ||
        field.value.toLowerCase().includes(query)
    )
  }, [data, filter])

  const flashCopied = (message: string) => {
    setCopied(message)
    window.setTimeout(() => setCopied(""), 2000)
  }

  const handleCopy = async (text: string, message: string) => {
    try {
      if (!navigator.clipboard) {
        flashCopied("CLIPBOARD UNAVAILABLE")
        return
      }
      await navigator.clipboard.writeText(text)
      flashCopied(message)
    } catch {
      flashCopied("CLIPBOARD BLOCKED")
    }
  }

  const handleCopyVin = () => {
    handleCopy(vin, "VIN COPIED")
  }

  const handleCopyJson = () => {
    const payload = JSON.stringify(
      { vin, decodedAt, fields: data?.allFields ?? [] },
      null,
      2
    )
    handleCopy(payload, "JSON COPIED")
  }

  const handleExportCsv = () => {
    const rows = [["Field", "Value"]].concat(
      (data?.allFields ?? []).map((field) => [field.label, field.value])
    )
    const csv = rows
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n")
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }))
    const link = document.createElement("a")
    link.href = url
    link.download = `${vin || "vin"}.csv`
    link.click()
    window.setTimeout(() => URL.revokeObjectURL(url), 1000)
    flashCopied("CSV EXPORTED")
  }

  const handleFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onVinChange(event.target.value)
  }

  const handleFieldKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault()
      onDecode()
    }
  }

  const handleToggleAll = () => {
    setExpanded((current) => !current)
  }

  return (
    <div className="relative w-full max-w-[1040px] overflow-hidden rounded-[10px] bg-[#F2F0E9] shadow-[0_24px_60px_-12px_rgba(0,0,0,.65)]">
      <div
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            "repeating-linear-gradient(transparent, transparent 31px, #e5e3dc 31px, #e5e3dc 32px)",
        }}
      />

      <div className="relative z-10">
        <header className="flex flex-wrap items-center justify-between gap-4 bg-[#111] px-[clamp(18px,3.4vw,40px)] py-4">
          <h1 className="text-[clamp(15px,1.5vw,19px)] font-bold tracking-[0.06em] text-white">
            VEHICLE IDENTIFICATION
          </h1>
          <p className="font-mono text-[11.5px] tracking-[0.06em] text-[#8a8a8a]">
            NHTSA vPIC · vin.owl-design.net
          </p>
        </header>

        <div className="h-[3px] overflow-hidden bg-[#e5e3dc]" aria-hidden="true">
          {loading && (
            <div className="h-full w-1/4 animate-vinScan bg-[#2563eb]" />
          )}
        </div>

        <div className="flex flex-col gap-[clamp(24px,3vw,38px)] px-[clamp(18px,3.4vw,44px)] pb-[clamp(26px,3.6vw,40px)] pt-[clamp(22px,3.6vw,42px)]">
          <VinDisplay
            vin={vin}
            onChange={onVinChange}
            onDecode={onDecode}
            disabled={loading}
          />

          <div className="flex flex-wrap items-end gap-[clamp(14px,2vw,26px)]">
            <div className="flex min-w-0 flex-1 basis-[260px] flex-col gap-[7px]">
              <label
                htmlFor="vin-paste"
                className="font-mono text-[11.5px] tracking-[0.16em] text-[#6f6c63]"
              >
                TYPE OR PASTE A 17-CHARACTER VIN
              </label>
              <input
                id="vin-paste"
                type="text"
                value={vin}
                onChange={handleFieldChange}
                onKeyDown={handleFieldKeyDown}
                placeholder="PASTE VIN"
                autoComplete="off"
                spellCheck={false}
                maxLength={17}
                disabled={loading}
                className="min-h-12 w-full border-0 border-b-2 border-[#111] bg-transparent px-0.5 py-3 font-mono text-base uppercase tracking-[0.22em] text-[#111] outline-none placeholder:text-[#a8a49a] focus:border-[#2563eb]"
              />
            </div>
            <button
              type="button"
              onClick={onDecode}
              disabled={loading}
              className="min-h-[52px] bg-[#111] px-[26px] py-4 font-mono text-[13px] font-medium uppercase tracking-[0.14em] text-white hover:bg-[#2b2b2b] disabled:cursor-wait disabled:opacity-70"
            >
              {loading ? "DECODING…" : "DECODE VIN ▸"}
            </button>
            <button
              type="button"
              onClick={onClear}
              disabled={loading}
              className="min-h-[52px] border-2 border-[#cfccc2] bg-transparent px-5 py-3.5 font-mono text-[13px] uppercase tracking-[0.14em] text-[#6f6c63] hover:border-[#111] hover:text-[#111]"
            >
              CLEAR
            </button>
          </div>

          <div className="flex min-h-5 flex-wrap items-center gap-3" role="status">
            <p className="font-mono text-[11.5px] uppercase tracking-[0.14em] text-[#6f6c63]">
              {statusText}
            </p>
            {error && (
              <p className="font-mono text-[11.5px] tracking-[0.08em] text-[#b3261e]">{error}</p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-x-[clamp(24px,4vw,60px)] gap-y-[26px] md:grid-cols-2">
            {specs.map((spec) => (
              <div
                key={spec.label}
                className="flex items-baseline justify-between gap-3.5 border-b border-[#cfccc2] pb-[11px]"
              >
                <span className="font-mono text-[12.5px] tracking-[0.14em] text-[#6f6c63]">
                  {spec.label}
                </span>
                <span className="text-right text-[clamp(19px,2.1vw,28px)] font-bold leading-[1.15] text-[#111]">
                  {spec.value}
                </span>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-4 border-t border-[#cfccc2] pt-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <button
                type="button"
                onClick={handleToggleAll}
                className="flex items-center gap-2.5 bg-transparent p-0 font-mono text-[12.5px] tracking-[0.14em] text-[#111] hover:text-[#2563eb]"
                aria-expanded={expanded}
              >
                <span
                  className="flex h-5 w-5 items-center justify-center border-2 border-[#111] text-xs leading-none"
                  aria-hidden="true"
                >
                  {expanded ? "−" : "+"}
                </span>
                <span>ALL VPIC FIELDS</span>
                <span className="text-[#6f6c63]">{data?.allFields.length || ""}</span>
              </button>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={handleCopyVin}
                  className="border border-[#cfccc2] bg-transparent px-[13px] py-[9px] font-mono text-[11.5px] tracking-[0.1em] text-[#4a4740] hover:border-[#111] hover:text-[#111]"
                >
                  COPY VIN
                </button>
                <button
                  type="button"
                  onClick={handleCopyJson}
                  className="border border-[#cfccc2] bg-transparent px-[13px] py-[9px] font-mono text-[11.5px] tracking-[0.1em] text-[#4a4740] hover:border-[#111] hover:text-[#111]"
                >
                  COPY JSON
                </button>
                <button
                  type="button"
                  onClick={handleExportCsv}
                  className="border border-[#cfccc2] bg-transparent px-[13px] py-[9px] font-mono text-[11.5px] tracking-[0.1em] text-[#4a4740] hover:border-[#111] hover:text-[#111]"
                >
                  EXPORT CSV
                </button>
              </div>
            </div>

            {copied && (
              <p className="font-mono text-[11.5px] tracking-[0.14em] text-[#0f7355]">{copied}</p>
            )}

            {expanded && (
              <div className="flex flex-col gap-3">
                <input
                  type="search"
                  value={filter}
                  onChange={(event) => setFilter(event.target.value)}
                  placeholder="FILTER FIELDS"
                  aria-label="Filter vPIC fields"
                  className="w-full max-w-80 border border-[#cfccc2] bg-white px-3 py-2.5 font-mono text-xs tracking-[0.08em] text-[#111] outline-none focus:border-[#111]"
                />
                <div className="max-h-[360px] overflow-y-auto border-t border-[#cfccc2]">
                  {filteredFields.map((field) => (
                    <div
                      key={`${field.label}-${field.value}`}
                      className="flex items-baseline justify-between gap-4 border-b border-[#e0ddd4] px-0.5 py-[9px]"
                    >
                      <span className="font-mono text-[11.5px] tracking-[0.06em] text-[#6f6c63]">
                        {field.label}
                      </span>
                      <span className="text-right text-[13.5px] font-semibold text-[#111]">
                        {field.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col items-center gap-3 border-t border-[#cfccc2] pt-[26px]">
            <div className="w-full">
              <BarcodeDisplay value={vin} />
            </div>
            <p className="font-mono text-sm tracking-[0.42em] text-[#3f3c35]">
              {vin || "ENTER A VIN"}
            </p>
          </div>

          {history.length > 0 && (
            <div className="flex flex-col gap-2.5 border-t border-[#cfccc2] pt-5">
              <p className="font-mono text-[11.5px] tracking-[0.16em] text-[#6f6c63]">
                RECENT DECODES
              </p>
              {history.map((item) => (
                <div
                  key={item.vin}
                  className="flex items-center gap-3.5 border-b border-[#e0ddd4] py-2"
                >
                  <button
                    type="button"
                    onClick={() => onHistoryLoad(item.vin)}
                    className="flex min-w-0 flex-1 items-baseline justify-between gap-3.5 bg-transparent p-0 text-left hover:opacity-60"
                  >
                    <span className="font-mono text-[13px] tracking-[0.08em] text-[#111]">
                      {item.vin}
                    </span>
                    <span className="text-right text-[13px] font-semibold text-[#4a4740]">
                      {item.label || DASH}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onHistoryRemove(item.vin)}
                    aria-label={`Remove ${item.vin} from history`}
                    className="bg-transparent px-1.5 py-1 font-mono text-sm text-[#a8a49a] hover:text-[#b3261e]"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          <p className="font-mono text-[11.5px] uppercase tracking-[0.14em] text-[#8b887e] text-pretty">
            {footnote}
          </p>
        </div>
      </div>
    </div>
  )
}
