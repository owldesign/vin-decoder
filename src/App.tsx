import { useState } from 'react'
import { VehicleResultsNew } from '@/components/vehicle-results-new'
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

  const handleVinSubmit = async (vin: string, year?: string) => {
    setLoading(true)
    setError(null)
    setVehicleData(null)

    try {
      const data = await NHTSAApiService.decodeVin(vin, year)
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
    setIsSample(true)
    await handleVinSubmit(SAMPLE_VINS[nextIndex])
  }

  const handleDecodeSample = async (index: number) => {
    setCurrentSampleIndex(index)
    setIsSample(true)
    await handleVinSubmit(SAMPLE_VINS[index])
  }

  const showWelcome = !vehicleData && !loading && !error

  return (
    <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {showWelcome && (
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold text-white">VIN Decoder</h1>
              <p className="text-neutral-400 text-lg">
                Decode any vehicle identification number using official NHTSA data
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              {SAMPLE_VINS.map((vin, index) => (
                <button
                  key={vin}
                  onClick={() => handleDecodeSample(index)}
                  className="px-4 py-2 bg-neutral-800 text-white rounded hover:bg-neutral-700 transition-colors text-sm font-mono"
                >
                  {vin}
                </button>
              ))}
            </div>

            <div className="pt-4">
              <p className="text-neutral-500 text-sm">Click any sample VIN above to see it decoded</p>
            </div>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-neutral-700 border-t-white"></div>
            <p className="text-white">Decoding VIN...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-900/20 border border-red-500 rounded-lg p-6 text-center">
            <p className="text-red-400">{error}</p>
            <button
              onClick={() => setError(null)}
              className="mt-4 px-6 py-2 bg-neutral-800 text-white rounded hover:bg-neutral-700 transition-colors"
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
            isSample={isSample}
          />
        )}
      </div>
      <GoogleAnalytics gaId="G-L560QKP7ZF" />
    </div>
  )
}

export default App
