import { Vector } from "./vectors.js";

//Преобразование из полярной системы координат в декартовы

export function convertPolarToDecart({ lat, lon }) {
  lat = (lat * Math.PI) / 180;
  lon = (lon * Math.PI) / 180;
  const rEcvator = 6378100;
  const r = 6367250; //6371000;
  //   const realR = Math.cos(lat) * (r - rEcvator) + r;
  return {
    x: r * Math.cos(lat) * Math.cos(lon),
    y: r * Math.cos(lat) * Math.sin(lon),
    z: r * Math.sin(lon),
  };
}

// Вычисление широты и долготы точки, которая удалена от текущей на растояние dist под углом angle
export function getNewPositonPolar(coord = { lat, lon, dist, angle }) {
  // $newlat=sin($lat * PI / 180)*cos($dist * PI / 180)+cos($lat * PI / 180)*sin($dist * PI / 180)*cos($ang * PI / 180);
  // $newlat=$lat+(asin($newlat));

  // let newLat =
  //   Math.sin((coord.lat * Math.PI) / 180) *
  //     Math.cos((coord.dist * Math.PI) / 180) +
  //   Math.cos((coord.lat * Math.PI) / 180) *
  //     Math.sin((coord.dist * Math.PI) / 180) *
  //     Math.cos((coord.angle * Math.PI) / 180);
  // newLat = Math.asin(newLat) * 180 / Math.PI;

  // let newLon =
  //   (Math.sin((coord.dist * Math.PI) / 180) *
  //     Math.sin((coord.angle * Math.PI) / 180)) /
  //   (Math.cos((coord.lat * Math.PI) / 180) *
  //     Math.cos((coord.dist * Math.PI) / 180) -
  //     Math.sin((coord.lat * Math.PI) / 180) *
  //       Math.sin((coord.dist * Math.PI) / 180) *
  //       Math.cos((coord.angle * Math.PI) / 180));
  //       console.log(newLon)
  // newLon = coord.lon + (Math.atan(newLon) * 180 / Math.PI);
  const newLat =
    coord.lat +
    (coord.dist * Math.cos((coord.angle * Math.PI) / 180)) /
      ((6371000 * Math.PI) / 180);
  const newLon =
    coord.lon +
    (coord.dist * Math.sin((coord.angle * Math.PI) / 180)) /
      Math.cos((coord.lat * Math.PI) / 180) /
      ((6371000 * Math.PI) / 180);
  return { lat: newLat, lon: newLon };
}

export function getRangePolar(latFrom, lonFrom, latTo, lonTo) {
  const coordFrom = convertPolarToDecart({ lat: latFrom, lon: lonFrom });
  const coordTo = convertPolarToDecart({ lat: latTo, lon: lonTo });
  const distance = Math.sqrt(
    Math.pow(coordTo.x - coordFrom.x, 2) +
      Math.pow(coordTo.y - coordFrom.y, 2) +
      Math.pow(coordTo.z - coordFrom.z, 2)
  );
  return distance;
}

function getLengthVector(latFrom, lonFrom, latTo, lonTo) {
  const coordFrom = convertPolarToDecart({ lat: latFrom, lon: lonFrom });
  const coordTo = convertPolarToDecart({ lat: latTo, lon: lonTo });
  const v1 = new Vector(coordFrom.x, coordFrom.y, coordFrom.z);
  const diff = {
    x: coordTo.x - coordFrom.x,
    y: coordTo.y - coordFrom.y,
    z: coordTo.z - coordFrom.z,
  };

  return v1;
}

function getDistanceBetweenPoints(
  latitude1,
  longitude1,
  latitude2,
  longitude2
) {
  let theta = longitude1 - longitude2;
  let distance =
    63710 *
    1.1515 *
    (180 / Math.PI) *
    Math.acos(
      Math.sin(latitude1 * (Math.PI / 180)) *
        Math.sin(latitude2 * (Math.PI / 180)) +
        Math.cos(latitude1 * (Math.PI / 180)) *
          Math.cos(latitude2 * (Math.PI / 180)) *
          Math.cos(theta * (Math.PI / 180))
    );

  return Math.round(distance * 1.609344, 2);
}

