/* eslint-disable no-unused-vars */
import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-measure/dist/leaflet-measure.css";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import "leaflet-measure";
import "leaflet-control-geocoder";

const MapCustom = () => {
  const mapRef = useRef(null); // Referencia al div donde irá el mapa

  useEffect(() => {
    if (!mapRef.current) return;

    const map = L.map(mapRef.current, {
      center: [40.4168, -3.7038],
      zoom: 16,
      maxZoom: 19, // Valor inicial
    });

    const osmLayer = L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        maxZoom: 19,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }
    );

    const satelliteLayer = L.tileLayer(
      "//server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      {
        maxZoom: 20,
        attribution: '&copy; <a href="https://www.arcgis.com/">ArcGIS</a>',
      }
    );

    osmLayer.addTo(map);

    const measureControl = new L.Control.Measure({
      primaryLengthUnit: "meters",
      secondaryLengthUnit: "kilometers",
      activeColor: "#ff0000",
      completedColor: "#0000ff",
    });
    measureControl.addTo(map);

    const geocoder = L.Control.geocoder({
      position: "topleft",
      defaultMarkGeocode: false,
    })
      .on("markgeocode", (e) => {
        const center = e.geocode.center;
        const latlng = L.latLng(center.lat, center.lng);
        const marker = L.marker([center.lat, center.lng]).addTo(map);
        marker
          .bindPopup(
            "<b>Dirección:</b> " +
              e.geocode.name +
              "<br><b>Coordenadas:</b> " +
              "<b>Lat:</b> " +
              latlng.lat.toFixed(6) +
              ", " +
              "<b>Lon:</b> " +
              latlng.lng.toFixed(6)
          )
          .openPopup();
        map.setView(center, 16);
      })
      .addTo(map);

    const baseLayers = {
      "Vista normal": osmLayer,
      "Vista satelital": satelliteLayer,
    };

    L.control.layers(baseLayers).addTo(map);

    map.on("baselayerchange", (e) => {
      if (e.name === "Vista satelital") {
        map.setMaxZoom(20);
      } else {
        map.setMaxZoom(19);
      }
    });

    return () => {
      map.remove();
    };
  }, []);

  return (
    <div
      ref={mapRef}
      style={{ height: "60vh", width: "100%", margin: "10px" }}
    ></div>
  );
};

export default MapCustom;
