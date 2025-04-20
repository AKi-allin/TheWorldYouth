const map = L.map('map', {
    zoomControl: false, // We'll add custom zoom controls
    scrollWheelZoom: true, // Enable smooth scrolling
    touchZoom: true, // Enable touch zoom
    doubleClickZoom: true // Enable double click zoom
}).setView([10, 0], 2.5); // Slightly zoomed out view

L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19
}).addTo(map);

L.control.zoom({
    position: 'bottomright'
}).addTo(map);

const modal = document.getElementById('stream-modal');
const closeButton = document.querySelector('.close-button');
const streamsList = document.getElementById('streams-list');

closeButton.addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

function createCustomIcon(thumbnailUrl) {
    return L.divIcon({
        className: 'stream-marker',
        html: `<img src="${thumbnailUrl}" alt="Stream Thumbnail">`,
        iconSize: [60, 60],
        iconAnchor: [30, 30]
    });
}

fetch('/api/streams')
    .then(response => response.json())
    .then(data => {
        data.streams.forEach(stream => {
            const customIcon = createCustomIcon(stream.thumbnail_url);
            const marker = L.marker(stream.coordinates, { icon: customIcon }).addTo(map);
            
            marker.bindTooltip(`<strong>${stream.title}</strong><br>${stream.location}`, {
                direction: 'top',
                offset: [0, -10],
                className: 'custom-tooltip'
            });
            
            marker.on('click', () => {
                showStreamsInArea(stream.coordinates, data.streams);
            });
        });
        
        map.on('click', (e) => {
            const clickedCoordinates = [e.latlng.lat, e.latlng.lng];
            showStreamsInArea(clickedCoordinates, data.streams);
        });
    })
    .catch(error => {
        console.error('Error fetching streams data:', error);
    });

function showStreamsInArea(coordinates, allStreams) {
    streamsList.innerHTML = '';
    
    const streamsWithDistance = allStreams.map(stream => {
        const distance = calculateDistance(coordinates, stream.coordinates);
        return { ...stream, distance };
    });
    
    streamsWithDistance.sort((a, b) => a.distance - b.distance);
    
    streamsWithDistance.forEach(stream => {
        const streamElement = document.createElement('div');
        streamElement.className = 'stream-item';
        streamElement.innerHTML = `
            <div class="stream-item-thumbnail">
                <img src="${stream.thumbnail_url}" alt="${stream.title}">
            </div>
            <div class="stream-item-info">
                <h3>${stream.title}</h3>
                <p>${stream.location}</p>
                <p class="distance">${Math.round(stream.distance)} km away</p>
            </div>
        `;
        
        streamElement.addEventListener('click', () => {
            window.location.href = `/stream/${stream.id}`;
        });
        
        streamsList.appendChild(streamElement);
    });
    
    modal.style.display = 'block';
}

function calculateDistance(coords1, coords2) {
    const R = 6371; // Earth's radius in km
    const dLat = (coords2[0] - coords1[0]) * Math.PI / 180;
    const dLon = (coords2[1] - coords1[1]) * Math.PI / 180;
    
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(coords1[0] * Math.PI / 180) * Math.cos(coords2[0] * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    
    return distance;
}
