import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export function createMap(mapElementId, lat = -6.2, lon = 106.8, zoomLevel = 5) {
  const map = L.map(mapElementId).setView([lat, lon], zoomLevel);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

  return map;
}

export function addMarker(map, lat, lon) {
  const customIcon = L.divIcon({
    className: 'custom-fa-icon',
    html: `<i class="fas fa-map-marker-alt" style="font-size: 32px; color: red;"></i>`,
    iconSize: [32, 32], 
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  const marker = L.marker([lat, lon], { icon: customIcon })
    .addTo(map)
    .bindPopup(`Latitude: ${lat}<br>Longitude: ${lon}`)
    .openPopup();

  return marker;
}
