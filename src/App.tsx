import { useState } from 'react'
import { VehicleResultsNew } from '@/components/vehicle-results-new'
import { VinInputCard } from '@/components/vin-input-card'
import { NHTSAApiService, type ProcessedVehicleData } from '@/lib/nhtsa-api'
import { GoogleAnalytics } from '@next/third-parties/google'

const SAMPLE_VINS = [
  '1FTFW1ET5DFC10312', // 2013 Ford F-150 SuperCrew
  '1HGBH41JXMN109186', // 2021 Honda Accord
  '5YJSA1E14HF208682', // 2017 Tesla Model S
  'WBA3A5G59DNP26082', // 2013 BMW 328i
  '1G1YY23W9R5119845', // 1994 Chevrolet Corvette
]

function App() {
  const [vehicleData, setVehicleData] = useState<ProcessedVehicleData | null>(null)
  const [currentVin, setCurrentVin] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentSampleIndex, setCurrentSampleIndex] = useState(0)
  const [isSample, setIsSample] = useState(false)

  const handleVinSubmit = async (vin: string, fromSample: boolean = false) => {
    setLoading(true)
    setError(null)
    setVehicleData(null)
    setIsSample(fromSample)

    try {
      const data = await NHTSAApiService.decodeVin(vin)
      setVehicleData(data)
      setCurrentVin(vin)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleDecodeNextSample = async () => {
    const nextIndex = (currentSampleIndex + 1) % SAMPLE_VINS.length
    setCurrentSampleIndex(nextIndex)
    await handleVinSubmit(SAMPLE_VINS[nextIndex], true)
  }

  const handleDecodeSample = async (vin: string) => {
    const index = SAMPLE_VINS.indexOf(vin)
    if (index !== -1) {
      setCurrentSampleIndex(index)
    }
    await handleVinSubmit(vin, true)
  }

  const handleDecodeAnother = () => {
    setVehicleData(null)
    setCurrentVin('')
    setError(null)
    setIsSample(false)
  }

  const showInput = !vehicleData && !error

  return (
    <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center p-4 py-8">
      <div className="w-full max-w-4xl">
        {showInput && (
          <VinInputCard
            onSubmit={(vin) => handleVinSubmit(vin, false)}
            loading={loading}
            onSampleClick={handleDecodeSample}
            samples={SAMPLE_VINS}
          />
        )}

        {error && (
          <div className="bg-red-900/20 border border-red-500 rounded-lg p-6 text-center">
            <p className="text-red-400 mb-4">{error}</p>
            <button
              onClick={handleDecodeAnother}
              className="px-6 py-2 bg-neutral-800 text-white rounded hover:bg-neutral-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {vehicleData && (
          <VehicleResultsNew
            data={vehicleData}
            vin={currentVin}
            onDecodeNext={handleDecodeNextSample}
            onDecodeAnother={handleDecodeAnother}
            isSample={isSample}
          />
        )}
      </div>
      <GoogleAnalytics gaId="G-L560QKP7ZF" />
    </div>
  )
}

export default App
