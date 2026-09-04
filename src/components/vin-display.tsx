import { useRef } from "react"
import { cleanVin } from "@/lib/vin-utils"

interface VinDisplayProps {
  vin: string
  onChange: (vin: string) => void
  onDecode: () => void
  disabled?: boolean
}

export const VinDisplay = ({ vin, onChange, onDecode, disabled = false }: VinDisplayProps) => {
  const inputRefs = useRef<Array<HTMLInputElement | null>>([])

  const handleFocusCell = (index: number) => {
    const clamped = Math.max(0, Math.min(16, index))
    inputRefs.current[clamped]?.focus()
  }

  const handleCharChange = (index: number, raw: string) => {
    const character = cleanVin(raw).slice(-1)
    const cells = vin.padEnd(17, " ").split("").slice(0, 17)
    cells[index] = character || " "
    onChange(cells.join("").replace(/\s+/g, ""))
    if (character && index < 16) {
      handleFocusCell(index + 1)
    }
  }

  const handleKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Backspace") {
      if (!vin[index] && index > 0) {
        event.preventDefault()
        handleFocusCell(index - 1)
        return
      }
      const next = vin.slice(0, index) + vin.slice(index + 1)
      onChange(next)
      return
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault()
      handleFocusCell(index - 1)
      return
    }

    if (event.key === "ArrowRight") {
      event.preventDefault()
      handleFocusCell(index + 1)
      return
    }

    if (event.key === "Enter") {
      event.preventDefault()
      onDecode()
    }
  }

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault()
    onChange(cleanVin(event.clipboardData.getData("text")))
  }

  const handleFocus = (index: number, event: React.FocusEvent<HTMLInputElement>) => {
    if (index > vin.length) {
      handleFocusCell(vin.length)
      return
    }
    event.target.select()
  }

  return (
    <div className="overflow-x-auto pb-0.5">
      <div
        className="grid min-w-[520px] gap-x-[5px] gap-y-[9px]"
        style={{ gridTemplateColumns: "repeat(17, minmax(0, 1fr))" }}
      >
        {Array.from({ length: 17 }, (_, index) => (
          <label
            key={index}
            className="flex aspect-[1.02/1] cursor-text items-center justify-center border-2 border-[#111] bg-white hover:border-[#2563eb]"
          >
            <input
              ref={(node) => {
                inputRefs.current[index] = node
              }}
              id={`vincell-${index}`}
              type="text"
              inputMode="text"
              autoComplete="off"
              spellCheck={false}
              maxLength={1}
              disabled={disabled}
              aria-label={`VIN character ${index + 1}`}
              value={vin[index] || ""}
              onChange={(event) => handleCharChange(index, event.target.value)}
              onKeyDown={(event) => handleKeyDown(index, event)}
              onPaste={handlePaste}
              onFocus={(event) => handleFocus(index, event)}
              className="h-full w-full min-w-0 border-0 bg-transparent p-0 text-center text-[clamp(13px,2.3vw,32px)] font-bold uppercase text-[#111] outline-none focus:shadow-[inset_0_0_0_3px_rgba(37,99,235,.35)]"
            />
          </label>
        ))}

        <div className="col-span-3 h-1 bg-[#2563eb]" />
        <div className="col-span-6 h-1 bg-[#c2410c]" />
        <div className="col-span-8 h-1 bg-[#0f7355]" />

        <div className="col-span-3 font-mono text-xs tracking-[0.1em] text-[#2563eb]">
          WMI · MFR
        </div>
        <div className="col-span-6 font-mono text-xs tracking-[0.1em] text-[#c2410c]">
          VDS · ATTRIBUTES
        </div>
        <div className="col-span-8 font-mono text-xs tracking-[0.1em] text-[#0f7355]">
          VIS · SERIAL
        </div>
      </div>
    </div>
  )
}
