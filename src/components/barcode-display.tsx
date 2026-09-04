import { useEffect, useRef } from 'react'
import JsBarcode from 'jsbarcode'

interface BarcodeDisplayProps {
  value: string
}

export function BarcodeDisplay({ value }: BarcodeDisplayProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (svgRef.current && value) {
      try {
        JsBarcode(svgRef.current, value, {
          format: 'CODE128',
          width: 2,
          height: 60,
          displayValue: false,
          background: 'transparent',
          lineColor: '#111111',
        })
      } catch (error) {
        console.error('Error generating barcode:', error)
      }
    }
  }, [value])

  return <svg ref={svgRef}></svg>
}
