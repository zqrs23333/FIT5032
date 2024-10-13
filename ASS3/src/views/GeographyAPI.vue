<template>
    <div id="app">
      <div id="map-container">
        <div class="search-bar">
          <div ref="map" id="map" aria-label="Interactive map with navigation"></div>
          <label for="search" class="sr-only">Search for a place</label>
          <input 
            v-model="searchQuery" 
            id="search"
            type="text" 
            placeholder="Search for a place..." 
            aria-label="Search for a place"
          />
          <button @click="searchPlace" aria-label="Search for the entered place">Search</button>
        </div>
        <div ref="map" id="map" aria-label="Interactive map"></div>
        <button @click="locateUser" class="locate-button" aria-label="Locate your current location">Locate your location</button>
        <div class="info" v-if="infoText" role="status" aria-live="polite">
          {{ infoText }}
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import mapboxgl from 'mapbox-gl';
  import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions';
  import '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css';
  
  mapboxgl.accessToken = 'pk.eyJ1IjoiamFja3poYW5nMTMyMTMiLCJhIjoiY20yNnVjNzQwMGN6cTJrcHZoanNtNnZyZSJ9.nbc5BiKn6CC4DTsfq6lL3w';
  
  export default {
    data() {
      return {
        map: null,
        searchQuery: '',
        marker: null,
        start: null,
        end: null,
        infoText: '',
        directions: null,
      };
    },
    mounted() {
      this.initializeMap();
    },
    methods: {
      initializeMap() {
        this.map = new mapboxgl.Map({
          container: this.$refs.map,
          style: 'mapbox://styles/mapbox/streets-v11',
          center: [114.0579, 22.5431],
          zoom: 12,
        });
  
        // 初始化 Directions 控件
        this.directions = new MapboxDirections({
          accessToken: mapboxgl.accessToken,
          unit: 'metric',
          profile: 'mapbox/driving',
        });
  
        // 将 Directions 控件添加到地图
        this.map.addControl(this.directions, 'top-left');
      },
      locateUser() {
        if ('geolocation' in navigator) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { longitude, latitude } = position.coords;
              this.map.flyTo({ center: [longitude, latitude], zoom: 15 });
              this.setUserLocationMarker(longitude, latitude);
              
              // 设置为导航起点
              this.directions.setOrigin([longitude, latitude]);
            },
            (error) => {
              console.error('Error locating', error);
            }
          );
        } else {
          alert('Geolocation is not supported by your browser.');
        }
      },
      setUserLocationMarker(lng, lat) {
        if (this.marker) this.marker.remove();
        this.marker = new mapboxgl.Marker({ color: 'blue' })
          .setLngLat([lng, lat])
          .addTo(this.map);
      },
      searchPlace() {
        if (!this.searchQuery) return;
  
        fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${this.searchQuery}.json?access_token=${mapboxgl.accessToken}`)
          .then((response) => response.json())
          .then((data) => {
            if (data.features.length === 0) {
              alert('No results found.');
              return;
            }
            const location = data.features[0];
            const [lng, lat] = location.geometry.coordinates;
  
            if (this.marker) this.marker.remove();
            this.marker = new mapboxgl.Marker().setLngLat([lng, lat]).addTo(this.map);
            this.map.flyTo({ center: [lng, lat], zoom: 12 });
  
            this.infoText = `${location.text}: ${location.place_name}`;
  
            // 设置为导航终点
            this.directions.setDestination([lng, lat]);
          })
          .catch((error) => console.error('Error:', error));
      },
    },
  };
  </script>
  
  <style>
  #map-container {
    position: relative;
    height: 500px;
  }
  
  #map {
    width: 100%;
    height: 100%;
  }
  
  .search-bar {
    position: absolute;
    top: 10px;
    left: 10px;
    background: white;
    padding: 10px;
    border-radius: 5px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
    z-index: 1;
  }
  
  .locate-button {
    position: absolute;
    top: 10px;
    right: 10px;
    background: #007bff;
    color: white;
    border: none;
    padding: 10px;
    border-radius: 5px;
    cursor: pointer;
    z-index: 1;
  }
  
  .locate-button:hover {
    background: #0056b3;
  }
  
  .info {
    position: absolute;
    bottom: 10px;
    left: 10px;
    background: rgba(255, 255, 255, 0.9);
    padding: 10px;
    border-radius: 5px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
  }
  </style>