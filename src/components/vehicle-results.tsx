import { type ProcessedVehicleData } from "@/lib/nhtsa-api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Car, Factory, Settings, AlertCircle } from "lucide-react"

interface VehicleResultsProps {
  data: ProcessedVehicleData
  vin: string
}

export function VehicleResults({ data, vin }: VehicleResultsProps) {
  if (data.errorText) {
    return (
      <Card className="w-full max-w-4xl border-destructive">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-5 w-5" />
            VIN Decode Error
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive">{data.errorText}</p>
          {data.possibleValues && (
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">Possible values:</p>
              <p className="text-sm">{data.possibleValues}</p>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  const vehicleInfo = [
    { label: "VIN", value: vin },
    { label: "Make", value: data.make },
    { label: "Model", value: data.model },
    { label: "Year", value: data.year },
    { label: "Series", value: data.series },
    { label: "Trim", value: data.trim },
  ].filter(item => item.value)

  const specifications = [
    { label: "Body Class", value: data.bodyClass },
    { label: "Vehicle Type", value: data.vehicleType },
    { label: "Engine Cylinders", value: data.engineCylinders ? `${data.engineCylinders} cylinders` : undefined },
    { label: "Engine HP", value: data.engineHP ? `${data.engineHP} HP` : undefined },
    { label: "Fuel Type", value: data.fuelType },
    { label: "Transmission", value: data.transmission },
    { label: "Drive Type", value: data.driveType },
  ].filter((item): item is { label: string; value: string } => !!item.value)

  const manufacturing = [
    { label: "Manufacturer", value: data.manufacturerName },
    { label: "Plant City", value: data.plantCity },
    { label: "Plant State", value: data.plantState },
    { label: "Plant Country", value: data.plantCountry },
  ].filter((item): item is { label: string; value: string } => !!item.value)

  const InfoSection = ({ title, items, icon: Icon }: {
    title: string;
    items: { label: string; value: string }[];
    icon: any;
  }) => (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Icon className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">{item.label}</span>
            <Badge variant="secondary" className="ml-2">
              {item.value}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  )

  return (
    <div className="w-full max-w-4xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Vehicle Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {vehicleInfo.map((item, index) => (
              <div key={index} className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                <span className="text-sm font-medium text-muted-foreground">{item.label}</span>
                <span className="text-sm font-semibold">{item.value}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {specifications.length > 0 && (
          <InfoSection
            title="Specifications"
            items={specifications}
            icon={Settings}
          />
        )}

        {manufacturing.length > 0 && (
          <InfoSection
            title="Manufacturing"
            items={manufacturing}
            icon={Factory}
          />
        )}

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Car className="h-5 w-5" />
              Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-center p-4 rounded-lg bg-primary/10">
                <div className="text-lg font-semibold text-primary">
                  {data.year} {data.make} {data.model}
                </div>
                {data.trim && (
                  <div className="text-sm text-muted-foreground mt-1">
                    {data.trim}
                  </div>
                )}
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-3 text-sm">
                {data.bodyClass && (
                  <div className="text-center">
                    <div className="text-muted-foreground">Body</div>
                    <div className="font-medium">{data.bodyClass}</div>
                  </div>
                )}
                {data.fuelType && (
                  <div className="text-center">
                    <div className="text-muted-foreground">Fuel</div>
                    <div className="font-medium">{data.fuelType}</div>
                  </div>
                )}
                {data.engineCylinders && (
                  <div className="text-center">
                    <div className="text-muted-foreground">Engine</div>
                    <div className="font-medium">{data.engineCylinders} cyl</div>
                  </div>
                )}
                {data.driveType && (
                  <div className="text-center">
                    <div className="text-muted-foreground">Drive</div>
                    <div className="font-medium">{data.driveType}</div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}