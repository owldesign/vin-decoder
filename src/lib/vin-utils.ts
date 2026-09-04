export const SAMPLE_VINS = [
  "1FTFW1ET5DFC10312",
  "1HGBH41JXMN109186",
  "5YJSA1E14HF208682",
  "WBA3A5G59DNP26082",
  "1G1YY23W9R5119845",
] as const

export const VIN_CHAR_PATTERN = /[^A-HJ-NPR-Z0-9]/g
export const VIN_VALID_PATTERN = /^[A-HJ-NPR-Z0-9]{17}$/

export type HistoryItem = {
  vin: string
  label: string
}

export const HISTORY_KEY = "vin_decoder_history_v1"

export const cleanVin = (value: string): string =>
  value.toUpperCase().replace(VIN_CHAR_PATTERN, "").slice(0, 17)

export const isCompleteVin = (value: string): boolean => VIN_VALID_PATTERN.test(value)

export const titleCase = (value: string): string =>
  value.toLowerCase().replace(/\b[a-z]/g, (match) => match.toUpperCase())

export const loadHistory = (): HistoryItem[] => {
  try {
    const raw = localStorage.getItem(HISTORY_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as HistoryItem[]
    return Array.isArray(parsed) ? parsed.slice(0, 8) : []
  } catch {
    return []
  }
}

export const saveHistory = (history: HistoryItem[]): void => {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 8)))
  } catch {
    // Ignore quota / private-mode failures
  }
}
