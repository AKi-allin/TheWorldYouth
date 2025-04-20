console.log("Illustrated map script is loading!");

document.addEventListener('DOMContentLoaded', function() {
    const mapContainer = document.getElementById('map');
    mapContainer.innerHTML = ''; // Clear any existing content
    mapContainer.classList.add('illustrated-map-container');
    
    const svgMap = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svgMap.setAttribute("viewBox", "0 0 1000 500");
    svgMap.setAttribute("preserveAspectRatio", "xMidYMid meet");
    svgMap.classList.add("illustrated-world-map");
    mapContainer.appendChild(svgMap);
    
    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    svgMap.appendChild(defs);
    
    const gradient = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient");
    gradient.setAttribute("id", "ocean-gradient");
    gradient.setAttribute("x1", "0%");
    gradient.setAttribute("y1", "0%");
    gradient.setAttribute("x2", "100%");
    gradient.setAttribute("y2", "100%");
    defs.appendChild(gradient);
    
    const stop1 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
    stop1.setAttribute("offset", "0%");
    stop1.setAttribute("stop-color", "#a6e1fa");
    gradient.appendChild(stop1);
    
    const stop2 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
    stop2.setAttribute("offset", "100%");
    stop2.setAttribute("stop-color", "#0078d4");
    gradient.appendChild(stop2);
    
    const ocean = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    ocean.setAttribute("width", "100%");
    ocean.setAttribute("height", "100%");
    ocean.setAttribute("fill", "url(#ocean-gradient)");
    svgMap.appendChild(ocean);
    
    const wavesGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
    wavesGroup.classList.add("ocean-waves");
    svgMap.appendChild(wavesGroup);
    
    for (let i = 0; i < 5; i++) {
        const wave = document.createElementNS("http://www.w3.org/2000/svg", "path");
        const yPos = 100 + i * 80;
        wave.setAttribute("d", `M0,${yPos} Q250,${yPos-20} 500,${yPos} T1000,${yPos}`);
        wave.setAttribute("fill", "none");
        wave.setAttribute("stroke", "rgba(255,255,255,0.3)");
        wave.setAttribute("stroke-width", "2");
        wave.classList.add("wave");
        wave.style.animationDelay = `${i * 0.5}s`;
        wavesGroup.appendChild(wave);
    }
    
    fetch('/static/data/continents.svg')
        .then(response => response.text())
        .then(svgData => {
            const parser = new DOMParser();
            const svgDoc = parser.parseFromString(svgData, "image/svg+xml");
            const paths = svgDoc.querySelectorAll("path");
            
            const continentsGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
            continentsGroup.classList.add("continents");
            svgMap.appendChild(continentsGroup);
            
            paths.forEach((path, index) => {
                const continentPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
                continentPath.setAttribute("d", path.getAttribute("d"));
                
                const colors = ["#8fd14f", "#ff9e7d", "#ffda8a", "#d0bbff", "#98e3c3", "#ffbad1", "#c4e0f4"];
                continentPath.setAttribute("fill", colors[index % colors.length]);
                
                continentPath.setAttribute("stroke", "#ffffff");
                continentPath.setAttribute("stroke-width", "1");
                continentPath.classList.add("continent");
                continentsGroup.appendChild(continentPath);
            });
            
            loadCountryIconsAndConversations(svgMap);
        })
        .catch(error => {
            console.error('Error loading continents SVG:', error);
            createFallbackWorldMap(svgMap);
        });
    
    mapContainer.addEventListener('click', function(e) {
        const rect = mapContainer.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const svgPoint = svgMap.createSVGPoint();
        svgPoint.x = x;
        svgPoint.y = y;
        const svgCoords = svgPoint.matrixTransform(svgMap.getScreenCTM().inverse());
        
        findNearbyConversationsOnSVG(svgCoords.x, svgCoords.y);
    });
});

function createFallbackWorldMap(svgMap) {
    const continentsGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
    continentsGroup.classList.add("continents");
    svgMap.appendChild(continentsGroup);
    
    addContinentShape(continentsGroup, "M100,120 Q200,80 250,150 Q300,200 200,250 Q150,280 100,250 Q50,200 100,120", "#8fd14f");
    
    addContinentShape(continentsGroup, "M200,280 Q250,300 230,350 Q200,400 150,380 Q120,330 200,280", "#ff9e7d");
    
    addContinentShape(continentsGroup, "M450,120 Q500,100 550,120 Q580,150 550,180 Q500,200 450,180 Q420,150 450,120", "#ffda8a");
    
    addContinentShape(continentsGroup, "M450,200 Q500,180 550,200 Q580,250 550,300 Q500,320 450,300 Q420,250 450,200", "#d0bbff");
    
    addContinentShape(continentsGroup, "M600,120 Q700,80 800,120 Q850,180 800,250 Q700,300 600,250 Q550,180 600,120", "#98e3c3");
    
    addContinentShape(continentsGroup, "M800,300 Q850,280 900,300 Q920,330 900,360 Q850,380 800,360 Q780,330 800,300", "#ffbad1");
    
    loadCountryIconsAndConversations(svgMap);
}

