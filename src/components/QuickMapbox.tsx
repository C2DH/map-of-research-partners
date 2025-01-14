import { useRef, useLayoutEffect, useState, useEffect } from 'react'
import mapboxgl from 'mapbox-gl' // Ensure this line is correct for your setup
import type { Feature, Point } from 'geojson'
import useStore from '../store'

const QuickMapbox = ({
  mapboxAccessToken,
  features,
  mapboxStyle = 'mapbox://styles/mapbox/light-v11',
}: {
  mapboxAccessToken: string
  features: Feature<Point>[]
  mapboxStyle?: string
}) => {
  const markers = useRef<
    Record<string | number, { id: number; el: HTMLDivElement }>
  >({})
  const mapContainer = useRef(null)
  const [map, setMap] = useState<mapboxgl.Map | null>(null)
  const setSelectedFeature = useStore((state) => state.setSelectedFeature)
  useLayoutEffect(() => {
    // Initialize mapboxgl with your access token
    mapboxgl.accessToken = mapboxAccessToken
    const container = mapContainer.current
    if (!container) {
      return
    }
    const newMap = new mapboxgl.Map({
      container,
      style: mapboxStyle, // Choose a style
      center: features[0].geometry.coordinates as [number, number], // Initial center (adjust as needed)
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
          'circle-color': '#007bff',

          'circle-opacity': 0.5, // Make the circles semitransparent
        },
      })
      // // Add layer to display property names
      // newMap.addLayer({
      //   id: 'property-names-layer',
      //   type: 'symbol',
      //   source: 'points',
      //   layout: {
      //     'text-field': ['get', 'name'], // Assumes the property name is 'name'
      //     'text-size': 12,
      //     'text-offset': [0, 1.5],
      //   },
      //   paint: {
      //     'text-color': '#000000',
      //   },
      // })

      // Handle click event on points
      newMap.on('click', 'points-layer', (e) => {
        const features = e.features as unknown as Feature<Point>[]
        // const label = features[0].properties?.label as string
        // Display label (you can customize this part)
        // alert(label)
        setSelectedFeature(features[0])
      })

      // Change cursor to pointer on hover
      newMap.on('mouseenter', 'points-layer', (e) => {
        // const features = e.features as unknown as Feature<Point>[]
        newMap.getCanvas().style.cursor = 'pointer'
      })

      // Change cursor back to default on mouseleave
      newMap.on('mouseleave', 'points-layer', () => {
        newMap.getCanvas().style.cursor = ''
      })

      setMap(newMap)
    })

    // Clean up on component unmount
    return () => {
      if (map) {
        map.remove()
      }
    }
  }, [mapboxAccessToken, features])

  // Fetch initial state
  const scratchRef = useRef(
    useStore.getState().selectedFeature || features[0].properties
  )
  // Connect to the store on mount, disconnect on unmount, catch state-changes in a reference
  useEffect(
    () =>
      useStore.subscribe((state) => {
        if (!state.selectedFeature) return

        scratchRef.current = state.selectedFeature
        console.info(
          'selection changed....',
          scratchRef.current?.geometry.coordinates
        )

        if (!map) return
        map.flyTo({
          center: scratchRef.current?.geometry.coordinates as [number, number],
          zoom: 10,
          duration: 5000,
        })
        console.info('GOOO! to', scratchRef.current?.geometry.coordinates)
      }),
    [map]
  )
  useEffect(() => {})
  return (
    <div ref={mapContainer} style={{ width: '100%', height: '100%' }}></div>
  )
}

export default QuickMapbox
