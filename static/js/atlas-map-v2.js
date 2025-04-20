console.log("Atlas map v2 script is loading!");

const map = L.map('map', {
    zoomControl: false,
    scrollWheelZoom: true,
    touchZoom: true,
    doubleClickZoom: true
}).setView([20, 0], 2.5); // Slightly zoomed out view of the world

L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19
}).addTo(map);

L.control.zoom({
    position: 'bottomright'
}).addTo(map);

let countryIcons = {};
const modal = document.getElementById('conversation-modal');
const closeButton = document.querySelector('.close-button');
const conversationsList = document.getElementById('conversations-list');

closeButton.addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

let regionsLayer;
const markers = [];

let allConversations = [];

window.onerror = function(message, source, lineno, colno, error) {
    console.error('JavaScript Error:', message, 'at', source, 'line', lineno);
    alert('JavaScript Error: ' + message + ' at line ' + lineno);
    return true;
};

Promise.all([
    fetch('/api/atlas-data').then(response => response.json()),
    fetch('/static/data/country-icons.json').then(response => response.json())
])
    .then(([atlasData, iconData]) => {
        console.log('Atlas data loaded:', atlasData);
        console.log('Icon data loaded:', iconData);
        
        countryIcons = iconData;
        
        document.getElementById('regions-count').textContent = atlasData.visited_regions.length;
        document.getElementById('conversations-count').textContent = atlasData.conversations.length;
        
        allConversations = atlasData.conversations;
        
        atlasData.conversations.forEach(conversation => {
            addConversationMarker(conversation);
        });
        
        fetch('https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson')
            .then(response => response.json())
            .then(geojson => {
                console.log('GeoJSON loaded, features count:', geojson.features.length);
                
                regionsLayer = L.geoJSON(geojson, {
                    style: feature => styleRegion(feature, atlasData.visited_regions),
                    onEachFeature: (feature, layer) => {
                        layer.on('click', () => {
                            const regionName = feature.properties.ADMIN;
                            showConversationsInRegion(regionName, atlasData.conversations);
                        });
                        
                        layer.on('mouseover', () => {
                            layer.setStyle({
                                weight: 2,
                                fillOpacity: 0.7
                            });
                        });
                        
                        layer.on('mouseout', () => {
                            regionsLayer.resetStyle(layer);
                        });
                        
                        const regionName = feature.properties.ADMIN;
                        const center = layer.getBounds().getCenter();
                        
                        console.log(`Country from GeoJSON: ${regionName}`);
                        
                        let lookupName = regionName;
                        if (regionName === "United States of America") {
                            lookupName = "United States";
                            console.log(`Mapped ${regionName} to ${lookupName}`);
                        }
                        
                        const iconData = countryIcons[lookupName] || countryIcons['default'];
                        console.log(`Using icon for ${lookupName}: ${iconData.icon}`);
                        
                        const iconHtml = `
                            <div class="country-icon" style="background-color: ${iconData.color}">
                                <span class="icon-emoji">${iconData.icon}</span>
                                <span class="icon-label">${regionName}</span>
                            </div>
                        `;
                        
                        const customIcon = L.divIcon({
                            className: 'country-icon-wrapper',
                            html: iconHtml,
                            iconSize: [60, 60],
                            iconAnchor: [30, 30]
                        });
                        
                        const iconMarker = L.marker([center.lat, center.lng], { 
                            icon: customIcon,
                            zIndexOffset: -1000 // Place behind conversation markers
                        }).addTo(map);
                        
                        iconMarker.on('click', () => {
                            showConversationsInRegion(regionName, allConversations);
                        });
                    }
                }).addTo(map);
                
                regionsLayer.bringToBack();
            })
            .catch(error => {
                console.error('Error loading GeoJSON:', error);
                alert('Error loading GeoJSON: ' + error.message);
            });
    })
    .catch(error => {
        console.error('Error fetching data:', error);
        alert('Error fetching data: ' + error.message);
    });

function styleRegion(feature, visitedRegions) {
    const regionName = feature.properties.ADMIN;
    const isVisited = visitedRegions.includes(regionName);
    
    return {
        fillColor: isVisited ? '#8e44ad' : '#f8f9fa',
        weight: 1,
        opacity: 1,
        color: '#ffffff',
        fillOpacity: isVisited ? 0.6 : 0.2,
        className: isVisited ? 'visited-region-pulse' : ''
    };
}