function addContinentShape(group, pathData, color) {
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", pathData);
    path.setAttribute("fill", color);
    path.setAttribute("stroke", "#ffffff");
    path.setAttribute("stroke-width", "1");
    path.classList.add("continent");
    group.appendChild(path);
}

function loadCountryIconsAndConversations(svgMap) {
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
        
        const iconsGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
        iconsGroup.classList.add("country-icons");
        svgMap.appendChild(iconsGroup);
        
        const markersGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
        markersGroup.classList.add("conversation-markers");
        svgMap.appendChild(markersGroup);
        
        atlasData.conversations.forEach(conversation => {
            addConversationMarkerToSVG(conversation, iconData, markersGroup);
        });
        
        const countriesToShow = [
            { name: "United States", coordinates: [200, 150] },
            { name: "Canada", coordinates: [180, 100] },
            { name: "Mexico", coordinates: [170, 200] },
            { name: "Brazil", coordinates: [220, 330] },
            { name: "Argentina", coordinates: [200, 380] },
            { name: "United Kingdom", coordinates: [450, 120] },
            { name: "France", coordinates: [460, 140] },
            { name: "Germany", coordinates: [480, 130] },
            { name: "Italy", coordinates: [490, 150] },
            { name: "Spain", coordinates: [440, 160] },
            { name: "Russia", coordinates: [600, 120] },
            { name: "China", coordinates: [700, 180] },
            { name: "Japan", coordinates: [800, 170] },
            { name: "South Korea", coordinates: [760, 180] },
            { name: "India", coordinates: [650, 220] },
            { name: "Australia", coordinates: [800, 330] },
            { name: "New Zealand", coordinates: [850, 370] },
            { name: "Egypt", coordinates: [520, 220] },
            { name: "South Africa", coordinates: [500, 320] },
            { name: "Nigeria", coordinates: [460, 250] }
        ];
        
        countriesToShow.forEach(country => {
            addCountryIconToSVG(country.name, country.coordinates, iconData, iconsGroup, allConversations);
        });
    })
    .catch(error => {
        console.error('Error fetching data:', error);
        alert('Error fetching data: ' + error.message);
    });
}

function addCountryIconToSVG(countryName, coordinates, iconData, iconsGroup, allConversations) {
    console.log(`Adding icon for ${countryName}`);
    
    const iconConfig = iconData[countryName] || iconData['default'];
    console.log(`Using icon for ${countryName}: ${iconConfig.icon}`);
    
    const iconGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
    iconGroup.classList.add("country-icon-group");
    iconGroup.setAttribute("transform", `translate(${coordinates[0]}, ${coordinates[1]})`);
    iconsGroup.appendChild(iconGroup);
    
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("r", "20");
    circle.setAttribute("fill", iconConfig.color);
    circle.setAttribute("stroke", "#ffffff");
    circle.setAttribute("stroke-width", "2");
    circle.classList.add("icon-background");
    iconGroup.appendChild(circle);
    
    const iconText = document.createElementNS("http://www.w3.org/2000/svg", "text");
    iconText.setAttribute("x", "0");
    iconText.setAttribute("y", "0");
    iconText.setAttribute("text-anchor", "middle");
    iconText.setAttribute("dominant-baseline", "middle");
    iconText.setAttribute("font-size", "16");
    iconText.textContent = iconConfig.icon;
    iconGroup.appendChild(iconText);
    
    const labelText = document.createElementNS("http://www.w3.org/2000/svg", "text");
    labelText.setAttribute("x", "0");
    labelText.setAttribute("y", "30");
    labelText.setAttribute("text-anchor", "middle");
    labelText.setAttribute("font-size", "10");
    labelText.setAttribute("fill", "#ffffff");
    labelText.setAttribute("opacity", "0");
    labelText.classList.add("icon-label");
    labelText.textContent = countryName;
    iconGroup.appendChild(labelText);
    
    iconGroup.addEventListener('mouseenter', function() {
        circle.setAttribute("r", "22");
        labelText.setAttribute("opacity", "1");
    });
    
    iconGroup.addEventListener('mouseleave', function() {
        circle.setAttribute("r", "20");
        labelText.setAttribute("opacity", "0");
    });
    
    iconGroup.addEventListener('click', function() {
        showConversationsInRegion(countryName, allConversations);
    });
    
    circle.style.animation = "pulse 3s infinite";
}

