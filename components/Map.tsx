"use dom";
import { useDOMImperativeHandle, type DOMImperativeFactory } from "expo/dom";
import React, { forwardRef, useEffect, useRef, useState } from "react";
import { MapComponent, MapTypes } from "@neshan-maps-platform/mapbox-gl-react";
import nmp_mapboxgl from "@neshan-maps-platform/mapbox-gl";
import "@/global.css";
import "@neshan-maps-platform/mapbox-gl/dist/NeshanMapboxGl.css";

const el = document.createElement("div");
el.innerHTML = ` <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" fill="#ffffff" viewBox="0 0 385.656 414.406">
                <path
                    d="M64,414L219,73c16.8-28.3,57.727-27.685,74,0,4.306,9.285,156,343,156,343s7.734,52.626-50,50c-5.452-1.59-122-53-122-53s-0.227-93.146,0-112c-3.18-23.624-38.157-25.983-43,0-0.3,13.489,0,112,0,112L116,466S58.929,474.563,64,414Z"
                    transform="translate(-63.688 -52)" />
            </svg>`;
el.className = "w-10 h-10 flex items-center justify-center";

export interface MapComponentRef extends DOMImperativeFactory {
  getToUserLocation: (lngLat: LngLat) => void;
  setTargetMarkerPos: (lngLat: LngLat) => void;
  changeRoute: (routeObj: GeoJson, pointsObj: GeoJson) => void;
  resetBearing: () => void;
}

export default forwardRef<MapComponentRef, object>(function Map(
  {
    center,
    selectLocation,
    isLocationFinded,
    resetUserLocation,
  }: {
    center: LngLat;
    selectLocation: (lngLat: LngLat) => void;
    resetUserLocation: () => void;
    isLocationFinded: boolean;
  },
  ref: any
) {
  const [userLocation, setUserLocation] = useState<LngLat>(center);
  const mapRef = useRef<any>(null);
  const userMarker = useRef<any>();
  const targetMarker = useRef<any>();

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
          "line-color": "#250ECD",
          "line-opacity": 0.5,
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
      getToUserLocation: (lngLat: LngLat) => {
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
      setTargetMarkerPos:(lngLat:LngLat)=>{
        if(targetMarker.current){
          targetMarker.current.setLngLat(lngLat)
        }else{
          targetMarker.current = new nmp_mapboxgl.Marker({
            color: "#AAAAAA",
            draggable: false,
          })
            .setLngLat(lngLat)
            .addTo(mapRef.current);
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
  useEffect(() => {
    mapRef.current.on("load", () => {
      resetUserLocation();

      mapRef.current.on(
        "click",
        async ({ lngLat }: { lngLat: { lng: number; lat: number } }) => {
          selectLocation([lngLat.lng, lngLat.lat]);
        }
      );
      
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
