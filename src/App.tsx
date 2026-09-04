import { useEffect, useRef, useState } from "react"
import { GoogleAnalytics } from "@next/third-parties/google"
import { IdentificationCard } from "@/components/identification-card"
import {
  formatModel,
  NHTSAApiService,
  type ProcessedVehicleData,
} from "@/lib/nhtsa-api"
import {
  cleanVin,
  isCompleteVin,
  loadHistory,
  saveHistory,
  type HistoryItem,
} from "@/lib/vin-utils"

function App() {
  const [vin, setVin] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<ProcessedVehicleData | null>(null)
  const [decodedAt, setDecodedAt] = useState("")
  const [history, setHistory] = useState<HistoryItem[]>([])
  const lastDecodedRef = useRef<string>("")

  useEffect(() => {
    setHistory(loadHistory())
  }, [])

  const handleVinChange = (nextRaw: string) => {
    const next = cleanVin(nextRaw)
    setVin(next)
    setError(null)
    if (isCompleteVin(next) && next !== lastDecodedRef.current) {
      handleDecode(next)
    }
  }

  const handleDecode = async (vinArg?: string) => {
    const nextVin = cleanVin(vinArg ?? vin)
    if (!isCompleteVin(nextVin)) {
      setError("NEEDS 17 VALID CHARACTERS (NO I, O, Q)")
      return
    }

    lastDecodedRef.current = nextVin
    setVin(nextVin)
    setLoading(true)
    setError(null)

    try {
      const decoded = await NHTSAApiService.decodeVin(nextVin)
      const stamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      setData(decoded)
      setDecodedAt(stamp)

      if (!decoded.make && !decoded.model) {
        setError("NO VEHICLE RECORD RETURNED FOR THIS VIN")
        return
      }

      const label = [decoded.year, decoded.make, formatModel(decoded)].filter(Boolean).join(" ")
      setHistory((current) => {
        const nextHistory = [{ vin: nextVin, label }, ...current.filter((item) => item.vin !== nextVin)].slice(0, 8)
        saveHistory(nextHistory)
        return nextHistory
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "NHTSA VPIC UNREACHABLE — CHECK THE CONNECTION")
    } finally {
      setLoading(false)
    }
  }

  const handleClear = () => {
    lastDecodedRef.current = ""
    setVin("")
    setData(null)
    setError(null)
    setDecodedAt("")
  }

  const handleHistoryLoad = (historyVin: string) => {
    handleDecode(historyVin)
  }

  const handleHistoryRemove = (historyVin: string) => {
    const nextHistory = history.filter((item) => item.vin !== historyVin)
    setHistory(nextHistory)
    saveHistory(nextHistory)
  }

  return (
    <div className="flex min-h-screen items-start justify-center bg-[#1a1a1a] p-[clamp(12px,3vw,40px)] font-sans antialiased">
      <IdentificationCard
        vin={vin}
        onVinChange={handleVinChange}
        onDecode={() => handleDecode(vin)}
        onClear={handleClear}
        loading={loading}
        error={error}
        data={data}
        decodedAt={decodedAt}
        history={history}
        onHistoryLoad={handleHistoryLoad}
        onHistoryRemove={handleHistoryRemove}
      />
      <GoogleAnalytics gaId="G-L560QKP7ZF" />
    </div>
  )
}

export default App
