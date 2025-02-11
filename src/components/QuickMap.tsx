import React, { useEffect, useRef } from 'react'
import maplibre from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

const QuickMap: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (mapContainerRef.current) {
      const map = new maplibre.Map({
        container: mapContainerRef.current,
        style: 'https://demotiles.maplibre.org/style.json', // Specify the style URL
        center: [0, 0], // Initial map center in [longitude, latitude]
        zoom: 2, // Initial map zoom level
      })

      return () => {
        map.remove()
      }
    }
  }, [])

  return (
    <div ref={mapContainerRef} style={{ width: '100vw', height: '100vh' }} />
  )
}

export default QuickMap
