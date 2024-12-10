"use dom";
import { useDOMImperativeHandle, type DOMImperativeFactory } from "expo/dom";
import React, { forwardRef, useEffect, useRef } from "react";
import { MapComponent, MapTypes } from "@neshan-maps-platform/mapbox-gl-react";
import nmp_mapboxgl, { Marker, Map } from "@neshan-maps-platform/mapbox-gl";
import polyline from "@mapbox/polyline";
import "@/global.css";
import "@neshan-maps-platform/mapbox-gl/dist/NeshanMapboxGl.css";
// example of response data from direction-API v4
// request URL : https://api.neshan.org/v4/direction?type=car&origin=35.700785062128666,51.38881156907395&destination=35.703189177622946,51.3908984545814&alternative=false

var exampleResponse = {
  routes: [
    {
      overview_polyline: {
        points: "ccmxEwujxHFdAxR_BNRNQg@mPoAePJ{BOsDaAoC}AkOPUB_@MWWIoByJcDoI",
      },
      legs: [
        {
          summary: "برادران شکری - ورامینی",
          distance: {
            value: 1798.0,
            text: "۲ کیلومتر",
          },
          duration: {
            value: 220.0,
            text: "۴ دقیقه",
          },
          steps: [
            {
              name: "نهم",
              instruction: "در جهت غرب در نهم قرار بگیرید",
              bearing_after: 263,
              type: "depart",
              distance: {
                value: 32.0,
                text: "۳۲ متر",
              },
              duration: {
                value: 18.0,
                text: "کمتر از ۱ دقیقه",
              },
              polyline: "ccmxEwujxHFdA",
              start_location: [51.341882, 35.625615],
            },
            {
              name: "برادران شکری",
              instruction: "به سمت برادران شکری، به چپ بپیچید",
              bearing_after: 172,
              type: "turn",
              modifier: "left",
              distance: {
                value: 354.0,
                text: "۳۷۵ متر",
              },
              duration: {
                value: 67.0,
                text: "۱ دقیقه",
              },
              polyline: "{bmxEqsjxHNAz@IXARCv@GXCv@GNAtGi@d@Eh@G",
              start_location: [51.341533, 35.62558],
            },
            {
              name: "ورامینی",
              instruction: "در ورامینی، از خروجیِ دوم، خارج شوید",
              bearing_after: 262,
              type: "roundabout",
              modifier: "right",
              exit: 2,
              distance: {
                value: 33.0,
                text: "۳۳ متر",
              },
              duration: {
                value: 5.0,
                text: "کمتر از ۱ دقیقه",
              },
              polyline: "aolxEqvjxH?D@B@B@BB@D?B?DA@CBE?E?I",
              start_location: [51.342014, 35.622412],
            },
            {
              name: "",
              instruction: "به مسیر خود ادامه دهید",
              bearing_after: 81,
              type: "exit roundabout",
              modifier: "straight",
              exit: 2,
              distance: {
                value: 551.0,
                text: "۵۷۵ متر",
              },
              duration: {
                value: 58.0,
                text: "۱ دقیقه",
              },
              polyline: "anlxEyvjxHCSAYGiBGsCCgAMoD_@_F_@yEOkBHiB",
              start_location: [51.342046, 35.622254],
            },
            {
              name: "ورامینی",
              instruction: "در میدان مادر، از خروجی اول، خارج شوید",
              rotaryName: "میدان مادر",
              bearing_after: 105,
              type: "rotary",
              modifier: "straight",
              exit: 1,
              distance: {
                value: 124.0,
                text: "۱۲۵ متر",
              },
              duration: {
                value: 11.0,
                text: "کمتر از ۱ دقیقه",
              },
              polyline: "oqlxEm|kxH@QE_AC}@Eu@CUCMGKMM",
              start_location: [51.34807, 35.622804],
            },
            {
              name: "",
              instruction: "به مسیر خود ادامه دهید",
              bearing_after: 56,
              type: "exit rotary",
              modifier: "slight right",
              exit: 1,
              distance: {
                value: 285.0,
                text: "۳۰۰ متر",
              },
              duration: {
                value: 32.0,
                text: "۱ دقیقه",
              },
              polyline: "{rlxEqdlxH[u@G[e@yEw@qH",
              start_location: [51.349371, 35.623017],
            },
            {
              name: "ورامینی",
              instruction: "در میدان باران، از خروجی دوم، خارج شوید",
              rotaryName: "میدان باران",
              bearing_after: 151,
              type: "rotary",
              modifier: "right",
              exit: 2,
              distance: {
                value: 58.0,
                text: "۷۵ متر",
              },
              duration: {
                value: 9.0,
                text: "کمتر از ۱ دقیقه",
              },
              polyline: "}vlxEowlxHFCDGBIBI?I?KCICGEEECECEAE?",
              start_location: [51.352397, 35.623672],
            },
            {
              name: "",
              instruction: "به مسیر خود ادامه دهید",
              bearing_after: 71,
              type: "exit rotary",
              modifier: "right",
              exit: 2,
              distance: {
                value: 360.0,
                text: "۳۷۵ متر",
              },
              duration: {
                value: 47.0,
                text: "۱ دقیقه",
              },
              polyline: "mwlxEgzlxHs@iE{@oDwAgEAEu@_BSa@",
              start_location: [51.35284, 35.623754],
            },
            {
              name: "ورامینی",
              instruction: "در مقصد قرار دارید",
              bearing_after: 0,
              type: "arrive",
              distance: {
                value: 0.0,
                text: "",
              },
              duration: {
                value: 0.0,
                text: "",
              },
              polyline: "a`mxEqpmxH",
              start_location: [51.356413, 35.625131],
            },
          ],
        },
      ],
    },
  ],
};

