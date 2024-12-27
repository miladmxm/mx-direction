"use dom";
import { useDOMImperativeHandle, type DOMImperativeFactory } from "expo/dom";
import React, { forwardRef, useEffect, useRef, useState } from "react";
import { MapComponent, MapTypes } from "@neshan-maps-platform/mapbox-gl-react";
import nmp_mapboxgl from "@neshan-maps-platform/mapbox-gl";
import "@/global.css";
import "@neshan-maps-platform/mapbox-gl/dist/NeshanMapboxGl.css";

const el = document.createElement("div");
el.innerHTML = ` <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" fill="#ffffff" viewBox="0 0 385.656 414.406"><path d="M64,414L219,73c16.8-28.3,57.727-27.685,74,0,4.306,9.285,156,343,156,343s7.734,52.626-50,50c-5.452-1.59-122-53-122-53s-0.227-93.146,0-112c-3.18-23.624-38.157-25.983-43,0-0.3,13.489,0,112,0,112L116,466S58.929,474.563,64,414Z" transform="translate(-63.688 -52)" /></svg>`;
el.className = "w-10 h-10 flex items-center justify-center";

export interface MapComponentRef extends DOMImperativeFactory {
  goToUserLocation: (lngLat: LngLat) => void;
  setTargetMarker: (lngLat: LngLat, id: string) => void;
  addTargetMarker: (lngLat: LngLat, id: string) => void;
  removeMarkerTarget: (id: string) => void;
  changeRoute: (routeObj: GeoJson, pointsObj: GeoJson) => void;
  cleanUpMap: (clearMarker:boolean) => void;
  resetBearing: () => void;
}

export default forwardRef<MapComponentRef, object>(function Map(
  {
    center,
    selectLocationHandler,
    isLocationFinded,
    resetUserLocation,
  }: {
    center: LngLat;
    selectLocationHandler: (lngLat: LngLat) => void;
    resetUserLocation: () => void;
    isLocationFinded: boolean;
    targets: object;
  },
  ref: any
) {
  const [userLocation, setUserLocation] = useState<LngLat>(center);
  const mapRef = useRef<nmp_mapboxgl.Map>(null);
  const userMarker = useRef<any>();
  const targetMarkers = useRef<{ [key: string]: any }>({});

  const setRouteAndPointsInMap = ({
    route,
    point,
  }: {
    route: GeoJson;
    point: GeoJson;
  }) => {
    const routeInMap = mapRef.current.getSource("route");
    const pointsInMap = mapRef.current.getSource("points1");
    if (routeInMap && pointsInMap) {
      routeInMap.setData(route);
      pointsInMap.setData(point);
    } else {
      mapRef.current?.addSource("route", {
        type: "geojson",
        data: route,
      });
      mapRef.current?.addSource("points1", {
        type: "geojson",
        data: point,
      });
      mapRef.current?.addLayer({
        id: "route-line",
        type: "line",
        source: "route",
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#44aaff",
          "line-opacity": 0.7,
          "line-width": 9,
        },
      });
      mapRef.current?.addLayer({
        id: "points1",
        type: "circle",
        source: "points1",
        paint: {
          "circle-color": "#9fbef9",
          "circle-opacity": 0.5,
          "circle-stroke-color": "#FFFFFF",
          "circle-stroke-opacity": 0.5,
          "circle-stroke-width": 2,
          "circle-radius": 5,
        },
      });
    }
  };
  const mapSetter = (neshanMap: any) => {
    mapRef.current = neshanMap;
  };

  useDOMImperativeHandle(
    ref,
    () => ({
      goToUserLocation: (lngLat: LngLat) => {
        setUserLocation(lngLat);
        mapRef.current?.flyTo({
          center: lngLat,
          zoom: 16,
        });
        if (userMarker.current) {
          userMarker.current.setLngLat(lngLat);
        } else {
          userMarker.current = new nmp_mapboxgl.Marker(el, {
            draggable: false,
          })
            .setLngLat(lngLat)
            .addTo(mapRef.current);
        }
      },
      changeRoute: (routeObj: GeoJson, pointsObj: GeoJson) => {
        setRouteAndPointsInMap({ route: routeObj, point: pointsObj });
      },
      cleanUpMap: (clearMarker = true) => {
        if (clearMarker) {
          (Object.values(targetMarkers.current) || []).forEach(
            (targetMarker) => {
              targetMarker.remove();
            }
          );
        }
        if (mapRef.current?.getLayer("points1"))
          mapRef.current?.removeLayer("points1");
        if (mapRef.current?.getLayer("route-line"))
          mapRef.current?.removeLayer("route-line");
        if (mapRef.current?.getSource("route"))
          mapRef.current?.removeSource("route");
        if (mapRef.current?.getSource("points1"))
          mapRef.current?.removeSource("points1");
      },
      setTargetMarker: (lngLat: LngLat, id: string) => {
        if (targetMarkers.current[id]) {
          targetMarkers.current[id]?.setLngLat(lngLat);
        } else {
          targetMarkers.current[id] = new nmp_mapboxgl.Marker({
            color: "#AAAAAA",
            draggable: false,
          })
            .setLngLat(lngLat)
            .addTo(mapRef.current);
        }
      },
      addTargetMarker: (lngLat: LngLat, id: string) => {
        targetMarkers.current[id] = new nmp_mapboxgl.Marker({
          color: "#AAAAAA",
          draggable: false,
        })
          .setLngLat(lngLat)
          .addTo(mapRef.current);
      },
      removeMarkerTarget: (id: string) => {
        if (targetMarkers.current[id]) {
          targetMarkers.current[id]?.remove();
          delete targetMarkers.current[id];
        }
      },
      resetBearing: () => {
        mapRef.current.flyTo({
          bearing: 0,
        });
      },
    }),
    [mapRef.current]
  );
  const timerForSelectTarget = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );
  useEffect(() => {
    mapRef.current.on("load", () => {
      resetUserLocation();

      mapRef.current.on(
        "touchstart",
        async ({ lngLat }: { lngLat: { lng: number; lat: number } }) => {
          cancleSelection();
          timerForSelectTarget.current = setTimeout(() => {
            selectLocationHandler([lngLat.lng, lngLat.lat]);
          }, 1000);
        }
      );
      const cancleSelection = () => {
        if (timerForSelectTarget.current) {
          clearTimeout(timerForSelectTarget.current);
        }
      };
      mapRef.current.on("touchend", cancleSelection);
      mapRef.current.on("touchmove", cancleSelection);
      mapRef.current.on("touchcancel", cancleSelection);
      mapRef.current.on("zoom", cancleSelection);
      mapRef.current.on("move", cancleSelection);
    });
  }, []);
  return (
    <MapComponent
      className="w-full h-screen"
      options={{
        mapKey: process.env.EXPO_PUBLIC_NESHAN_ACCESS_TOKEN_MAP!,
        mapType: MapTypes.neshanVectorNight,
        zoom: isLocationFinded ? 16 : 8,
        maxZoom: 20,
        center: userLocation,
        mapTypeControllerOptions: { show: false, position: "bottom-left" },
        poi: true,
        traffic: true,
      }}
      mapSetter={mapSetter}
    />
  );
});
