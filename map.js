import { points } from "./consts.js";
import { getNewPositonPolar } from "./math.js";

export function init() {
  // Создание карты.
  const result = new ymaps.Map("map", {
    // Координаты центра карты.
    // Порядок по умолчанию: «широта, долгота».
    // Чтобы не определять координаты центра карты вручную,
    // воспользуйтесь инструментом Определение координат.
    center: [55.76, 37.64],
    // Уровень масштабирования. Допустимые значения:
    // от 0 (весь мир) до 19.
    zoom: 18,
  });

  // for (const item of points) {
  //   console.log(item);
  //   const myPlacemark = new ymaps.GeoObject({
  //     geometry: {
  //       type: "Point",
  //       coordinates: [item.lat, item.lon],
  //     },
  //   });
  //   result.geoObjects.add(myPlacemark);
  // }
  return result;
}

export function setMetka(myMap, coord) {
  console.log(myMap);
  const myPlacemark = new ymaps.GeoObject({
    geometry: {
      type: "Point",
      coordinates: [coord.lat, coord.lon],
    },
  });
  console.log(myPlacemark);
  myMap.geoObjects.add(myPlacemark);
}

export function setPoint(myMap, lat, lon, dist, angle) {
  let arrow;

  return function (lat, lon, dist, angle) {
    myMap.geoObjects.remove(arrow);
    let newCoord = getNewPositonPolar({
      lat: lat,
      lon: lon,
      dist: 30,
      angle: angle,
    });
    arrow = new ymaps.GeoObject({
      geometry: {
        type: "LineString",
        coordinates: [
          [lat, lon],
          [newCoord.lat, newCoord.lon],
        ],
      },
    });
    myMap.geoObjects.add(arrow);
  };
}

export function setCursor(myMap, latCreate, lonCreate, angleCreate) {
  let metka;
  // let lonV = lon;
  return function (lat = latCreate, lon = lonCreate, angle = angleCreate) {
    myMap.geoObjects.remove(metka);

    metka = new ymaps.Placemark(
      [lat, lon],
      {
        hintContent: "Мой велосипед",
      },
      {
        iconLayout: ymaps.templateLayoutFactory.createClass(
          [
            '<div style="transform:rotate({{options.rotate}}deg);">',
            '{% include "default#image" %}',
            "</div>",
          ].join("")
        ),
        iconRotate: angle,
        iconImageHref: "up.svg",
        // Размеры метки.
        iconImageSize: [50, 25],
        // Смещение левого верхнего угла иконки относительно
        // её "ножки" (точки привязки).
        iconImageOffset: [-25, -25],
      }
    );
    myMap.geoObjects.add(metka);
  };
}
