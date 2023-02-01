import {
  cameraButton,
  cameraOptions,
  canvas,
  fileInput,
  imgFile,
  logData,
  logs,
  maxHeight,
  maxWidth,
  points,
  sendButton,
  trackingButton,
  urlServer,
  video,
} from "./consts.js";

import { init, setCursor, setWay, setMetka } from "./map.js";
import {
  convertPolarToDecart,
  getNewPositonPolar,
  getRangePolar,
  LatLonToMercator,
  calcDistanceBetween,
} from "./math.js";
import * as THREE from "./threejs.js";

let myMap;
let cursor;
let cursor2;
let metka;

ymaps.ready(() => {
  myMap = init();

  const lat1 = 59.950449;
  const lon1 = 30.370843;
  const lat2 = 59.951273;
  const lon2 = 30.372373;

  myMap.setCenter([lat1, lon1], 15);

  cursor = setCursor(myMap, lat1, lon1, 0);
  cursor(lat1, lon1, 0);
  setMetka(myMap, { lat: lat2, lon: lon2 });
  const result = calcDistanceBetween(
    { lat: lat1, lon: lon1 },
    { lat: lat2, lon: lon2 }
  );
  cursor2 = setCursor(myMap, lat1, lon1, result.angle);
  cursor2(lat1, lon1, result.angle);
  
  // const radius = 6367250;
  // const vec1 = new THREE.Vector3(...calcPosFromLatLonRad(lat1, lon1, radius));
  // const vec2 = new THREE.Vector3(...calcPosFromLatLonRad(lat2, lon2, radius));

  
  
});

function calcPosFromLatLonRad(lat, lon, radius) {
  // Рабочая функция для перевод из полярных координат в декартовы
  var phi = (90 - lat) * (Math.PI / 180);
  var theta = (lon + 180) * (Math.PI / 180);

  let x = -(radius * Math.sin(phi) * Math.cos(theta));
  let z = radius * Math.sin(phi) * Math.sin(theta);
  let y = radius * Math.cos(phi);

  return [x, y, 0];
}
