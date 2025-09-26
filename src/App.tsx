import {useState} from 'react'
import {ThemeProvider} from '@/components/theme-provider'
import {ThemeToggle} from '@/components/theme-toggle'
import {VinForm} from '@/components/vin-form'
import {VehicleResults} from '@/components/vehicle-results'
import {NHTSAApiService, type ProcessedVehicleData} from '@/lib/nhtsa-api'
import {Card, CardContent} from '@/components/ui/card'
import {AlertCircle, RotateCcw} from 'lucide-react'
import {Button} from '@/components/ui/button'
import {GoogleAnalytics} from '@next/third-parties/google';

function App() {
    const [vehicleData, setVehicleData] = useState<ProcessedVehicleData | null>(null)
    const [currentVin, setCurrentVin] = useState<string>("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

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

    const handleReset = () => {
        setVehicleData(null)
        setCurrentVin("")
        setError(null)
    }

    return (
        <div>
            <ThemeProvider defaultTheme="dark" storageKey="vin-decoder-theme">
                <div className="min-h-screen bg-background relative">
                    <header className="container mx-auto px-4 py-6">
                        <div className="flex justify-between items-start mb-6">
                            <div className="flex-1"></div>
                            <div className="text-center flex-1">
                                <h1 className="text-4xl font-bold mb-2">VIN Decoder</h1>
                                <p className="text-lg text-muted-foreground">
                                    Free Vehicle Identification Number Lookup Tool
                                </p>
                            </div>
                            <div className="flex-1 flex justify-end">
                                <ThemeToggle/>
                            </div>
                        </div>
                        <div className="text-center">
                            <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
                                Decode any 17-character VIN instantly using official NHTSA data. Get comprehensive vehicle specifications,
                                manufacturing details, and technical information for any car, truck, or motorcycle manufactured since 1981.
                            </p>
                        </div>
                    </header>

                    <main className="container mx-auto px-4 py-8">
                        <div className="flex flex-col items-center space-y-8">
                            {!vehicleData && !error && (
                                <section aria-labelledby="vin-form-heading">
                                    <h2 id="vin-form-heading" className="sr-only">VIN Input Form</h2>
                                    <VinForm onSubmit={handleVinSubmit} loading={loading}/>
                                </section>
                            )}

                            {error && (
                                <section aria-labelledby="error-heading">
                                    <h2 id="error-heading" className="sr-only">Error Message</h2>
                                    <Card className="w-full max-w-md border-destructive">
                                        <CardContent className="pt-6">
                                            <div className="flex items-center gap-2 text-destructive mb-4">
                                                <AlertCircle className="h-5 w-5"/>
                                                <span className="font-medium">Error</span>
                                            </div>
                                            <p className="text-sm mb-4">{error}</p>
                                            <Button onClick={handleReset} variant="outline" className="w-full">
                                                <RotateCcw className="mr-2 h-4 w-4"/>
                                                Try Again
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </section>
                            )}

                            {vehicleData && (
                                <section aria-labelledby="results-heading">
                                    <h2 id="results-heading" className="sr-only">Vehicle Information Results</h2>
                                    <div className="w-full space-y-6">
                                        <div className="flex justify-center">
                                            <Button onClick={handleReset} variant="outline">
                                                <RotateCcw className="mr-2 h-4 w-4"/>
                                                Decode Another VIN
                                            </Button>
                                        </div>
                                        <div className="flex justify-center">
                                            <VehicleResults data={vehicleData} vin={currentVin}/>
                                        </div>
                                    </div>
                                </section>
                            )}
                        </div>

                        <section className="mt-16 max-w-4xl mx-auto">
                            <h2 className="text-2xl font-semibold mb-6 text-center">About VIN Decoding</h2>
                            <div className="grid md:grid-cols-2 gap-8">
                                <div>
                                    <h3 className="text-lg font-medium mb-3">What is a VIN?</h3>
                                    <p className="text-muted-foreground">
                                        A Vehicle Identification Number (VIN) is a unique 17-character code assigned to every
                                        vehicle manufactured since 1981. It contains encoded information about the vehicle's
                                        make, model, year, engine, and manufacturing plant.
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-lg font-medium mb-3">How to Find Your VIN</h3>
                                    <p className="text-muted-foreground">
                                        Your VIN can be found on the dashboard near the windshield (driver's side),
                                        driver's door jamb, vehicle registration, or insurance documents. It's a
                                        17-character code with no spaces or special characters.
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-lg font-medium mb-3">Official NHTSA Data</h3>
                                    <p className="text-muted-foreground">
                                        Our tool uses the official NHTSA (National Highway Traffic Safety Administration)
                                        vPIC database, ensuring accurate and up-to-date vehicle information directly
                                        from government sources.
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-lg font-medium mb-3">Free & Fast</h3>
                                    <p className="text-muted-foreground">
                                        Decode unlimited VINs completely free. No registration, no hidden fees,
                                        no limits. Get instant results with detailed vehicle specifications,
                                        manufacturing info, and safety ratings.
                                    </p>
                                </div>
                            </div>
                        </section>
                    </main>

                    <footer className="border-t mt-16">
                        <div className="container mx-auto px-4 py-6">
                            <div className="text-center text-sm text-muted-foreground space-y-2">
                                <p>
                                    Vehicle data provided by{' '}
                                    <a
                                        href="https://vpic.nhtsa.dot.gov/api/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="underline hover:text-foreground"
                                        title="NHTSA vPIC API - Official Vehicle Database"
                                    >
                                        NHTSA vPIC API
                                    </a>
                                </p>
                                <p>
                                    Free VIN decoder tool for cars, trucks, motorcycles, and commercial vehicles.
                                    Fast, accurate, and always up-to-date.
                                </p>
                            </div>
                        </div>
                    </footer>
                </div>
            </ThemeProvider>
            <GoogleAnalytics gaId="G-L560QKP7ZF"/>
        </div>
    )
}

export default App
