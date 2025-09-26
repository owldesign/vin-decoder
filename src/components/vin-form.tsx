import {useState} from "react"
import {Input} from "@/components/ui/input"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Loader2} from "lucide-react"
import ElectricBorder from "../../@/components/ElectricBorder.tsx";
import LetterGlitch from "../../@/components/LetterGlitch.tsx";
import FuzzyText from "../../@/components/FuzzyText.tsx";
import StarBorder from "../../@/components/StarBorder.tsx";
import {sendGAEvent} from "@next/third-parties/google";

interface VinFormProps {
    onSubmit: (vin: string, year?: string) => Promise<void>
    loading?: boolean
}

export function VinForm({onSubmit, loading = false}: VinFormProps) {
    const [vin, setVin] = useState("")
    const [year, setYear] = useState("")
    const [errors, setErrors] = useState<{ vin?: string; year?: string }>({})

    const validateVin = (vinValue: string): boolean => {
        // Basic VIN validation - 17 characters alphanumeric (excluding I, O, Q)
        const vinRegex = /^[A-HJ-NPR-Z0-9]{17}$/i
        return vinRegex.test(vinValue)
    }

    const validateYear = (yearValue: string): boolean => {
        if (!yearValue) return true // Year is optional
        const yearNum = parseInt(yearValue)
        const currentYear = new Date().getFullYear()
        return yearNum >= 1980 && yearNum <= currentYear + 1
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const newErrors: { vin?: string; year?: string } = {}

        if (!vin.trim()) {
            newErrors.vin = "VIN is required"
        } else if (!validateVin(vin.trim())) {
            newErrors.vin = "Please enter a valid 17-character VIN"
        }

        if (year && !validateYear(year)) {
            newErrors.year = "Please enter a valid year (1980-present)"
        }

        setErrors(newErrors)

        if (Object.keys(newErrors).length === 0) {
            await onSubmit(vin.trim().toUpperCase(), year || undefined)
        }

        sendGAEvent('event', 'buttonClicked', { value: 'decode_vin' });
    }

    const handleVinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.toUpperCase().replace(/[^A-HJ-NPR-Z0-9]/g, "")
        if (value.length <= 17) {
            setVin(value)
            if (errors.vin) {
                setErrors(prev => ({...prev, vin: undefined}))
            }
        }
    }

    const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, "")
        if (value.length <= 4) {
            setYear(value)
            if (errors.year) {
                setErrors(prev => ({...prev, year: undefined}))
            }
        }
    }

    return (
        <ElectricBorder
            color="#7df9ff"
            speed={0.1}
            chaos={0.2}
            thickness={2}
            style={{borderRadius: 16}}
        >


            <Card className="w-full max-w-md border-none">
                <CardHeader>
                    <div className="relative">
                        <LetterGlitch
                            glitchSpeed={50}
                            centerVignette={true}
                            outerVignette={false}
                            smooth={true} glitchColors={['#2b4539', '#61dca3', '#61b3dc']} characters={"ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$&*()-_+=/[]{};:<>.,0123456789"}                        />
                        <CardTitle className="absolute top-1/2">
                            <FuzzyText
                                baseIntensity={0.1}
                                enableHover={false}
                                fontSize={33}
                                fontFamily={'Menlo, sans-serif'}>
                                VIN DECODER
                            </FuzzyText>
                        </CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="vin" className="text-sm font-medium">
                                VIN Number *
                            </label>
                            <Input
                                id="vin"
                                name="vin"
                                type="text"
                                placeholder="Enter 17-character VIN"
                                value={vin}
                                onChange={handleVinChange}
                                className={errors.vin ? "border-destructive" : ""}
                                disabled={loading}
                                aria-describedby={errors.vin ? "vin-error" : undefined}
                                aria-invalid={!!errors.vin}
                                maxLength={17}
                                autoComplete="off"
                                spellCheck="false"
                            />
                            {errors.vin && (
                                <p id="vin-error" className="text-sm text-destructive" role="alert">
                                    {errors.vin}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="year" className="text-sm font-medium">
                                Model Year (Optional)
                            </label>
                            <Input
                                id="year"
                                name="year"
                                type="text"
                                placeholder="e.g. 2020"
                                value={year}
                                onChange={handleYearChange}
                                className={errors.year ? "border-destructive" : ""}
                                disabled={loading}
                                aria-describedby={errors.year ? "year-error" : "year-help"}
                                aria-invalid={!!errors.year}
                                maxLength={4}
                                autoComplete="off"
                                inputMode="numeric"
                                pattern="[0-9]*"
                            />
                            {errors.year && (
                                <p id="year-error" className="text-sm text-destructive" role="alert">
                                    {errors.year}
                                </p>
                            )}
                            <p id="year-help" className="text-xs text-muted-foreground">
                                Providing the model year can improve result accuracy
                            </p>
                        </div>

                        <StarBorder
                            as="button"
                            className="w-full"
                            color="cyan"
                            speed="5s"
                            disabled={loading}
                        >
                            <div className="centered flex w-full justify-center px-4 py-2 text-sm font-medium">
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                                        Decoding...
                                    </>
                                ) : (
                                    "Decode VIN"
                                )}
                            </div>
                        </StarBorder>
                    </form>
                </CardContent>
            </Card>
        </ElectricBorder>
    )
}