console.log(getRangePolar(55.759085, 37.626868, 55.756686, 37.630209));
console.log(
  getDistanceBetweenPoints(55.759085, 37.626868, 55.756686, 37.630209)
);

console.log(
  getDistanceBetweenPoints(55.759085, 37.626868, 55.756686, 37.630209)
);

console.log("&&&&&&", convertPolarToDecart({ lat: 55.759085, lon: 37.626868 }));

export function LatLonToMercator(lat, lon) {
  var rMajor = 6378137; //Equatorial Radius, WGS84
  var shift = Math.PI * rMajor;
  var x = (lon * shift) / 180;
  var y = Math.log(Math.tan(((90 + lat) * Math.PI) / 360)) / (Math.PI / 180);
  y = (y * shift) / 180;

  return { X: x, Y: y };
}

export function MercatorToLatLon(mercX, mercY) {
  var rMajor = 6378137; //Equatorial Radius, WGS84
  var shift = Math.PI * rMajor;
  var lon = (mercX / shift) * 180.0;
  var lat = (mercY / shift) * 180.0;
  lat =
    (180 / Math.PI) *
    (2 * Math.atan(Math.exp((lat * Math.PI) / 180.0)) - Math.PI / 2.0);

  return { Lon: lon, Lat: lat };
}

console.log(LatLonToMercator(55.759085, 37.626868));

export function getXYZ(lat, lng, radius) {
  radius = radius || 200;

  var latRads = ((90 - lat) * Math.PI) / 180;
  var lngRads = ((180 - lng) * Math.PI) / 180;

  var x = radius * Math.sin(latRads) * Math.cos(lngRads);
  var y = radius * Math.cos(latRads);
  var z = radius * Math.sin(latRads) * Math.sin(lngRads);

  return { x: x, y: y, z: z };
}

export function getLatLng(vector, radius) {
  radius = radius || 200;

  var latRads = Math.acos(vector.y / radius);
  var lngRads = Math.atan2(vector.z, vector.x);
  var lat = (Math.PI / 2 - latRads) * (180 / Math.PI);
  var lng = (Math.PI - lngRads) * (180 / Math.PI);

  return [lat, lng - 180];
}

console.log(getXYZ(2 * Math.cos(45), 2 * Math.cos(45), 1));

// Расчет расстояния расстояния
export function calcDistanceBetween(coordFrom, coordTo) {
  //Переводим в радианы
  let lat1 = (coordFrom.lat * Math.PI) / 180;
  let long1 = (coordFrom.lon = (coordFrom.lon * Math.PI) / 180);
  let lat2 = (coordTo.lat = (coordTo.lat * Math.PI) / 180);
  let long2 = (coordTo.lon = (coordTo.lon * Math.PI) / 180);
  let rad = 6372795;

  //косинусы и синусы широт и разницы долгот
  let cl1 = Math.cos(lat1);
  let cl2 = Math.cos(lat2);
  let sl1 = Math.sin(lat1);
  let sl2 = Math.sin(lat2);
  let delta = long2 - long1;
  let cdelta = Math.cos(delta);
  let sdelta = Math.sin(delta);

  //вычисления длины большого круга
  let y = Math.sqrt(
    Math.pow(cl2 * sdelta, 2) + Math.pow(cl1 * sl2 - sl1 * cl2 * cdelta, 2)
  );
  let x = sl1 * sl2 + cl1 * cl2 * cdelta;
  let ad = Math.atan2(y, x);
  let dist = ad * rad;

  // вычисление начального азимута
  x = cl1 * sl2 - sl1 * cl2 * cdelta;
  y = sdelta * cl2;
  let z = (Math.atan(-y / x) * 180) / Math.PI;

  if (x < 0) z = z + 180;

  let z2 = ((z + 180) % 360) - 180;
  z2 = -((z2 * Math.PI) / 180);
  let anglerad2 = z2 - 2 * Math.PI * Math.floor(z2 / (2 * Math.PI));
  let angledeg = (anglerad2 * 180) / Math.PI;
  return { dist: dist, angle: angledeg , x:x, y:y, z:z};
}
