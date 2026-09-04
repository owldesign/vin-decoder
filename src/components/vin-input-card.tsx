import { useState } from 'react'
import { VinDisplay } from './vin-display'

interface VinInputCardProps {
  onSubmit: (vin: string) => void
  loading: boolean
  onSampleClick: (vin: string) => void
  samples: string[]
}

export function VinInputCard({ onSubmit, loading, onSampleClick, samples }: VinInputCardProps) {
  const [vin, setVin] = useState('')
  const [error, setError] = useState<string | null>(null)

  const validateVin = (vinValue: string): boolean => {
    const vinRegex = /^[A-HJ-NPR-Z0-9]{17}$/i
    return vinRegex.test(vinValue)
  }

  const handleSubmit = () => {
    const trimmedVin = vin.trim().toUpperCase()
    
    if (!trimmedVin) {
      setError('Please enter a VIN')
      return
    }
    
    if (!validateVin(trimmedVin)) {
      setError('Please enter a valid 17-character VIN')
      return
    }
    
    setError(null)
    onSubmit(trimmedVin)
  }

  const handleVinChange = (newVin: string) => {
    setVin(newVin)
    if (error) setError(null)
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedText = e.clipboardData.getData('text').toUpperCase().replace(/[^A-HJ-NPR-Z0-9]/g, '')
    if (pastedText.length <= 17) {
      setVin(pastedText)
      if (error) setError(null)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && vin.length === 17) {
      handleSubmit()
    }
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="bg-[#F2F0E9] rounded-lg shadow-xl overflow-hidden relative">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `repeating-linear-gradient(transparent, transparent 31px, #e5e3dc 31px, #e5e3dc 32px)`,
            opacity: 0.5,
          }}
        />

        <div className="relative z-10">
          <div className="bg-[#111111] px-6 py-4 flex justify-between items-center">
            <h1 className="text-white font-bold text-lg tracking-wide">VEHICLE IDENTIFICATION</h1>
            <div className="text-neutral-400 text-xs font-mono">NHTSA vPIC · vin.owl-design.net</div>
          </div>

          <div className="px-8 py-8 space-y-6">
            <div className="space-y-4">
              <p className="text-center text-neutral-600 text-sm uppercase tracking-wider font-medium">
                Enter VIN or paste below
              </p>
              
              <div className="flex justify-center">
                <input
                  type="text"
                  value={vin}
                  onChange={(e) => handleVinChange(e.target.value.toUpperCase().replace(/[^A-HJ-NPR-Z0-9]/g, '').slice(0, 17))}
                  onPaste={handlePaste}
                  onKeyDown={handleKeyDown}
                  placeholder="Paste VIN here or type below"
                  className="w-full max-w-md px-4 py-3 text-center font-mono text-lg border-2 border-neutral-800 rounded bg-white focus:outline-none focus:border-neutral-900"
                  maxLength={17}
                />
              </div>
            </div>

            <VinDisplay vin={vin} editable onChange={handleVinChange} />

            {error && (
              <div className="text-center text-red-600 text-sm font-medium">
                {error}
              </div>
            )}

            <div className="flex justify-center">
              <button
                onClick={handleSubmit}
                disabled={loading || vin.length !== 17}
                className="bg-[#111111] text-white px-8 py-3 rounded font-semibold hover:bg-neutral-800 transition-colors uppercase tracking-wide text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'DECODING...' : 'DECODE VIN'}
              </button>
            </div>

            <div className="border-t border-neutral-300 pt-6 mt-6">
              <p className="text-center text-neutral-600 text-xs uppercase tracking-wider font-medium mb-3">
                Or try a sample
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {samples.map((sampleVin) => (
                  <button
                    key={sampleVin}
                    onClick={() => onSampleClick(sampleVin)}
                    disabled={loading}
                    className="px-3 py-2 bg-neutral-200 text-neutral-700 rounded hover:bg-neutral-300 transition-colors text-xs font-mono disabled:opacity-50"
                  >
                    {sampleVin}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