function addConversationMarkerToSVG(conversation, countryIcons, markersGroup) {
    const markerGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
    
    const svgX = (conversation.coordinates[1] + 180) * (1000 / 360);
    const svgY = (90 - conversation.coordinates[0]) * (500 / 180);
    
    markerGroup.setAttribute("transform", `translate(${svgX}, ${svgY})`);
    markerGroup.classList.add("conversation-marker-group");
    markersGroup.appendChild(markerGroup);
    
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("r", "15");
    circle.setAttribute("fill", "#ffffff");
    circle.setAttribute("stroke", "#6a11cb");
    circle.setAttribute("stroke-width", "3");
    markerGroup.appendChild(circle);
    
    if (conversation.photo_url) {
        const innerCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        innerCircle.setAttribute("r", "12");
        innerCircle.setAttribute("fill", "#6a11cb");
        markerGroup.appendChild(innerCircle);
    }
    
    const initialsText = document.createElementNS("http://www.w3.org/2000/svg", "text");
    initialsText.setAttribute("x", "0");
    initialsText.setAttribute("y", "0");
    initialsText.setAttribute("text-anchor", "middle");
    initialsText.setAttribute("dominant-baseline", "middle");
    initialsText.setAttribute("font-size", "10");
    initialsText.setAttribute("fill", "#ffffff");
    initialsText.setAttribute("font-weight", "bold");
    initialsText.textContent = getInitials(conversation.name);
    markerGroup.appendChild(initialsText);
    
    markerGroup.addEventListener('mouseenter', function() {
        circle.setAttribute("r", "17");
        showTooltip(markerGroup, conversation, countryIcons);
    });
    
    markerGroup.addEventListener('mouseleave', function() {
        circle.setAttribute("r", "15");
        hideTooltip(markerGroup);
    });
    
    markerGroup.addEventListener('click', function() {
        window.location.href = `/conversation/${conversation.id}`;
    });
    
    markerGroup.style.animation = "bounce 1s infinite alternate";
}

function showTooltip(markerGroup, conversation, countryIcons) {
    const existingTooltip = markerGroup.querySelector('.marker-tooltip');
    if (existingTooltip) {
        markerGroup.removeChild(existingTooltip);
    }
    
    const tooltipGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
    tooltipGroup.classList.add("marker-tooltip");
    tooltipGroup.setAttribute("transform", "translate(0, -30)");
    markerGroup.appendChild(tooltipGroup);
    
    const tooltipBg = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    tooltipBg.setAttribute("x", "-60");
    tooltipBg.setAttribute("y", "-40");
    tooltipBg.setAttribute("width", "120");
    tooltipBg.setAttribute("height", "40");
    tooltipBg.setAttribute("rx", "5");
    tooltipBg.setAttribute("ry", "5");
    tooltipBg.setAttribute("fill", "white");
    tooltipBg.setAttribute("stroke", "#6a11cb");
    tooltipBg.setAttribute("stroke-width", "1");
    tooltipGroup.appendChild(tooltipBg);
    
    const nameText = document.createElementNS("http://www.w3.org/2000/svg", "text");
    nameText.setAttribute("x", "0");
    nameText.setAttribute("y", "-25");
    nameText.setAttribute("text-anchor", "middle");
    nameText.setAttribute("font-size", "10");
    nameText.setAttribute("font-weight", "bold");
    nameText.setAttribute("fill", "#6a11cb");
    nameText.textContent = conversation.name;
    tooltipGroup.appendChild(nameText);
    
    const countryText = document.createElementNS("http://www.w3.org/2000/svg", "text");
    countryText.setAttribute("x", "0");
    countryText.setAttribute("y", "-12");
    countryText.setAttribute("text-anchor", "middle");
    countryText.setAttribute("font-size", "8");
    countryText.textContent = conversation.country;
    tooltipGroup.appendChild(countryText);
}

function hideTooltip(markerGroup) {
    const tooltip = markerGroup.querySelector('.marker-tooltip');
    if (tooltip) {
        markerGroup.removeChild(tooltip);
    }
}

function getInitials(name) {
    return name.split(' ')
        .map(part => part.charAt(0))
        .join('')
        .toUpperCase()
        .substring(0, 2);
}

function showConversationsInRegion(regionName, allConversations) {
    const modal = document.getElementById('conversation-modal');
    const conversationsList = document.getElementById('conversations-list');
    
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

function findNearbyConversationsOnSVG(svgX, svgY, allConversations) {
    const modal = document.getElementById('conversation-modal');
    const conversationsList = document.getElementById('conversations-list');
    
    const lat = 90 - (svgY * (180 / 500));
    const lng = (svgX * (360 / 1000)) - 180;
    
    const nearbyConversations = findNearbyConversations([lat, lng], allConversations);
    
    if (nearbyConversations.length > 0) {
        showNearbyConversations([lat, lng], nearbyConversations, conversationsList, modal);
    }
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

const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
    }
    
    @keyframes bounce {
        0% { transform: translateY(0); }
        100% { transform: translateY(-5px); }
    }
    
    @keyframes wave {
        0% { transform: translateX(0); }
        100% { transform: translateX(20px); }
    }
    
    .wave {
        animation: wave 10s linear infinite;
    }
    
    .illustrated-map-container {
        width: 100%;
        height: 100%;
        overflow: hidden;
        position: relative;
    }
    
    .illustrated-world-map {
        width: 100%;
        height: 100%;
    }
    
    .continent {
        transition: all 0.3s ease;
    }
    
    .continent:hover {
        filter: brightness(1.1);
        transform: translate(-2px, -2px);
    }
`;
document.head.appendChild(style);
