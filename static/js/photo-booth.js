document.addEventListener('DOMContentLoaded', function() {
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes && mutation.addedNodes.length) {
                for (let i = 0; i < mutation.addedNodes.length; i++) {
                    const node = mutation.addedNodes[i];
                    if (node.nodeType === 1 && node.querySelector) {
                        if (node.id === 'photo-booth-container' || node.querySelector('#photo-booth-container')) {
                            initPhotoBoothIfReady();
                            break;
                        }
                    }
                }
            }
        });
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
    
    function initPhotoBoothIfReady() {
        console.log('Initializing photo booth...');
        const photoBoothContainer = document.getElementById('photo-booth-container');
        if (!photoBoothContainer) {
            console.log('Photo booth container not found, will try again later');
            setTimeout(initPhotoBoothIfReady, 100);
            return;
        }
        
        const conversationPhoto = document.getElementById('conversation-photo');
        const conversationName = document.querySelector('.conversation-meta h2');
        
        if (!conversationPhoto || !conversationName) {
            console.log('Conversation details not fully loaded, will try again later');
            setTimeout(initPhotoBoothIfReady, 100);
            return;
        }
        
        console.log('All elements found, setting up photo booth UI');
        const partnerName = conversationName.textContent;
        
        const savedFace = localStorage.getItem('avatarFace') || 'face1';
        const savedHair = localStorage.getItem('avatarHair') || 'hair1';
        const savedClothes = localStorage.getItem('avatarClothes') || 'clothes1';
        
        const photoBoothUI = `
            <div class="photo-booth-header">
                <h3><i class="fas fa-camera"></i> Take a Photo with ${partnerName}</h3>
                <p>Create a memory with your new friend!</p>
            </div>
            
            <div class="photo-frame">
                <div class="photo-content">
                    <div class="partner-side">
                        ${conversationPhoto.innerHTML}
                    </div>
                    <div class="user-side">
                        <div class="avatar-display animated">
                            <div class="avatar-face ${savedFace}"></div>
                            <div class="avatar-hair ${savedHair}"></div>
                            <div class="avatar-clothes ${savedClothes}"></div>
                        </div>
                    </div>
                </div>
                <div class="photo-frame-border"></div>
            </div>
            
            <div class="photo-booth-controls">
                <button id="take-photo-btn" class="button primary">
                    <i class="fas fa-camera"></i> Take Photo
                </button>
                <button id="retake-photo-btn" class="button secondary" style="display: none;">
                    <i class="fas fa-redo"></i> Retake
                </button>
                <button id="save-photo-btn" class="button success" style="display: none;">
                    <i class="fas fa-save"></i> Save to Collection
                </button>
            </div>
            
            <div class="photo-booth-effects">
                <div class="effect-option selected" data-effect="none">
                    <div class="effect-preview">Normal</div>
                </div>
                <div class="effect-option" data-effect="sepia">
                    <div class="effect-preview">Sepia</div>
                </div>
                <div class="effect-option" data-effect="grayscale">
                    <div class="effect-preview">B&W</div>
                </div>
                <div class="effect-option" data-effect="vintage">
                    <div class="effect-preview">Vintage</div>
                </div>
            </div>
        `;
        
        photoBoothContainer.innerHTML = photoBoothUI;
        
        const photoFrame = document.querySelector('.photo-frame');
        const takePhotoBtn = document.getElementById('take-photo-btn');
        const retakePhotoBtn = document.getElementById('retake-photo-btn');
        const savePhotoBtn = document.getElementById('save-photo-btn');
        const effectOptions = document.querySelectorAll('.effect-option');
        
        effectOptions.forEach(option => {
            option.addEventListener('click', function() {
                effectOptions.forEach(opt => opt.classList.remove('selected'));
                
                this.classList.add('selected');
                
                const effect = this.getAttribute('data-effect');
                applyPhotoEffect(effect);
            });
        });
        
        function applyPhotoEffect(effect) {
            photoFrame.classList.remove('effect-sepia', 'effect-grayscale', 'effect-vintage');
            
            if (effect !== 'none') {
                photoFrame.classList.add(`effect-${effect}`);
            }
        }
        
        takePhotoBtn.addEventListener('click', function() {
            photoFrame.classList.add('flash');
            
            const cameraSound = new Audio('/static/sounds/camera-shutter.mp3');
            cameraSound.play().catch(e => console.log('Audio play failed:', e));
            
            setTimeout(() => {
                photoFrame.classList.remove('flash');
                
                photoFrame.classList.add('photo-taken');
                
                takePhotoBtn.style.display = 'none';
                retakePhotoBtn.style.display = 'inline-flex';
                savePhotoBtn.style.display = 'inline-flex';
                
                photoFrame.classList.add('polaroid');
                
                const dateStamp = document.createElement('div');
                dateStamp.className = 'date-stamp';
                dateStamp.textContent = new Date().toLocaleDateString();
                photoFrame.appendChild(dateStamp);
            }, 500);
        });
        
        retakePhotoBtn.addEventListener('click', function() {
            photoFrame.classList.remove('photo-taken', 'polaroid');
            
            takePhotoBtn.style.display = 'inline-flex';
            retakePhotoBtn.style.display = 'none';
            savePhotoBtn.style.display = 'none';
            
            const dateStamp = photoFrame.querySelector('.date-stamp');
            if (dateStamp) {
                photoFrame.removeChild(dateStamp);
            }
        });
        
        savePhotoBtn.addEventListener('click', function() {
            
            const successMessage = document.createElement('div');
            successMessage.className = 'photo-save-success';
            successMessage.innerHTML = `
                <i class="fas fa-check-circle"></i>
                <p>Photo saved to your collection!</p>
            `;
            
            photoBoothContainer.appendChild(successMessage);
            
            setTimeout(() => {
                photoBoothContainer.removeChild(successMessage);
            }, 3000);
        });
        
        const avatarDisplay = document.querySelector('.photo-booth-container .avatar-display');
        if (avatarDisplay) {
            const poseButton = document.createElement('button');
            poseButton.className = 'pose-button';
            poseButton.innerHTML = '<i class="fas fa-sync"></i> Change Pose';
            document.querySelector('.photo-booth-controls').prepend(poseButton);
            
            const poses = ['normal', 'waving', 'jumping', 'dancing'];
            let currentPose = 0;
            
            poseButton.addEventListener('click', function() {
                avatarDisplay.classList.remove('pose-normal', 'pose-waving', 'pose-jumping', 'pose-dancing');
                
                currentPose = (currentPose + 1) % poses.length;
                
                avatarDisplay.classList.add(`pose-${poses[currentPose]}`);
            });
        }
    }
    
    initPhotoBoothIfReady();
});
