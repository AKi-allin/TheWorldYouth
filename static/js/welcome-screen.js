document.addEventListener('DOMContentLoaded', function() {
    const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');
    
    if (!hasSeenWelcome) {
        showWelcomeScreen();
        
        localStorage.setItem('hasSeenWelcome', 'true');
    }
});

function showWelcomeScreen() {
    const welcomeModal = document.createElement('div');
    welcomeModal.className = 'welcome-modal';
    welcomeModal.innerHTML = `
        <div class="welcome-content">
            <div class="travel-illustrations">
                <div class="paper-plane-animation">
                    <div class="paper-plane">
                        <div class="plane-body"></div>
                        <div class="plane-wing"></div>
                    </div>
                    <div class="flight-path"></div>
                </div>
                
                <div class="travel-items">
                    <div class="backpack">
                        <div class="backpack-body"></div>
                        <div class="backpack-pocket"></div>
                        <div class="backpack-strap left"></div>
                        <div class="backpack-strap right"></div>
                    </div>
                    
                    <div class="passport">
                        <div class="passport-cover"></div>
                        <div class="passport-emblem"></div>
                    </div>
                    
                    <div class="map">
                        <div class="map-paper"></div>
                        <div class="map-fold"></div>
                        <div class="map-marker"></div>
                    </div>
                </div>
                
                <div class="welcome-globe">
                    <div class="globe-animation">
                        <div class="globe"></div>
                        <div class="globe-overlay"></div>
                        <div class="globe-pin"></div>
                    </div>
                </div>
            </div>
            
            <h2 class="welcome-title">Welcome to Global Youth Atlas!</h2>
            <p class="welcome-message">
                We're building the World Youth Encyclopedia.<br>
                <span class="highlight">Want to represent your country?</span>
            </p>
            
            <div class="welcome-features">
                <div class="feature">
                    <i class="fas fa-globe-americas"></i>
                    <span>Explore the world map</span>
                </div>
                <div class="feature">
                    <i class="fas fa-comments"></i>
                    <span>Collect conversations</span>
                </div>
                <div class="feature">
                    <i class="fas fa-camera"></i>
                    <span>Take photos with new friends</span>
                </div>
                <div class="feature">
                    <i class="fas fa-tasks"></i>
                    <span>Complete cultural missions</span>
                </div>
            </div>
            
            <button class="welcome-button">Let's Start Our Journey</button>
        </div>
    `;
    
    document.body.appendChild(welcomeModal);
    
    animatePaperPlane();
    
    setTimeout(() => {
        welcomeModal.classList.add('visible');
        document.querySelector('.welcome-content').classList.add('animate');
    }, 100);
    
    const startButton = welcomeModal.querySelector('.welcome-button');
    startButton.addEventListener('click', () => {
        welcomeModal.classList.add('exit');
        
        setTimeout(() => {
            document.body.removeChild(welcomeModal);
        }, 800);
    });
}

function animatePaperPlane() {
    const plane = document.querySelector('.paper-plane');
    if (!plane) return;
    
    let posX = -50;
    let posY = 50;
    let rotation = 0;
    
    const flightPath = [
        { x: 100, y: 30, r: 10 },
        { x: 200, y: 60, r: -15 },
        { x: 300, y: 40, r: 5 },
        { x: 400, y: 70, r: -10 },
        { x: 500, y: 30, r: 15 }
    ];
    
    let currentPoint = 0;
    
    function movePlane() {
        if (currentPoint >= flightPath.length) {
            currentPoint = 0;
            posX = -50;
            posY = 50;
            rotation = 0;
        }
        
        const target = flightPath[currentPoint];
        
        const dx = (target.x - posX) * 0.05;
        const dy = (target.y - posY) * 0.05;
        const dr = (target.r - rotation) * 0.1;
        
        posX += dx;
        posY += dy;
        rotation += dr;
        
        plane.style.transform = `translate(${posX}px, ${posY}px) rotate(${rotation}deg)`;
        
        if (Math.abs(posX - target.x) < 5 && Math.abs(posY - target.y) < 5) {
            currentPoint++;
        }
        
        requestAnimationFrame(movePlane);
    }
    
    requestAnimationFrame(movePlane);
}
