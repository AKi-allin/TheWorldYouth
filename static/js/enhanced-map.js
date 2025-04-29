/**
 * Enhanced Map Implementation for World Youth Atlas
 * Features:
 * - Zoom functionality
 * - Larger country icons with hover effects
 * - Ocean waves, clouds, and time-based lighting
 * - Travel animations with airplane and passport stamps
 * - Adventure log
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log("Enhanced map script is loading!");
    
    initEnhancedMap();
    
    setupMapControls();
    
    setupTimeLighting();
});

const mapState = {
    zoomLevel: 1,
    minZoom: 0.8,
    maxZoom: 2.5,
    zoomStep: 0.2,
    panning: false,
    lastX: 0,
    lastY: 0,
    translateX: 0,
    translateY: 0
};

function initEnhancedMap() {
    const mapContainer = document.getElementById('map');
    if (!mapContainer) return;
    
    mapContainer.innerHTML = ''; // Clear any existing content
    mapContainer.classList.add('illustrated-map-container');
    
    const svgMap = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svgMap.setAttribute("viewBox", "0 0 1000 500");
    svgMap.setAttribute("preserveAspectRatio", "xMidYMid meet");
    svgMap.classList.add("illustrated-world-map");
    svgMap.id = "enhanced-world-map";
    mapContainer.appendChild(svgMap);
    
    addMapDefs(svgMap);
    
    addOceanBackground(svgMap);
    
    addOceanWaves(svgMap);
    
    addClouds(svgMap);
    
    loadContinentsSVG(svgMap);
    
    addMapControls(mapContainer);
    
    addZoomLevelIndicator(mapContainer);
    
    addDayNightOverlay(mapContainer);
    
    addTravelAnimationContainer();
    
    addAdventureLog();
    
    setupPanFunctionality(svgMap);
}

function addMapDefs(svgMap) {
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
}

function addOceanBackground(svgMap) {
    const ocean = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    ocean.setAttribute("width", "100%");
    ocean.setAttribute("height", "100%");
    ocean.setAttribute("fill", "url(#ocean-gradient)");
    svgMap.appendChild(ocean);
}

function addOceanWaves(svgMap) {
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
}

function addClouds(svgMap) {
    const cloudsGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
    cloudsGroup.classList.add("clouds");
    svgMap.appendChild(cloudsGroup);
    
    const cloud1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
    cloud1.setAttribute("d", "M50,80 Q70,50 100,70 Q130,40 160,70 Q180,60 200,80 Q200,100 180,110 Q190,130 170,140 Q150,150 130,130 Q100,150 80,130 Q60,140 40,120 Q30,100 50,80");
    cloud1.classList.add("cloud", "cloud-1");
    cloudsGroup.appendChild(cloud1);
    
    const cloud2 = document.createElementNS("http://www.w3.org/2000/svg", "path");
    cloud2.setAttribute("d", "M250,120 Q270,90 300,110 Q330,80 360,110 Q380,100 400,120 Q400,140 380,150 Q390,170 370,180 Q350,190 330,170 Q300,190 280,170 Q260,180 240,160 Q230,140 250,120");
    cloud2.classList.add("cloud", "cloud-2");
    cloudsGroup.appendChild(cloud2);
    
    const cloud3 = document.createElementNS("http://www.w3.org/2000/svg", "path");
    cloud3.setAttribute("d", "M650,60 Q670,30 700,50 Q730,20 760,50 Q780,40 800,60 Q800,80 780,90 Q790,110 770,120 Q750,130 730,110 Q700,130 680,110 Q660,120 640,100 Q630,80 650,60");
    cloud3.classList.add("cloud", "cloud-3");
    cloudsGroup.appendChild(cloud3);
}

function loadContinentsSVG(svgMap) {
    fetch('/static/data/continents.svg')
        .then(response => response.text())
        .then(svgData => {
            const parser = new DOMParser();
            const svgDoc = parser.parseFromString(svgData, "image/svg+xml");
            const paths = svgDoc.querySelectorAll("path");
            
            const continentsGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
            continentsGroup.classList.add("continents");
            continentsGroup.id = "continents-group";
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
}

function addMapControls(mapContainer) {
    const controlsDiv = document.createElement('div');
    controlsDiv.className = 'map-controls';
    
    const zoomInButton = document.createElement('button');
    zoomInButton.className = 'map-control-button zoom-in';
    zoomInButton.innerHTML = '<i class="fas fa-plus"></i>';
    zoomInButton.setAttribute('title', 'ズームイン');
    controlsDiv.appendChild(zoomInButton);
    
    const zoomOutButton = document.createElement('button');
    zoomOutButton.className = 'map-control-button zoom-out';
    zoomOutButton.innerHTML = '<i class="fas fa-minus"></i>';
    zoomOutButton.setAttribute('title', 'ズームアウト');
    controlsDiv.appendChild(zoomOutButton);
    
    const resetButton = document.createElement('button');
    resetButton.className = 'map-control-button reset-view';
    resetButton.innerHTML = '<i class="fas fa-home"></i>';
    resetButton.setAttribute('title', '元の表示に戻す');
    controlsDiv.appendChild(resetButton);
    
    mapContainer.appendChild(controlsDiv);
}

function addZoomLevelIndicator(mapContainer) {
    const indicator = document.createElement('div');
    indicator.className = 'zoom-level-indicator';
    indicator.textContent = '拡大率: 100%';
    mapContainer.appendChild(indicator);
}

function addDayNightOverlay(mapContainer) {
    const overlay = document.createElement('div');
    overlay.className = 'day-night-overlay';
    mapContainer.appendChild(overlay);
}

function setupMapControls() {
    const zoomInButton = document.querySelector('.zoom-in');
    const zoomOutButton = document.querySelector('.zoom-out');
    const resetButton = document.querySelector('.reset-view');
    const indicator = document.querySelector('.zoom-level-indicator');
    const svgMap = document.getElementById('enhanced-world-map');
    
    if (!zoomInButton || !zoomOutButton || !resetButton || !svgMap) return;
    
    zoomInButton.addEventListener('click', () => {
        if (mapState.zoomLevel < mapState.maxZoom) {
            mapState.zoomLevel += mapState.zoomStep;
            updateMapTransform(svgMap);
            updateZoomIndicator(indicator);
        }
    });
    
    zoomOutButton.addEventListener('click', () => {
        if (mapState.zoomLevel > mapState.minZoom) {
            mapState.zoomLevel -= mapState.zoomStep;
            updateMapTransform(svgMap);
            updateZoomIndicator(indicator);
        }
    });
    
    resetButton.addEventListener('click', () => {
        mapState.zoomLevel = 1;
        mapState.translateX = 0;
        mapState.translateY = 0;
        updateMapTransform(svgMap);
        updateZoomIndicator(indicator);
    });
}

function updateMapTransform(svgMap) {
    svgMap.style.transform = `scale(${mapState.zoomLevel}) translate(${mapState.translateX}px, ${mapState.translateY}px)`;
}

function updateZoomIndicator(indicator) {
    indicator.textContent = `拡大率: ${Math.round(mapState.zoomLevel * 100)}%`;
}

function setupPanFunctionality(svgMap) {
    const mapContainer = document.getElementById('map');
    if (!mapContainer || !svgMap) return;
    
    mapContainer.addEventListener('mousedown', (e) => {
        if (e.button === 0) { // Left mouse button
            mapState.panning = true;
            mapState.lastX = e.clientX;
            mapState.lastY = e.clientY;
            mapContainer.style.cursor = 'grabbing';
        }
    });
    
    window.addEventListener('mousemove', (e) => {
        if (mapState.panning) {
            const dx = e.clientX - mapState.lastX;
            const dy = e.clientY - mapState.lastY;
            
            mapState.translateX += dx / mapState.zoomLevel;
            mapState.translateY += dy / mapState.zoomLevel;
            
            updateMapTransform(svgMap);
            
            mapState.lastX = e.clientX;
            mapState.lastY = e.clientY;
        }
    });
    
    window.addEventListener('mouseup', () => {
        if (mapState.panning) {
            mapState.panning = false;
            mapContainer.style.cursor = 'grab';
        }
    });
    
    mapContainer.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1) {
            mapState.panning = true;
            mapState.lastX = e.touches[0].clientX;
            mapState.lastY = e.touches[0].clientY;
        }
    });
    
    mapContainer.addEventListener('touchmove', (e) => {
        if (mapState.panning && e.touches.length === 1) {
            const dx = e.touches[0].clientX - mapState.lastX;
            const dy = e.touches[0].clientY - mapState.lastY;
            
            mapState.translateX += dx / mapState.zoomLevel;
            mapState.translateY += dy / mapState.zoomLevel;
            
            updateMapTransform(svgMap);
            
            mapState.lastX = e.touches[0].clientX;
            mapState.lastY = e.touches[0].clientY;
        }
    });
    
    mapContainer.addEventListener('touchend', () => {
        mapState.panning = false;
    });
    
    mapContainer.addEventListener('wheel', (e) => {
        e.preventDefault();
        
        const delta = -Math.sign(e.deltaY) * mapState.zoomStep;
        const newZoom = mapState.zoomLevel + delta;
        
        if (newZoom >= mapState.minZoom && newZoom <= mapState.maxZoom) {
            const rect = mapContainer.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            
            const svgX = (mouseX - mapState.translateX) / mapState.zoomLevel;
            const svgY = (mouseY - mapState.translateY) / mapState.zoomLevel;
            
            mapState.zoomLevel = newZoom;
            
            mapState.translateX = mouseX - svgX * mapState.zoomLevel;
            mapState.translateY = mouseY - svgY * mapState.zoomLevel;
            
            updateMapTransform(svgMap);
            updateZoomIndicator(document.querySelector('.zoom-level-indicator'));
        }
    });
}

function setupTimeLighting() {
    const overlay = document.querySelector('.day-night-overlay');
    if (!overlay) return;
    
    function updateLighting() {
        const hour = new Date().getHours();
        
        if (hour >= 5 && hour < 8) {
            overlay.className = 'day-night-overlay morning';
        } else if (hour >= 8 && hour < 17) {
            overlay.className = 'day-night-overlay day';
        } else if (hour >= 17 && hour < 20) {
            overlay.className = 'day-night-overlay evening';
        } else {
            overlay.className = 'day-night-overlay night';
        }
    }
    
    updateLighting();
    setInterval(updateLighting, 3600000);
}

function addTravelAnimationContainer() {
    const container = document.createElement('div');
    container.className = 'travel-animation-container';
    container.id = 'travel-animation';
    
    const animation = document.createElement('div');
    animation.className = 'travel-animation';
    
    const map = document.createElement('div');
    map.className = 'travel-map';
    animation.appendChild(map);
    
    const airplane = document.createElement('div');
    airplane.className = 'travel-airplane';
    animation.appendChild(airplane);
    
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", "travel-path");
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "100%");
    animation.appendChild(svg);
    
    const passport = document.createElement('div');
    passport.className = 'travel-passport';
    passport.textContent = 'PASSPORT';
    animation.appendChild(passport);
    
    const stamp = document.createElement('div');
    stamp.className = 'travel-stamp';
    stamp.textContent = 'ARRIVED';
    animation.appendChild(stamp);
    
    container.appendChild(animation);
    document.body.appendChild(container);
}

function addAdventureLog() {
    const log = document.createElement('div');
    log.className = 'adventure-log';
    log.id = 'adventure-log';
    
    const header = document.createElement('div');
    header.className = 'adventure-log-header';
    
    const title = document.createElement('h3');
    title.textContent = '冒険ログ';
    header.appendChild(title);
    
    const closeButton = document.createElement('button');
    closeButton.className = 'adventure-log-close';
    closeButton.innerHTML = '&times;';
    closeButton.addEventListener('click', () => {
        log.classList.remove('show');
    });
    header.appendChild(closeButton);
    
    log.appendChild(header);
    
    const content = document.createElement('div');
    content.className = 'adventure-log-content';
    log.appendChild(content);
    
    document.body.appendChild(log);
}

function showTravelAnimation(fromCountry, toCountry, callback) {
    const container = document.getElementById('travel-animation');
    if (!container) return;
    
    const fromCoords = getCountryCoordinates(fromCountry);
    const toCoords = getCountryCoordinates(toCountry);
    
    if (!fromCoords || !toCoords) {
        if (callback) callback();
        return;
    }
    
    container.style.display = 'flex';
    
    const airplane = container.querySelector('.travel-airplane');
    const map = container.querySelector('.travel-map');
    const svg = container.querySelector('.travel-path');
    
    svg.innerHTML = '';
    
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    const pathData = `M${fromCoords[0]},${fromCoords[1]} Q${(fromCoords[0] + toCoords[0]) / 2},${Math.min(fromCoords[1], toCoords[1]) - 50} ${toCoords[0]},${toCoords[1]}`;
    path.setAttribute("d", pathData);
    svg.appendChild(path);
    
    airplane.style.left = `${fromCoords[0]}px`;
    airplane.style.top = `${fromCoords[1]}px`;
    
    map.style.transform = 'scale(2)';
    map.style.transformOrigin = `${fromCoords[0]}px ${fromCoords[1]}px`;
    
    setTimeout(() => {
        map.style.transform = 'scale(1)';
        map.style.transformOrigin = 'center center';
        
        const pathLength = path.getTotalLength();
        let start = null;
        const duration = 3000; // 3 seconds
        
        function animateAirplane(timestamp) {
            if (!start) start = timestamp;
            const progress = (timestamp - start) / duration;
            
            if (progress < 1) {
                const point = path.getPointAtLength(pathLength * progress);
                airplane.style.left = `${point.x}px`;
                airplane.style.top = `${point.y}px`;
                
                const nextPoint = path.getPointAtLength(Math.min(pathLength, pathLength * progress + 10));
                const angle = Math.atan2(nextPoint.y - point.y, nextPoint.x - point.x) * 180 / Math.PI;
                airplane.style.transform = `rotate(${angle}deg)`;
                
                requestAnimationFrame(animateAirplane);
            } else {
                map.style.transform = 'scale(2)';
                map.style.transformOrigin = `${toCoords[0]}px ${toCoords[1]}px`;
                
                const stamp = container.querySelector('.travel-stamp');
                stamp.style.left = `${toCoords[0]}px`;
                stamp.style.top = `${toCoords[1]}px`;
                
                setTimeout(() => {
                    container.style.display = 'none';
                    if (callback) callback();
                }, 1500);
            }
        }
        
        requestAnimationFrame(animateAirplane);
    }, 1000);
}

function getCountryCoordinates(countryName) {
    const coordinates = {
        'Japan': [700, 150],
        'United States': [200, 150],
        'France': [450, 150],
        'Brazil': [300, 300],
        'Australia': [750, 350],
        'Egypt': [500, 200],
        'South Africa': [500, 300],
        'India': [600, 200],
        'China': [650, 180],
        'Russia': [550, 120]
    };
    
    return coordinates[countryName] || [400, 200]; // Default coordinates
}

function showAdventureLog(message) {
    const log = document.getElementById('adventure-log');
    if (!log) return;
    
    const content = log.querySelector('.adventure-log-content');
    if (!content) return;
    
    content.textContent = message;
    log.classList.add('show');
    
    setTimeout(() => {
        log.classList.remove('show');
    }, 5000);
}

function addEnhancedCountryIcon(countryName, coordinates, iconData, iconsGroup, allConversations) {
    const iconConfig = iconData[countryName] || iconData['default'];
    
    const iconGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
    iconGroup.classList.add("country-icon-group");
    iconGroup.setAttribute("transform", `translate(${coordinates[0]}, ${coordinates[1]})`);
    iconsGroup.appendChild(iconGroup);
    
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("r", "25"); // Increased from 20
    circle.setAttribute("fill", iconConfig.color);
    circle.setAttribute("stroke", "#ffffff");
    circle.setAttribute("stroke-width", "3"); // Increased from 2
    circle.classList.add("icon-background");
    iconGroup.appendChild(circle);
    
    const iconText = document.createElementNS("http://www.w3.org/2000/svg", "text");
    iconText.setAttribute("x", "0");
    iconText.setAttribute("y", "0");
    iconText.setAttribute("text-anchor", "middle");
    iconText.setAttribute("dominant-baseline", "middle");
    iconText.setAttribute("font-size", "20"); // Increased from 16
    iconText.textContent = iconConfig.icon;
    iconGroup.appendChild(iconText);
    
    const labelText = document.createElementNS("http://www.w3.org/2000/svg", "text");
    labelText.setAttribute("x", "0");
    labelText.setAttribute("y", "35"); // Adjusted for larger icon
    labelText.setAttribute("text-anchor", "middle");
    labelText.setAttribute("font-size", "12"); // Increased from 10
    labelText.setAttribute("fill", "#ffffff");
    labelText.setAttribute("stroke", "#000000");
    labelText.setAttribute("stroke-width", "0.5");
    labelText.setAttribute("opacity", "0");
    labelText.classList.add("icon-label");
    labelText.textContent = countryName;
    iconGroup.appendChild(labelText);
    
    iconGroup.addEventListener('mouseenter', function() {
        circle.setAttribute("r", "28"); // Larger expansion
        labelText.setAttribute("opacity", "1");
        circle.style.filter = "drop-shadow(0 0 5px rgba(255,255,255,0.8))";
    });
    
    iconGroup.addEventListener('mouseleave', function() {
        circle.setAttribute("r", "25");
        labelText.setAttribute("opacity", "0");
        circle.style.filter = "none";
    });
    
    iconGroup.addEventListener('click', function() {
        const hasVisited = checkIfVisited(countryName, allConversations);
        if (!hasVisited && localStorage.getItem('currentCountry')) {
            const fromCountry = localStorage.getItem('currentCountry');
            showTravelAnimation(fromCountry, countryName, () => {
                showConversationsInRegion(countryName, allConversations);
                showAdventureLog(`${countryName}に到着しました！新しい会話を記録しましょう。`);
            });
        } else {
            showConversationsInRegion(countryName, allConversations);
        }
        
        localStorage.setItem('currentCountry', countryName);
    });
    
    circle.style.animation = "pulse 3s infinite";
}

function checkIfVisited(countryName, allConversations) {
    return allConversations.some(conv => 
        conv.country === countryName || conv.region === countryName
    );
}

function loadRegionalBGM(region) {
    const bgmMap = {
        'East Asia': '/static/audio/east-asia-bgm.mp3',
        'North America': '/static/audio/north-america-bgm.mp3',
        'Europe': '/static/audio/europe-bgm.mp3',
        'Africa': '/static/audio/africa-bgm.mp3',
        'South America': '/static/audio/south-america-bgm.mp3',
        'Oceania': '/static/audio/oceania-bgm.mp3'
    };
    
    const bgmUrl = bgmMap[region] || bgmMap['East Asia']; // Default to East Asia
    
    let audio = document.getElementById('regional-bgm');
    if (!audio) {
        audio = document.createElement('audio');
        audio.id = 'regional-bgm';
        audio.loop = true;
        audio.volume = 0.3;
        document.body.appendChild(audio);
    }
    
    if (audio.src !== bgmUrl) {
        audio.src = bgmUrl;
        audio.play().catch(e => console.log('Auto-play prevented:', e));
    }
}

window.addCountryIconToSVG = addEnhancedCountryIcon;

window.showTravelAnimation = showTravelAnimation;
window.showAdventureLog = showAdventureLog;
window.loadRegionalBGM = loadRegionalBGM;
