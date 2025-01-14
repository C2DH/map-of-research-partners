import type { Feature, Point } from 'geojson'
import { useStore } from './components/QuickMapbox'
import QuickMapbox from './components/QuickMapbox'
import dataset from './data/dataset.json'
import Tooltip from './components/Tooltip'
import { useEffect, useRef } from 'react'

const Labels = dataset.features.reduce((acc, feature) => {
  const { city, country } = feature.properties
  if (!acc[country]) {
    acc[country] = {}
  }
  if (!acc[country][city]) {
    acc[country][city] = []
  }
  acc[country][city].push({
    ...feature,
  })
  return acc
}, {} as Record<string, Record<string, any[]>>)

const SortedLabelsByCountry = Object.entries(Labels).sort(([a], [b]) =>
  a.localeCompare(b)
)

const featureListWidth = 250

function App() {
  const setSelectedFeature = useStore((state) => state.setSelectedFeature)
  const asideRef = useRef<HTMLDivElement>(null)
  const currentFeatureId = useRef()
  const handleFeaturePointClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    properties: any
  ) => {
    event.preventDefault()
    console.info('@click', properties)
    setSelectedFeature(properties)
  }

  // Connect to the store on mount, disconnect on unmount, catch state-changes in a reference
  useEffect(
    () =>
      useStore.subscribe((state) => {
        if (!state.selectedFeature) {
          return
        }
        const featureId = state.selectedFeature.properties?.id
        console.info('[App] selection changed to:', featureId)

        if (!asideRef.current) return
        if (currentFeatureId.current) {
          // remove class
          const currentFeatureElement = asideRef.current.querySelector(
            `#aside-feature-${currentFeatureId.current}`
          )
          if (currentFeatureElement) {
            currentFeatureElement.classList.remove('active')
          }
        }
        currentFeatureId.current = featureId
        const featureElement = asideRef.current.querySelector(
          `#aside-feature-${featureId}`
        )
        if (!featureElement) return
        featureElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'center',
        })
        featureElement.classList.add('active')
      }),
    []
  )

  return (
    <div className='App'>
      <div className='App__background position-fixed top-0 start-0 w-100  p-3' />
      <div
        className='App__QuickMapbox position-fixed top-0 start-0'
        style={{ right: featureListWidth, bottom: 0 }}
      >
        <QuickMapbox
          mapboxAccessToken={
            import.meta.env.VITE_MAPBOX_ACCESS_TOKEN ||
            'pk.eyJ1IjoiZGFuaWVsZWd1aWRvdW5pIiwiYSI6ImNtNXY2ZDFkejAzdGsya3IwYXdwejNrOTIifQ.8IRcrmJ8Tl73fzBaonbduQ'
          }
          features={dataset.features as Feature<Point>[]}
        />
      </div>
      <div
        className='App__tooltip position-fixed top-0 start-0 p-3 d-flex justify-contents-center'
        style={{ right: featureListWidth }}
      >
        <Tooltip className='bg-dark text-white p-3' />
      </div>
      <aside
        ref={asideRef}
        className='p-0 position-absolute bg-light'
        style={{ width: featureListWidth, right: 0 }}
      >
        {SortedLabelsByCountry.map(([country, cities]) => (
          <div className='p-2' key={country}>
            <h3 className='position-sticky mb-2 border-dark border-bottom top-0 py-2 bg-light'>
              {country}
            </h3>
            {Object.entries(cities).map(([city, features]) => (
              <div key={city}>
                <h4 className='font-size-inherit border-dark border-bottom py-2'>
                  {city}
                </h4>
                <ul className='list-unstyled'>
                  {features.map((feature) => (
                    <li
                      key={feature.properties.id}
                      id={`aside-feature-${feature.properties.id}`}
                      className='mb-2'
                    >
                      <button
                        className='btn btn-link text-start p-0'
                        onClick={(e) => handleFeaturePointClick(e, feature)}
                      >
                        {feature.properties.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ))}
      </aside>
    </div>
  )
}

export default App