function addConversationMarker(conversation) {
    const userAvatar = localStorage.getItem('userAvatar') || '/static/images/avatars/default-avatar.png';
    
    const markerHtml = conversation.photo_url 
        ? `<img src="${conversation.photo_url.startsWith('http') ? conversation.photo_url : '/static/' + conversation.photo_url}" alt="${conversation.name}">`
        : `<div class="marker-initials">${getInitials(conversation.name)}</div>`;
    
    const customIcon = L.divIcon({
        className: 'conversation-marker animated',
        html: `
            <div class="marker-frame">
                ${markerHtml}
            </div>
        `,
        iconSize: [50, 50],
        iconAnchor: [25, 25]
    });
    
    const marker = L.marker(conversation.coordinates, { icon: customIcon }).addTo(map);
    
    const countryIcon = countryIcons[conversation.country] 
        ? countryIcons[conversation.country].icon 
        : countryIcons['default'].icon;
        
    marker.bindTooltip(`
        <div class="enhanced-tooltip">
            <div class="tooltip-header">
                <span class="country-emoji">${countryIcon}</span>
                <strong>${conversation.name}</strong>
            </div>
            <div class="tooltip-location">${conversation.country}</div>
            <div class="tooltip-quote">"${conversation.quote.substring(0, 30)}${conversation.quote.length > 30 ? '...' : ''}"</div>
        </div>
    `, {
        direction: 'top',
        offset: [0, -5],
        className: 'custom-tooltip'
    });
    
    marker.on('click', () => {
        window.location.href = `/conversation/${conversation.id}`;
    });
    
    markers.push(marker);
}

function getInitials(name) {
    return name.split(' ')
        .map(part => part.charAt(0))
        .join('')
        .toUpperCase()
        .substring(0, 2);
}

function showConversationsInRegion(regionName, allConversations) {
    conversationsList.innerHTML = '';
    
    const regionConversations = allConversations.filter(conv => 
        conv.region === regionName || conv.country === regionName
    );
    
    document.querySelector('.modal-title').textContent = `Conversations in ${regionName}`;
    
    if (regionConversations.length > 0) {
        regionConversations.forEach(conversation => {
            const conversationElement = document.createElement('div');
            conversationElement.className = 'conversation-item';
            
            const photoHtml = conversation.photo_url 
                ? `<img src="${conversation.photo_url.startsWith('http') ? conversation.photo_url : '/static/' + conversation.photo_url}" alt="${conversation.name}">`
                : `<div class="no-photo"><i class="fas fa-user"></i></div>`;
            
            conversationElement.innerHTML = `
                <div class="conversation-item-photo">
                    ${photoHtml}
                </div>
                <div class="conversation-item-info">
                    <h3>${conversation.name}</h3>
                    <p class="conversation-location">${conversation.country}</p>
                    <p class="conversation-quote">"${conversation.quote.substring(0, 60)}${conversation.quote.length > 60 ? '...' : ''}"</p>
                </div>
            `;
            
            conversationElement.addEventListener('click', () => {
                window.location.href = `/conversation/${conversation.id}`;
            });
            
            conversationsList.appendChild(conversationElement);
        });
    } else {
        conversationsList.innerHTML = `
            <div class="empty-region">
                <i class="fas fa-globe-americas"></i>
                <p>No conversations in ${regionName} yet.</p>
                <a href="/add-conversation" class="button primary">Add Conversation</a>
            </div>
        `;
    }
    
    modal.style.display = 'block';
}

map.on('click', (e) => {
    const lat = e.latlng.lat;
    const lng = e.latlng.lng;
    
    fetch('/api/atlas-data')
        .then(response => response.json())
        .then(data => {
            const nearbyConversations = findNearbyConversations([lat, lng], data.conversations);
            
            if (nearbyConversations.length > 0) {
                showNearbyConversations([lat, lng], nearbyConversations);
            }
        })
        .catch(error => {
            console.error('Error fetching conversations:', error);
        });
});

function findNearbyConversations(coordinates, allConversations) {
    const MAX_DISTANCE = 2000; // km
    
    return allConversations
        .map(conversation => {
            const distance = calculateDistance(coordinates, conversation.coordinates);
            return { ...conversation, distance };
        })
        .filter(conversation => conversation.distance <= MAX_DISTANCE)
        .sort((a, b) => a.distance - b.distance);
}

function showNearbyConversations(coordinates, conversations) {
    conversationsList.innerHTML = '';
    
    document.querySelector('.modal-title').textContent = 'Nearby Conversations';
    
    conversations.forEach(conversation => {
        const conversationElement = document.createElement('div');
        conversationElement.className = 'conversation-item';
        
        const photoHtml = conversation.photo_url 
            ? `<img src="${conversation.photo_url.startsWith('http') ? conversation.photo_url : '/static/' + conversation.photo_url}" alt="${conversation.name}">`
            : `<div class="no-photo"><i class="fas fa-user"></i></div>`;
        
        conversationElement.innerHTML = `
            <div class="conversation-item-photo">
                ${photoHtml}
            </div>
            <div class="conversation-item-info">
                <h3>${conversation.name}</h3>
                <p class="conversation-location">${conversation.country}</p>
                <p class="conversation-quote">"${conversation.quote.substring(0, 60)}${conversation.quote.length > 60 ? '...' : ''}"</p>
                <p class="conversation-distance">${Math.round(conversation.distance)} km away</p>
            </div>
        `;
        
        conversationElement.addEventListener('click', () => {
            window.location.href = `/conversation/${conversation.id}`;
        });
        
        conversationsList.appendChild(conversationElement);
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
