import { type ProcessedVehicleData } from "@/lib/nhtsa-api"
import { VinDisplay } from "./vin-display"
import { BarcodeDisplay } from "./barcode-display"

interface VehicleResultsNewProps {
  data: ProcessedVehicleData
  vin: string
  onDecodeNext: () => void
  isSample: boolean
}

export function VehicleResultsNew({ data, vin, onDecodeNext, isSample }: VehicleResultsNewProps) {
  const formatEngine = () => {
    const parts = []
    if (data.engineDisplacement) parts.push(`${data.engineDisplacement}L`)
    if (data.engineCylinders) parts.push(`V${data.engineCylinders}`)
    if (data.engineModel) parts.push(data.engineModel)
    return parts.join(' ') || undefined
  }

  const formatPlant = () => {
    const parts = []
    if (data.plantCity) parts.push(data.plantCity)
    if (data.plantState) parts.push(data.plantState)
    else if (data.plantCountry && data.plantCountry !== 'UNITED STATES') parts.push(data.plantCountry)
    return parts.join(', ') || undefined
  }

  const specs = [
    { label: 'MAKE', value: data.make },
    { label: 'MODEL', value: data.model },
    { label: 'MODEL YEAR', value: data.year },
    { label: 'BODY CLASS', value: data.bodyClass },
    { label: 'ENGINE', value: formatEngine() },
    { label: 'PLANT', value: formatPlant() },
    { label: 'DRIVE TYPE', value: data.driveType },
    { label: 'VEHICLE CLASS', value: data.vehicleType },
  ]

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

          <div className="px-8 py-8 space-y-8">
            <VinDisplay vin={vin} />

            <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
              {specs.map((spec, index) => (
                <div key={index} className="border-b border-neutral-300 pb-3">
                  <div className="text-xs text-neutral-500 uppercase tracking-wider mb-1">{spec.label}</div>
                  <div className="text-lg font-bold text-neutral-900">{spec.value || '—'}</div>
                </div>
              ))}
            </div>

            <div className="flex justify-center pt-4">
              <button
                onClick={onDecodeNext}
                className="bg-[#111111] text-white px-8 py-3 rounded font-semibold hover:bg-neutral-800 transition-colors uppercase tracking-wide text-sm"
              >
                DECODE NEXT SAMPLE
              </button>
            </div>

            <div className="flex flex-col items-center space-y-2 pt-4 border-t border-neutral-300">
              <div className="w-full max-w-md">
                <BarcodeDisplay value={vin} />
              </div>
              <div className="font-mono text-sm text-neutral-700 tracking-widest">{vin}</div>
              <div className="text-xs text-neutral-500 text-center">
                {isSample ? 'SAMPLE DATA — THE LIVE APP DECODES ANY VIN VIA NHTSA VPIC' : 'Decoded via NHTSA vPIC'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
