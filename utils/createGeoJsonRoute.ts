import polyline from "@mapbox/polyline";

const routeAndPointGEOjson = (
  res: RoutingResponse
): { pointsObj: GeoJson; routeObj: GeoJson } => {
  const routes: [number, number][][] = [];
  const points: [number, number][] = [];

  for (let k = 0; k < res.routes.length; k++) {
    for (let j = 0; j < res.routes[k].legs.length; j++) {
      for (let i = 0; i < res.routes[k].legs[j].steps.length; i++) {
        const step = res.routes[k].legs[j].steps[i]["polyline"];
        // console.log(step,"\n\n")
        const point = res.routes[k].legs[j].steps[i]["start_location"];

        const route = polyline.decode(step, 5);
        // console.log(route);
        route.map((item) => {
          item.reverse();
        });

        routes.push(route);
        points.push(point);
      }
    }
  }
  const routeObj: GeoJson = {
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

  const pointsObj: GeoJson = {
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
  return { pointsObj, routeObj };
};

export default routeAndPointGEOjson;
