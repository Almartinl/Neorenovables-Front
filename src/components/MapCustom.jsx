import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-measure/dist/leaflet-measure.css";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import "leaflet-measure";
import "leaflet-control-geocoder";

const MapCustom = ({ direccion, poblacion }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current) return;

    if (!mapInstance.current) {
      mapInstance.current = L.map(mapRef.current, {
        center: [40.4168, -3.7038], // Madrid por defecto
        zoom: 16,
        maxZoom: 19,
      });

      const osmLayer = L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
          maxZoom: 19,
          attribution: "&copy; OpenStreetMap contributors",
        }
      ).addTo(mapInstance.current);

      const satelliteLayer = L.tileLayer(
        "//server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        {
          maxZoom: 20,
          attribution: "&copy; ArcGIS",
        }
      );

      L.control
        .layers({ "Vista normal": osmLayer, "Vista satelital": satelliteLayer })
        .addTo(mapInstance.current);

      // Control de medición
      const measureControl = new L.Control.Measure({
        primaryLengthUnit: "meters",
        secondaryLengthUnit: "kilometers",
        activeColor: "#ff0000",
        completedColor: "#0000ff",
      });
      measureControl.addTo(mapInstance.current);
    }

    return () => {
      mapInstance.current.remove();
      mapInstance.current = null;
    };
  }, []);

  // 🚀 Buscar dirección cuando cambia
  useEffect(() => {
    if (direccion && mapInstance.current) {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        direccion + " " + poblacion
      )}`;

      fetch(url)
        .then((res) => res.json())
        .then((data) => {
          if (data.length > 0) {
            const { lat, lon, display_name } = data[0];
            const center = [parseFloat(lat), parseFloat(lon)];

            console.log("Ubicación encontrada:", center);

            // Eliminar marcador anterior si existe
            if (markerRef.current) {
              mapInstance.current.removeLayer(markerRef.current);
            }

            // Agregar nuevo marcador
            markerRef.current = L.marker(center)
              .addTo(mapInstance.current)
              .bindPopup(
                `<b>Dirección:</b> ${display_name}<br><b>Lat:</b> ${lat}<br><b>Lon:</b> ${lon}`
              )
              .openPopup();

            // Centrar mapa en la ubicación encontrada
            mapInstance.current.setView(center, 16);
          } else {
            console.warn(
              "No se encontraron resultados para la dirección ingresada."
            );
          }
        })
        .catch((err) =>
          console.error("Error en la búsqueda de dirección:", err)
        );
    }
  }, [direccion, poblacion]); // Se ejecuta cada vez que cambia `direccion`

  return <div ref={mapRef} style={{ height: "80vh", width: "100vw" }} />;
};

export default MapCustom;
