interface VinDisplayProps {
  vin: string
  editable?: boolean
  onChange?: (vin: string) => void
}

export function VinDisplay({ vin, editable = false, onChange }: VinDisplayProps) {
  const vinChars = vin.padEnd(17, ' ').split('').slice(0, 17)

  const getSegmentColor = (index: number) => {
    if (index < 3) return 'border-blue-500'
    if (index >= 3 && index < 8) return 'border-orange-500'
    if (index >= 9) return 'border-green-500'
    return 'border-transparent'
  }

  const getSegmentLabel = (index: number) => {
    if (index === 1) return { text: 'WMI · MFR', color: 'text-blue-600' }
    if (index === 5) return { text: 'VDS · ATTRIBUTES', color: 'text-orange-600' }
    if (index === 13) return { text: 'VIS · SERIAL', color: 'text-green-600' }
    return null
  }

  const handleCharChange = (index: number, value: string) => {
    if (!editable || !onChange) return
    
    const sanitized = value.toUpperCase().replace(/[^A-HJ-NPR-Z0-9]/g, '')
    if (sanitized.length > 1) return
    
    const newChars = [...vinChars]
    newChars[index] = sanitized || ' '
    const newVin = newChars.join('').trim()
    onChange(newVin)
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && vinChars[index] === ' ' && index > 0) {
      const inputs = document.querySelectorAll<HTMLInputElement>('.vin-cell-input')
      inputs[index - 1]?.focus()
    } else if (e.key.length === 1 && /[A-HJ-NPR-Z0-9]/i.test(e.key)) {
      const inputs = document.querySelectorAll<HTMLInputElement>('.vin-cell-input')
      if (index < 16) {
        setTimeout(() => inputs[index + 1]?.focus(), 0)
      }
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex justify-center gap-1 flex-wrap">
        {vinChars.map((char, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className={`relative w-10 h-12 border-2 border-neutral-800 bg-white flex items-center justify-center ${getSegmentColor(index)} border-b-4`}>
              {editable ? (
                <input
                  type="text"
                  maxLength={1}
                  value={char.trim()}
                  onChange={(e) => handleCharChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="vin-cell-input w-full h-full text-center text-xl font-bold bg-transparent border-none outline-none uppercase focus:ring-2 focus:ring-inset focus:ring-neutral-400 rounded"
                  style={{ caretColor: '#111' }}
                />
              ) : (
                <span className="text-xl font-bold text-neutral-900">{char}</span>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center gap-1 text-xs font-medium uppercase tracking-wider flex-wrap">
        {vinChars.map((_, index) => {
          const label = getSegmentLabel(index)
          return (
            <div key={index} className="w-10 text-center">
              {label && <span className={label.color}>{label.text}</span>}
            </div>
          )
        })}
      </div>
    </div>
  )
}