export interface MapComponentRef extends DOMImperativeFactory {
  getToUserLocation: () => void;
  resetBearing: () => void;
}
export default forwardRef<MapComponentRef, object>(function Map(
  props: { center: [number, number] },
  ref
) {
  const { center } = props;
  console.log(center);
  const mapRef = useRef<Map>(null);
  const mapSetter = (neshanMap) => {
    // Add custom marker 1
    mapRef.current = neshanMap;

    // Create a popup

    // const popup = new nmp_mapboxgl.Popup({ offset: 25 }).setText(
    //   "با نگه داشتن مارکر می‌توانید آن را روی نقشه جابه‌جا کنید"
    // );

    // // Add custom marker 2

    // new nmp_mapboxgl.Marker({
    //   color: "#00F955",
    //   draggable: true,
    // })
    //   .setPopup(popup)
    //   .setLngLat([51.4055941, 35.70019216])
    //   .addTo(neshanMap)
    //   .togglePopup();

    // Add some custom markers using geojson

    // const geojson: GeoJson = {
    //   type: "FeatureCollection",
    //   features: [
    //     {
    //       type: "Feature",
    //       geometry: {
    //         type: "Point",
    //         coordinates: [51.338057, 35.699736],
    //       },
    //       properties: {
    //         title: "میدان آزادی",
    //         description:
    //           "نمایش مارکر با آیکون اختصاصی <br/> مختصات:<br/> [51.338057 , 35.699736]",
    //       },
    //     },
    //     {
    //       type: "Feature",
    //       geometry: {
    //         type: "Point",
    //         coordinates: [51.375265, 35.74472],
    //       },
    //       properties: {
    //         title: "برج میلاد",
    //         description: "مختصات:<br/> [51.375265 , 35.744720]",
    //       },
    //     },
    //   ],
    // };

    // for (const feature of geojson.features) {
    //   new nmp_mapboxgl.Marker()
    //     .setLngLat(feature.geometry.coordinates)
    //     .setPopup(
    //       new nmp_mapboxgl.Popup({ offset: 40 }).setHTML(
    //         `<h3>${feature.properties.title}</h3><p>${feature.properties.description}</p>`
    //       )
    //     )
    //     .addTo(neshanMap)
    //     .togglePopup();
    // }

    // Add route

    const routes = [];
    const points = [];

    for (let k = 0; k < exampleResponse.routes.length; k++) {
      for (let j = 0; j < exampleResponse.routes[k].legs.length; j++) {
        for (
          let i = 0;
          i < exampleResponse.routes[k].legs[j].steps.length;
          i++
        ) {
          const step = exampleResponse.routes[k].legs[j].steps[i]["polyline"];
          const point =
            exampleResponse.routes[k].legs[j].steps[i]["start_location"];

          const route = polyline.decode(step, 5);
          
          route.map((item) => {
            item.reverse();
          });

          routes.push(route);
          points.push(point);
        }
      }
    }

    const routeObj = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: {
            type: "MultiLineString",
            coordinates: routes,
          },
        },
      ],
    };

    const pointsObj = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: {
            type: "MultiPoint",
            coordinates: points,
          },
        },
      ],
    };

    neshanMap.on("load", function () {
      neshanMap.addSource("route", {
        type: "geojson",
        data: routeObj,
      });
      neshanMap.addSource("points1", {
        type: "geojson",
        data: pointsObj,
      });
      neshanMap.addLayer({
        id: "route-line",
        type: "line",
        source: "route",
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#250ECD",
          "line-opacity":0.5,
          "line-width": 9,
        },
      });
      neshanMap.addLayer({
        id: "points1",
        type: "circle",
        source: "points1",
        paint: {
          "circle-color": "#9fbef9",
          "circle-opacity":0.5,
          "circle-stroke-color": "#FFFFFF",
          "circle-stroke-opacity":0.5,
          "circle-stroke-width": 2,
          "circle-radius": 5,
        },
      });
    });
  };
  const userMarker = useRef<Marker>();

  useDOMImperativeHandle(
    ref,
    () => ({
      getToUserLocation: (center: [number, number]) => {
        mapRef.current.flyTo({
          center,
          zoom: 16,
          bearing: 0,
        });
        userMarker.current?.setLngLat(center);
      },
      resetBearing: () => {
        mapRef.current.flyTo({
          bearing: 0,
        });
      },
    }),
    []
  );

  useEffect(() => {
    mapRef.current.on("load", () => {
      mapRef.current.on("click", (e) => {
        console.log(`A click event has occurred at ${e.lngLat}`);
      });

      const el = document.createElement("div");
      el.innerHTML = ` <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" fill="#ffffff" viewBox="0 0 385.656 414.406">
                      <path
                          d="M64,414L219,73c16.8-28.3,57.727-27.685,74,0,4.306,9.285,156,343,156,343s7.734,52.626-50,50c-5.452-1.59-122-53-122-53s-0.227-93.146,0-112c-3.18-23.624-38.157-25.983-43,0-0.3,13.489,0,112,0,112L116,466S58.929,474.563,64,414Z"
                          transform="translate(-63.688 -52)" />
                  </svg>`;
      el.className = "w-10 h-10 flex items-center justify-center";

      userMarker.current = new nmp_mapboxgl.Marker(el, {
        draggable: false,
      })
        .setLngLat(center || [0, 0])
        .addTo(mapRef.current);
    });
  }, []);
  return (
    <MapComponent
      className="w-full h-screen"
      options={{
        mapKey: process.env.EXPO_PUBLIC_NESHAN_ACCESS_TOKEN_MAP!,
        mapType: MapTypes.neshanVectorNight,
        zoom: 16,
        maxZoom: 20,
        center: center,
        mapTypeControllerOptions: { show: true, position: "bottom-left" },
        poi: true,
        traffic: true,
      }}
      mapSetter={mapSetter}
    />
  );
});
