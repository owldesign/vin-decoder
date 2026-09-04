export interface VehicleData {
  Variable: string
  Value: string
  ValueId: string
}

export interface NHTSAResponse {
  Count: number
  Message: string
  Results: VehicleData[]
  SearchCriteria: string
}

export interface VinField {
  label: string
  value: string
}

export interface ProcessedVehicleData {
  make?: string
  model?: string
  year?: string
  bodyClass?: string
  cabType?: string
  engineCylinders?: string
  engineHP?: string
  engineDisplacement?: string
  engineModel?: string
  engineConfiguration?: string
  fuelType?: string
  transmission?: string
  driveType?: string
  vehicleType?: string
  manufacturerName?: string
  plantCity?: string
  plantCountry?: string
  plantState?: string
  series?: string
  trim?: string
  errorText?: string
  possibleValues?: string
  allFields: VinField[]
}

const skipValue = (value: string | undefined): boolean =>
  !value || value === "Not Applicable" || value === "0"

export class NHTSAApiService {
  private static readonly BASE_URL = "https://vpic.nhtsa.dot.gov/api"

  static async decodeVin(vin: string, year?: string): Promise<ProcessedVehicleData> {
    try {
      const url = year
        ? `${this.BASE_URL}/vehicles/decodevin/${vin}?format=json&modelyear=${year}`
        : `${this.BASE_URL}/vehicles/decodevin/${vin}?format=json`

      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(`NHTSA VPIC UNREACHABLE — CHECK THE CONNECTION`)
      }

      const data: NHTSAResponse = await response.json()
      return this.processVehicleData(data.Results)
    } catch (error) {
      console.error("Error fetching VIN data:", error)
      throw new Error("NHTSA VPIC UNREACHABLE — CHECK THE CONNECTION")
    }
  }

  private static processVehicleData(results: VehicleData[]): ProcessedVehicleData {
    const processed: ProcessedVehicleData = { allFields: [] }

    for (const item of results) {
      const variable = (item.Variable || "").toLowerCase()
      const value = (item.Value || "").trim()

      if (skipValue(value)) continue

      processed.allFields.push({
        label: (item.Variable || "").toUpperCase(),
        value,
      })

      switch (variable) {
        case "make":
          processed.make = value
          break
        case "model":
          processed.model = value
          break
        case "model year":
          processed.year = value
          break
        case "body class":
          processed.bodyClass = value
          break
        case "cab type":
          processed.cabType = value
          break
        case "engine number of cylinders":
          processed.engineCylinders = value
          break
        case "engine hp (from)":
          processed.engineHP = value
          break
        case "displacement (l)":
          processed.engineDisplacement = value
          break
        case "engine model":
          processed.engineModel = value
          break
        case "engine configuration":
          processed.engineConfiguration = value
          break
        case "fuel type - primary":
          processed.fuelType = value
          break
        case "transmission style":
          processed.transmission = value
          break
        case "drive type":
          processed.driveType = value
          break
        case "vehicle type":
          processed.vehicleType = value
          break
        case "manufacturer name":
          processed.manufacturerName = value
          break
        case "plant city":
          processed.plantCity = value
          break
        case "plant country":
          processed.plantCountry = value
          break
        case "plant state":
          processed.plantState = value
          break
        case "series":
          processed.series = value
          break
        case "trim":
          processed.trim = value
          break
        case "error text":
          if (
            value &&
            !value.toLowerCase().includes("decoded clean") &&
            !value.toLowerCase().includes("check digit") &&
            value.toLowerCase().includes("error")
          ) {
            processed.errorText = value
          }
          break
        case "possible values":
          processed.possibleValues = value
          break
      }
    }

    return processed
  }
}

export const formatEngine = (data: ProcessedVehicleData): string => {
  const parts: string[] = []
  const displacement = parseFloat(data.engineDisplacement || "")
  if (!Number.isNaN(displacement)) {
    parts.push(`${displacement.toFixed(1)}L`)
  }

  const cylinders = data.engineCylinders
  const configuration = (data.engineConfiguration || "").toLowerCase()
  if (cylinders) {
    if (configuration.startsWith("v") || configuration.includes("v-")) {
      parts.push(`V${cylinders}`)
    } else if (configuration.includes("in-line") || configuration.includes("inline")) {
      parts.push(`I${cylinders}`)
    } else {
      parts.push(`${cylinders}-cyl`)
    }
  }

  if (data.engineModel) parts.push(data.engineModel)
  return parts.join(" ")
}

export const formatPlant = (data: ProcessedVehicleData): string => {
  const city = data.plantCity ? titleCaseSafe(data.plantCity) : ""
  const state = data.plantState
    ? titleCaseSafe(data.plantState)
    : data.plantCountry && data.plantCountry !== "UNITED STATES (USA)" && data.plantCountry !== "UNITED STATES"
      ? titleCaseSafe(data.plantCountry)
      : ""
  return [city, state].filter(Boolean).join(", ")
}

export const formatModel = (data: ProcessedVehicleData): string =>
  [data.model, data.series].filter(Boolean).join(" ")

export const formatBodyClass = (data: ProcessedVehicleData): string => {
  const cab = data.cabType
    ? `${titleCaseSafe(data.cabType.replace(/\s*cab$/i, ""))} Cab`
    : ""
  return [data.bodyClass, cab].filter(Boolean).join(" — ")
}

export const formatDriveType = (data: ProcessedVehicleData): string =>
  (data.driveType || "").split("/")[0] || ""

export const formatVehicleClass = (data: ProcessedVehicleData): string =>
  data.vehicleType ? titleCaseSafe(data.vehicleType) : ""

const titleCaseSafe = (value: string): string =>
  value.toLowerCase().replace(/\b[a-z]/g, (match) => match.toUpperCase())
