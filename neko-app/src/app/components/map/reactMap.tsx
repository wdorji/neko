"use client"

import * as React from "react";
import mapboxgl, { maxParallelImageRequests, LngLat, GeoJSONSourceRaw, MapboxGeoJSONFeature, Popup, Map } from "mapbox-gl";
import { Feature, FeatureCollection } from "geojson";
import "mapbox-gl/dist/mapbox-gl.css";
import * as turf from '@turf/turf'
import { Stack, Progress, Text } from '@chakra-ui/react';

import gm from '/Users/wangdrakdorji/Desktop/heruka/neko/neko-app/public/data/gm.json'
import pt from '/Users/wangdrakdorji/Desktop/heruka/neko/neko-app/public/data/pt.json'
import sd from '/Users/wangdrakdorji/Desktop/heruka/neko/neko-app/public/data/sd.json'
import gmRoute from '/Users/wangdrakdorji/Desktop/heruka/neko/neko-app/public/geojson/gm.json'
import ptRoute from '/Users/wangdrakdorji/Desktop/heruka/neko/neko-app/public/geojson/pt.json'
import sdRoute from '/Users/wangdrakdorji/Desktop/heruka/neko/neko-app/public/geojson/sd.json'

const nekoPoints = [pt, gm, sd]
const nekoRouteFiles = ["pt.geojson", "gm.geojson", "sd.geojson",]
const nekoRoutes = [ptRoute, gmRoute, sdRoute]
const midpoints = [
  [89.3574723496983,27.488542713270505],
  [90.17388556333793,27.484506705905304],
  [91.3384934113497,27.952633881591126]
]

