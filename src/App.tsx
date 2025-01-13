import QuickMapbox from './components/QuickMapbox'
import dataset from './data/geojson.json'
function App() {
  return (
    <>
      <QuickMapbox
        mapboxAccessToken={
          import.meta.env.VITE_MAPBOX_ACCESS_TOKEN ||
          'pk.eyJ1IjoiZGFuaWVsZWd1aWRvdW5pIiwiYSI6ImNtNXY2ZDFkejAzdGsya3IwYXdwejNrOTIifQ.8IRcrmJ8Tl73fzBaonbduQ'
        }
        features={dataset.features}
      />
    </>
  )
}

export default App
