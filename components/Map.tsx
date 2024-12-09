"use dom";
import { useDOMImperativeHandle, type DOMImperativeFactory } from "expo/dom";
import React, { forwardRef, useEffect, useRef } from "react";
import { MapComponent, MapTypes } from "@neshan-maps-platform/mapbox-gl-react";
import nmp_mapboxgl, { Marker, Map } from "@neshan-maps-platform/mapbox-gl";
// import polyline from "@mapbox/polyline";
import "@/global.css";
import "@neshan-maps-platform/mapbox-gl/dist/NeshanMapboxGl.css";
// example of response data from direction-API v4
// request URL : https://api.neshan.org/v4/direction?type=car&origin=35.700785062128666,51.38881156907395&destination=35.703189177622946,51.3908984545814&alternative=false

var exampleResponse = {
  routes: [
    {
      overview_polyline: {
        points: "cy{xEa{sxHCyEr@}FIi@MWi@Um@L[l@A^{Jr@",
      },
      legs: [
        {
          summary: "میدان انقلاب اسلامی - کارگر شمالی",
          distance: {
            value: 555.0,
            text: "۵۷۵ متر",
          },
          duration: {
            value: 99.0,
            text: "۲ دقیقه",
          },
          steps: [
            {
              name: "آزادی",
              instruction: "در جهت شرق در آزادی قرار بگیرید",
              bearing_after: 88,
              type: "depart",
              distance: {
                value: 197.0,
                text: "۲۰۰ متر",
              },
              duration: {
                value: 35.0,
                text: "۱ دقیقه",
              },
              polyline: "cy{xEa{sxHAkBAmBDa@BKHs@BWD]J{@",
              start_location: [51.388811, 35.70082],
            },
            {
              name: "کارگر شمالی",
              instruction: "در میدان انقلاب اسلامی، از خروجی سوم، خارج شوید",
              rotaryName: "میدان انقلاب اسلامی",
              bearing_after: 111,
              type: "rotary",
              modifier: "straight",
              exit: 3,
              distance: {
                value: 146.0,
                text: "۱۵۰ متر",
              },
              duration: {
                value: 38.0,
                text: "۱ دقیقه",
              },
              polyline: "}w{xEohtxHDSBUCUESEKGKSOUEW@UJORKXAN?N",
              start_location: [51.390956, 35.700632],
            },
            {
              name: "",
              instruction: "به مسیر خود ادامه دهید",
              bearing_after: 354,
              type: "exit rotary",
              modifier: "right",
              exit: 3,
              distance: {
                value: 212.0,
                text: "۲۲۵ متر",
              },
              duration: {
                value: 39.0,
                text: "۱ دقیقه",
              },
              polyline: "a|{xEuitxH_ADaBLO@{BRmAH",
              start_location: [51.391154, 35.701293],
            },
            {
              name: "کارگر شمالی",
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
              polyline: "}g|xEahtxH",
              start_location: [51.390885, 35.703188],
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
  const center = props.center;
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

    // const exampleResponse = {
    //   routes: [
    //     {
    //       overview_polyline: {
    //         points: "cy{xEa{sxHCyEr@}FIi@MWi@Um@L[l@A^{Jr@",
    //       },
    //       legs: [
    //         {
    //           summary: "میدان انقلاب اسلامی - کارگر شمالی",
    //           distance: {
    //             value: 555.0,
    //             text: "۵۷۵ متر",
    //           },
    //           duration: {
    //             value: 99.0,
    //             text: "۲ دقیقه",
    //           },
    //           steps: [
    //             {
    //               name: "آزادی",
    //               instruction: "در جهت شرق در آزادی قرار بگیرید",
    //               bearing_after: 88,
    //               type: "depart",
    //               distance: {
    //                 value: 197.0,
    //                 text: "۲۰۰ متر",
    //               },
    //               duration: {
    //                 value: 35.0,
    //                 text: "۱ دقیقه",
    //               },
    //               polyline: "cy{xEa{sxHAkBAmBDa@BKHs@BWD]J{@",
    //               start_location: [51.388811, 35.70082],
    //             },
    //             {
    //               name: "کارگر شمالی",
    //               instruction:
    //                 "در میدان انقلاب اسلامی، از خروجی سوم، خارج شوید",
    //               rotaryName: "میدان انقلاب اسلامی",
    //               bearing_after: 111,
    //               type: "rotary",
    //               modifier: "straight",
    //               exit: 3,
    //               distance: {
    //                 value: 146.0,
    //                 text: "۱۵۰ متر",
    //               },
    //               duration: {
    //                 value: 38.0,
    //                 text: "۱ دقیقه",
    //               },
    //               polyline: "}w{xEohtxHDSBUCUESEKGKSOUEW@UJORKXAN?N",
    //               start_location: [51.390956, 35.700632],
    //             },
    //             {
    //               name: "",
    //               instruction: "به مسیر خود ادامه دهید",
    //               bearing_after: 354,
    //               type: "exit rotary",
    //               modifier: "right",
    //               exit: 3,
    //               distance: {
    //                 value: 212.0,
    //                 text: "۲۲۵ متر",
    //               },
    //               duration: {
    //                 value: 39.0,
    //                 text: "۱ دقیقه",
    //               },
    //               polyline: "a|{xEuitxH_ADaBLO@{BRmAH",
    //               start_location: [51.391154, 35.701293],
    //             },
    //             {
    //               name: "کارگر شمالی",
    //               instruction: "در مقصد قرار دارید",
    //               bearing_after: 0,
    //               type: "arrive",
    //               distance: {
    //                 value: 0.0,
    //                 text: "",
    //               },
    //               duration: {
    //                 value: 0.0,
    //                 text: "",
    //               },
    //               polyline: "}g|xEahtxH",
    //               start_location: [51.390885, 35.703188],
    //             },
    //           ],
    //         },
    //       ],
    //     },
    //   ],
    // };

    // const routes = [];
    // const points = [];

    // for (let k = 0; k < exampleResponse.routes.length; k++) {
    //   for (let j = 0; j < exampleResponse.routes[k].legs.length; j++) {
    //     for (
    //       let i = 0;
    //       i < exampleResponse.routes[k].legs[j].steps.length;
    //       i++
    //     ) {
    //       const step = exampleResponse.routes[k].legs[j].steps[i]["polyline"];
    //       const point =
    //         exampleResponse.routes[k].legs[j].steps[i]["start_location"];

    //       const route = polyline.decode(step, 5);

    //       route.map((item) => {
    //         item.reverse();
    //       });

    //       routes.push(route);
    //       points.push(point);
    //     }
    //   }
    // }

    // const routeObj = {
    //   type: "FeatureCollection",
    //   features: [
    //     {
    //       type: "Feature",
    //       geometry: {
    //         type: "MultiLineString",
    //         coordinates: routes,
    //       },
    //     },
    //   ],
    // };

    // const pointsObj = {
    //   type: "FeatureCollection",
    //   features: [
    //     {
    //       type: "Feature",
    //       geometry: {
    //         type: "MultiPoint",
    //         coordinates: points,
    //       },
    //     },
    //   ],
    // };

    neshanMap.on("load", function () {
      // neshanMap.addSource("route", {
      //   type: "geojson",
      //   data: routeObj,
      // });
      // neshanMap.addSource("points1", {
      //   type: "geojson",
      //   data: pointsObj,
      // });
      // neshanMap.addLayer({
      //   id: "route-line",
      //   type: "line",
      //   source: "route",
      //   layout: {
      //     "line-join": "round",
      //     "line-cap": "round",
      //   },
      //   paint: {
      //     "line-color": "#250ECD",
      //     "line-width": 9,
      //   },
      // });
      // neshanMap.addLayer({
      //   id: "points1",
      //   type: "circle",
      //   source: "points1",
      //   paint: {
      //     "circle-color": "#9fbef9",
      //     "circle-stroke-color": "#FFFFFF",
      //     "circle-stroke-width": 2,
      //     "circle-radius": 5,
      //   },
      // });
    });
  };
  const userMarker = useRef<Marker>();

  useDOMImperativeHandle(
    ref,
    () => ({
      getToUserLocation: () => {
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

  // useEffect(() => {
  //   if (center && center[0]) {
  //   }
  // }, [center]);
  useEffect(() => {
    mapRef.current.on("load", () => {
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
