import { create } from 'zustand'
import { Feature } from 'geojson'

interface StoreState {
  selectedFeature: Feature | null
  setSelectedFeature: (feature: Feature | null) => void
}

const useStore = create<StoreState>()((set) => ({
  selectedFeature: null,
  setSelectedFeature: (feature) => set({ selectedFeature: feature }),
}))

export default useStore
