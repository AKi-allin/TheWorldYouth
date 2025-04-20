console.log("Direct icons script is loading!");

document.addEventListener('DOMContentLoaded', function() {
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

    Promise.all([
        fetch('/api/atlas-data').then(response => response.json()),
        fetch('/static/data/country-icons.json').then(response => response.json())
    ])
    .then(([atlasData, iconData]) => {
        console.log('Atlas data loaded:', atlasData);
        console.log('Icon data loaded:', iconData);
        
        document.getElementById('regions-count').textContent = atlasData.visited_regions.length;
        document.getElementById('conversations-count').textContent = atlasData.conversations.length;
        
        const allConversations = atlasData.conversations;
        
        atlasData.conversations.forEach(conversation => {
            addConversationMarker(conversation, iconData, map);
        });
        
        const countriesToShow = [
            { name: "United States", coordinates: [37.0902, -95.7129] },
            { name: "Canada", coordinates: [56.1304, -106.3468] },
            { name: "Mexico", coordinates: [23.6345, -102.5528] },
            { name: "Brazil", coordinates: [-14.2350, -51.9253] },
            { name: "Argentina", coordinates: [-38.4161, -63.6167] },
            { name: "United Kingdom", coordinates: [55.3781, -3.4360] },
            { name: "France", coordinates: [46.2276, 2.2137] },
            { name: "Germany", coordinates: [51.1657, 10.4515] },
            { name: "Italy", coordinates: [41.8719, 12.5674] },
            { name: "Spain", coordinates: [40.4637, -3.7492] },
            { name: "Russia", coordinates: [61.5240, 105.3188] },
            { name: "China", coordinates: [35.8617, 104.1954] },
            { name: "Japan", coordinates: [36.2048, 138.2529] },
            { name: "South Korea", coordinates: [35.9078, 127.7669] },
            { name: "India", coordinates: [20.5937, 78.9629] },
            { name: "Australia", coordinates: [-25.2744, 133.7751] },
            { name: "New Zealand", coordinates: [-40.9006, 174.8860] },
            { name: "Egypt", coordinates: [26.8206, 30.8025] },
            { name: "South Africa", coordinates: [-30.5595, 22.9375] },
            { name: "Nigeria", coordinates: [9.0820, 8.6753] }
        ];
        
        countriesToShow.forEach(country => {
            addCountryIcon(country.name, country.coordinates, iconData, map, allConversations);
        });
        
        map.on('click', (e) => {
            const lat = e.latlng.lat;
            const lng = e.latlng.lng;
            
            const nearbyConversations = findNearbyConversations([lat, lng], allConversations);
            
            if (nearbyConversations.length > 0) {
                showNearbyConversations([lat, lng], nearbyConversations, conversationsList, modal);
            }
        });
    })
    .catch(error => {
        console.error('Error fetching data:', error);
        alert('Error fetching data: ' + error.message);
    });
});

function addCountryIcon(countryName, coordinates, iconData, map, allConversations) {
    console.log(`Adding icon for ${countryName}`);
    
    const iconConfig = iconData[countryName] || iconData['default'];
    console.log(`Using icon for ${countryName}: ${iconConfig.icon}`);
    
    const iconHtml = `
        <div class="country-icon" style="background-color: ${iconConfig.color}">
            <span class="icon-emoji">${iconConfig.icon}</span>
            <span class="icon-label">${countryName}</span>
        </div>
    `;
    
    const customIcon = L.divIcon({
        className: 'country-icon-wrapper',
        html: iconHtml,
        iconSize: [60, 60],
        iconAnchor: [30, 30]
    });
    
    const iconMarker = L.marker(coordinates, { 
        icon: customIcon,
        zIndexOffset: -1000 // Place behind conversation markers
    }).addTo(map);
    
    iconMarker.on('click', () => {
        showConversationsInRegion(countryName, allConversations);
    });
}

function addConversationMarker(conversation, countryIcons, map) {
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
}

function getInitials(name) {
    return name.split(' ')
        .map(part => part.charAt(0))
        .join('')
        .toUpperCase()
        .substring(0, 2);
}

function showConversationsInRegion(regionName, allConversations, conversationsList, modal) {
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

function showNearbyConversations(coordinates, conversations, conversationsList, modal) {
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
