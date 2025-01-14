import type { Feature, Point } from 'geojson'
import QuickMapbox from './components/QuickMapbox'
import dataset from './data/dataset.json'
import useStore from './store'

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

function App() {
  const setSelectedFeature = useStore((state) => state.setSelectedFeature)
  const handleFeaturePointClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    properties: any
  ) => {
    event.preventDefault()
    console.info('@click', properties)
    setSelectedFeature(properties)
  }

  return (
    <div className='App'>
      <div className='App__background position-fixed top-0 start-0 w-100  p-3' />
      <div
        className='App__QuickMapbox position-fixed top-0 start-0'
        style={{ right: 200, bottom: 0 }}
      >
        <QuickMapbox
          mapboxAccessToken={
            import.meta.env.VITE_MAPBOX_ACCESS_TOKEN ||
            'pk.eyJ1IjoiZGFuaWVsZWd1aWRvdW5pIiwiYSI6ImNtNXY2ZDFkejAzdGsya3IwYXdwejNrOTIifQ.8IRcrmJ8Tl73fzBaonbduQ'
          }
          features={dataset.features as Feature<Point>[]}
        />
      </div>
      <aside className='p-3 position-absolute' style={{ width: 200, right: 0 }}>
        {SortedLabelsByCountry.map(([country, cities]) => (
          <div key={country}>
            <h3 className='position-sticky mb-2 border-dark border-bottom top-0 p-2 bg-light'>
              {country}
            </h3>
            {Object.entries(cities).map(([city, features]) => (
              <div key={city}>
                <h4>{city}</h4>
                <ul className='list-unstyled'>
                  {features.map((feature) => (
                    <li key={feature.properties.id}>
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