function MapboxMap() {

  // this is where the map instance will be stored after initialization
  const [map, setMap] = React.useState<mapboxgl.Map>();
  const [userProgress, setProgress] = React.useState(0);

  const [userElevation, setElevavtion] = React.useState(0);
  const [userCompleted, setCompleted] = React.useState(0);
  const [userLeft, setLeft] = React.useState(0);


  const chosenNekoID = +(window.location.toString().split("=")[1])

  const curNekoPoint = nekoPoints[chosenNekoID]
  const curNekoCenter = curNekoPoint[0]
  const endPoint = curNekoPoint[curNekoPoint.length - 1]
  const midPoint = midpoints[chosenNekoID]

  const [curCoord, setCoord] = React.useState(midPoint);

  const curNekoRoute = turf.lineString(nekoRoutes[chosenNekoID]);
  const totalDistance = turf.length(curNekoRoute)

  // React ref to store a reference to the DOM node that will be used
  // as a required parameter `container` when initializing the mapbox-gl
  // will contain `null` by default
  const mapNode = React.useRef(null);


  React.useEffect(() => {
    const node = mapNode.current;
    // if the window object is not found, that means
    // the component is rendered on the server
    // or the dom node is not initialized, then return early
    if (typeof window === "undefined" || node === null) return;

    // otherwise, create a map instance
    const mapboxMap = new mapboxgl.Map({
      container: node,
      accessToken: MAP_ACCESS_TOKEN,
      style: MAP_STYLE,
      center: [+(curNekoCenter.long), +(curNekoCenter.lat)],
      zoom: 13.5,
      pitch: 55,
      bearing: 41,
    });

    const size = 200;

    // This implements `StyleImageInterface`
    // to draw a pulsing dot icon on the map.
    const pulsingDot = {
      width: size,
      height: size,
      data: new Uint8Array(size * size * 4),

      // When the layer is added to the map,
      // get the rendering context for the map canvas.
      onAdd: function () {
        const canvas = document.createElement('canvas');
        canvas.width = this.width;
        canvas.height = this.height;
        this.context = canvas.getContext('2d');
      },

      // Call once before every frame where the icon will be used.
      render: function () {
        const duration = 1000;
        const t = (performance.now() % duration) / duration;

        const radius = (size / 2) * 0.3;
        const outerRadius = (size / 2) * 0.7 * t + radius;
        const context = this.context;

        // Draw the outer circle.
        context.clearRect(0, 0, this.width, this.height);
        context.beginPath();
        context.arc(
          this.width / 2,
          this.height / 2,
          outerRadius,
          0,
          Math.PI * 2
        );
        context.fillStyle = `rgba(255, 200, 200, ${1 - t})`;
        context.fill();

        // Draw the inner circle.
        context.beginPath();
        context.arc(
          this.width / 2,
          this.height / 2,
          radius,
          0,
          Math.PI * 2
        );
        context.fillStyle = 'rgba(255, 100, 100, 1)';
        context.strokeStyle = 'white';
        context.lineWidth = 2 + 4 * (1 - t);
        context.fill();
        context.stroke();

        // Update this image's data with data from the canvas.
        this.data = context.getImageData(
          0,
          0,
          this.width,
          this.height
        ).data;

        // Continuously repaint the map, resulting
        // in the smooth animation of the dot.
        mapboxMap.triggerRepaint();

        // Return `true` to let the map know that the image was updated.
        return true;
      }
    };

    function findDistanceAlongRoute(inputCoord) {


      const snapped1 = turf.nearestPointOnLine(curNekoRoute, inputCoord);
      const snapped2 = turf.nearestPointOnLine(curNekoRoute, [+(endPoint.long), +(endPoint.lat)]);

      const distance = Math.abs(snapped1.properties.location - snapped2.properties.location);

      // console.log('total distance left: ', distance.toFixed(1));
      const completed = totalDistance - distance
      // console.log('total distance complete: ', completed.toFixed(1));
      // console.log('total progress: ', ((completed/totalDistance)*100).toFixed(1));


      setLeft(+(distance.toFixed(1)))
      setCompleted(+(completed.toFixed(1)))
      setProgress(+((completed / totalDistance) * 100).toFixed(1))
    }

    function updateUserStats() {

      const nearestPoint = turf.nearestPointOnLine(curNekoRoute, midPoint).geometry.coordinates

      findDistanceAlongRoute(nearestPoint)
      mapboxMap.jumpTo({ center: [curCoord[0], curCoord[1]] , zoom: 16})


    }
    setInterval(updateUserStats, 10000);

    

    mapboxMap.on('style.load', () => {

      mapboxMap.addLayer({
        id: 'route',
        type: 'line',
        source: {
          type: "geojson",
          data: "/geojson/" + nekoRouteFiles[chosenNekoID],

        },
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': 'cyan',
          'line-width': 5,
          'line-opacity': 0.75
        }
      });

      mapboxMap.addSource('mapbox-dem', {
        'type': 'raster-dem',
        'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
        'tileSize': 512,
        'maxzoom': 14
      });
      mapboxMap.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.5 });
      // getRoute(nestStart, nestEnd, true)
      mapboxMap.addImage('pulsing-dot', pulsingDot, { pixelRatio: 2 });

      mapboxMap.addSource('dot-point', {
        'type': 'geojson',
        'data': {
          'type': 'FeatureCollection',
          'features': [
            {
              'type': 'Feature',
              'geometry': {
                'type': 'Point',
                'coordinates': midPoint// icon position [lng, lat]
              }
            }
          ] 
        } as FeatureCollection
      });
      mapboxMap.addLayer({
        'id': 'layer-with-pulsing-dot',
        'type': 'symbol',
        'source': 'dot-point',
        'layout': {
          'icon-image': 'pulsing-dot'
        }
      });


    });



    function addPopup(long: number, lat: number, imgPath: string, title: string, description: string, markerType: string) {

      var el = document.createElement('div');
      el.id = markerType;
      el.addEventListener('click', function (e) {
        e.stopPropagation();
        openNav(title, imgPath, description);
      });
      // create the marker
      new mapboxgl.Marker(el)
        .setLngLat(new LngLat(long, lat))
        // .setPopup(popup) // sets a popup on this marker
        .addTo(mapboxMap);


    }


    for (let item of curNekoPoint) {
      addPopup(+(item.long), +(item.lat), item.imgPath, item.title, item.description, item.markerType)
    }
    

    setMap(mapboxMap);

    return () => {
      mapboxMap.remove();
    };
    
    

  }, []);

  function openNav(curTitle: string, curImgPath: string, curDesc: string) {
    document.getElementById("mySidebar").style.width = "500px";
    document.getElementById("sidebarContent").innerHTML = `
    
    <h1 style="color: white; font-weight: 900;padding-left: 20px;">${curTitle}</h1>
    <h1 style="color: white; font-weight: 900;"></h1>
    <div class="spacer"></div>
    <img src=${curImgPath} alt="" />
    <div class="sidebar-box">
    <p>${curDesc}</p>
  </div>
    
    `;
  }

  function closeNav() {
    document.getElementById("mySidebar").style.width = "0";
  }

  return <>
    <div id="mySidebar" className="sidebar">
      <a href="javascript:void(0)" className="closebtn" onClick={closeNav}>×</a>
      <div id="sidebarContent" className="sidebar-content">
      </div>
    </div>
    <Stack spacing={1}>

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <Progress colorScheme='cyan' height='30px' width="95%" value={userProgress} hasStripe isAnimated />
      </div>
      <Text>You have completed {userProgress}% of your Nekor!</Text>
      <Text>You walked a total of {userCompleted} km and have {userLeft} km left for completion.</Text>
    </Stack>
    <div ref={mapNode} style={{ width: "100%", height: "80%" }} />

  </>;
}

export default MapboxMap