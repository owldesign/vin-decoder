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
    const newVin = vinChars.map((char, i) => i === index ? value.toUpperCase() : char).join('').trim()
    onChange(newVin)
  }

  return (
    <div className="space-y-2">
      <div className="flex justify-center gap-1">
        {vinChars.map((char, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className={`relative w-10 h-12 border-2 border-neutral-800 bg-white flex items-center justify-center ${getSegmentColor(index)} border-b-4`}>
              {editable ? (
                <input
                  type="text"
                  maxLength={1}
                  value={char.trim()}
                  onChange={(e) => handleCharChange(index, e.target.value)}
                  className="w-full h-full text-center text-xl font-bold bg-transparent border-none outline-none uppercase"
                  style={{ caretColor: '#111' }}
                />
              ) : (
                <span className="text-xl font-bold">{char}</span>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center gap-1 text-xs font-medium uppercase tracking-wider">
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
