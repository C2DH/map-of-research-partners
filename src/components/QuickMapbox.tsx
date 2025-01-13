import { useRef, useLayoutEffect, useState } from 'react'
import mapboxgl from 'mapbox-gl' // Ensure this line is correct for your setup
import type { Feature, Point } from 'geojson'

const QuickMapbox = ({
  mapboxAccessToken,
  features,
}: {
  mapboxAccessToken: string
  features: Feature<Point>[]
}) => {
  const mapContainer = useRef(null)
  const [map, setMap] = useState<mapboxgl.Map | null>(null)

  useLayoutEffect(() => {
    // Initialize mapboxgl with your access token
    mapboxgl.accessToken = mapboxAccessToken
    const container = mapContainer.current
    if (!container) {
      return
    }
    const newMap = new mapboxgl.Map({
      container,
      style: 'mapbox://styles/mapbox/streets-v12', // Choose a style
      center: [-74.5, 40], // Initial center (adjust as needed)
      zoom: 9,
    })

    newMap.on('load', () => {
      // Add source for points
      newMap.addSource('points', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: features,
        },
      })

      // Add layer to display points
      // Add layer to display points
      newMap.addLayer({
        id: 'points-layer',
        type: 'circle',
        source: 'points',
        paint: {
          'circle-radius': 6,
          'circle-color': '#f00', // Red
          'circle-opacity': 0.7, // Make the circles semitransparent
        },
      })

      // Handle click event on points
      newMap.on('click', 'points-layer', (e) => {
        const features = e.features as unknown as Feature<Point>[]
        const label = features[0].properties?.label as string
        const center = features[0].geometry.coordinates as [number, number]
        newMap.flyTo({ center }) // Fly to the clicked point
        // Display label (you can customize this part)
        alert(label)
      })

      // Change cursor to pointer on hover
      newMap.on('mouseenter', 'points-layer', () => {
        newMap.getCanvas().style.cursor = 'pointer'
      })

      // Change cursor back to default on mouseleave
      newMap.on('mouseleave', 'points-layer', () => {
        newMap.getCanvas().style.cursor = ''
      })
    })

    setMap(newMap)

    // Clean up on component unmount
    return () => {
      if (map) {
        map.remove()
      }
    }
  }, [mapboxAccessToken, features])

  return <div ref={mapContainer} style={{ width: '100vw', height: '100vh' }} />
}

export default QuickMapbox
