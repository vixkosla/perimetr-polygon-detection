import { useState, useRef, useCallback } from 'react'

import Map, { Source, Layer } from 'react-map-gl/mapbox'
import type { MapRef, ViewStateChangeEvent } from 'react-map-gl/mapbox';

import 'mapbox-gl/dist/mapbox-gl.css'
import type { MapLayerMouseEvent } from 'mapbox-gl';

// import './App.css'

const HFOV = 60         // угол обзора камеры (по горизонтали)
const azStep = 1        // шаг по азимуту (градусы)
const dStep = 100       // шаг по расстоянию (метры)
const maxRange = 8000   // максимальная дальность (метры)
const cameraHeight = 30 // высота камеры над рельефом (метры)
const heading = 90      // направление камеры (в градусах, 0=север, 90=восток)


function App() {
  const [viewState, setViewState] = useState({
    longitude: 42.4370,
    latitude: 43.3490,
    zoom: 11,
    pitch: 60,
    bearing: 45
  })

  const [camera, setCamera] = useState<{ lat: number; lon: number } | null>(null);

  const mapRef = useRef<MapRef>(null);

  const [polygon, setPolygon] = useState<number[][]>([])

  const onMove = (evt: ViewStateChangeEvent) => {
    setViewState(evt.viewState);
  }

  const handleClick = useCallback((e: MapLayerMouseEvent) => {
    const lat = e.lngLat.lat
    const lon = e.lngLat.lng

    setCamera({ lat, lon })
    computeVisibilityPolygon(lat, lon)
  }, [])

  const destinationPoint = (lat: number, lon: number, distance: number, bearing: number) => {
    const R = 6371000
    const br = (bearing * Math.PI) / 180
    const lat1 = (lat * Math.PI) / 180
    const lon1 = (lon * Math.PI) / 180
    const dr = distance / R

    const lat2 = Math.asin(Math.sin(lat1) * Math.cos(dr) + Math.cos(lat1) * Math.sin(dr) * Math.cos(br))
    const lon2 =
      lon1 +
      Math.atan2(Math.sin(br) * Math.sin(dr) * Math.cos(lat1), Math.cos(dr) - Math.sin(lat1) * Math.sin(lat2))
    return { lat: (lat2 * 180) / Math.PI, lon: (lon2 * 180) / Math.PI }
  }

  const computeVisibilityPolygon = async (lat: number, lon: number) => {
    const map = mapRef.current?.getMap()
    if (!map) return

    const originElev = map.queryTerrainElevation([lon, lat]) ?? 0
    const originHeight = originElev + cameraHeight

    const halfHF = HFOV / 2
    const points: number[][] = []

    for (let az = heading - halfHF; az <= heading + halfHF; az += azStep) {
      let maxSeenAngle = -Infinity
      let lastVisible = null

      for (let d = dStep; d <= maxRange; d += dStep) {
        const pt = destinationPoint(lat, lon, d, az)
        const elev = map.queryTerrainElevation([pt.lon, pt.lat])

        if (elev == null) break // вне покрытия

        const angle = Math.atan2(elev - originHeight, d)
        if (angle > maxSeenAngle) {
          maxSeenAngle = angle
          lastVisible = [pt.lon, pt.lat]
        }
      }

      if (lastVisible) points.push(lastVisible)
    }

    setPolygon(points)
  }

  return (
    <>
      <div className="" style={{ width: '100vw', height: '100vh' }}>
        <Map
          {...viewState}
          ref={mapRef}
          onClick={handleClick}
          onMove={onMove}
          mapStyle="mapbox://styles/mapbox/streets-v11"
          mapboxAccessToken='pk.eyJ1IjoiaG9va2FobG9jYXRvciIsImEiOiI5WnJEQTBBIn0.DrAlI7fhFaYr2RcrWWocgw'
          terrain={{ source: 'mapbox-dem', exaggeration: 1.5 }}
          onLoad={event => {
            const map = event.target;

            map.addSource('mapbox-dem', {
              type: 'raster-dem',
              url: 'mapbox://mapbox.terrain-rgb',
              tileSize: 512,
              maxzoom: 14
            })

            map.setTerrain({ source: 'mapbox-dem', exaggeration: 1.5 })
          }}
        >
          {camera && (
            <Source
              id='camera'
              type='geojson'
              data={{
                type: 'Feature',
                geometry: {
                  type: 'Point',
                  coordinates: [camera.lon, camera.lat]
                },
                properties: {
                  name: 'Camera'
                }
              }}
            >
              <Layer
                id='camera-layer'
                type='circle'
                paint={{
                  'circle-radius': 5,
                  'circle-color': '#ff0000'
                }}
              />
            </Source>
          )}

          {polygon && polygon.length > 0 && camera && (
            <Source
              id='polygon'
              type='geojson'
              data={{
                type: 'Feature',
                geometry: {
                  type: 'Polygon',
                  coordinates: [[
                    [camera.lon, camera.lat],     // 0 — камера
                    ...polygon,                   // граница (должна быть [lon,lat])
                    [camera.lon, camera.lat]      // замыкаем полигон
                  ]]
                },
                properties: { name: 'Polygon' }
              }}
            >
              <Layer
                id='polygon-layer'
                type='fill'
                paint={{
                  'fill-color': '#00ff00',
                  'fill-opacity': 0.5
                }}
              />
            </Source>
          )}

        </Map>
      </div>
    </>
  )
}

export default App
