/**
 * Enhanced Gacha Implementation for World Youth Atlas
 * Features:
 * - Animated gacha machine with rotation, light, and explosion effects
 * - Detailed result display with encyclopedia links
 * - Encouraging messages for different rarities
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log("Enhanced gacha script is loading!");
    
    initEnhancedGacha();
    
    setupGachaControls();
    
    setupGachaTypes();
    
    loadRecentItems();
});

const sampleItems = [
    {
        id: "item1",
        nameJa: "寿司",
        nameEn: "Sushi",
        country: "日本",
        description: "日本の伝統的な料理で、酢飯に様々な具材をのせたもの。",
        emoji: "🍣",
        rarity: "rare",
        category: "food"
    },
    {
        id: "item2",
        nameJa: "自由の女神",
        nameEn: "Statue of Liberty",
        country: "アメリカ",
        description: "アメリカ合衆国の象徴的な像で、自由と民主主義を表している。",
        emoji: "🗽",
        rarity: "super-rare",
        category: "landmark"
    },
    {
        id: "item3",
        nameJa: "タコス",
        nameEn: "Tacos",
        country: "メキシコ",
        description: "メキシコの伝統的な料理で、トルティーヤに様々な具材を包んだもの。",
        emoji: "🌮",
        rarity: "common",
        category: "food"
    },
    {
        id: "item4",
        nameJa: "パンダ",
        nameEn: "Panda",
        country: "中国",
        description: "中国の象徴的な動物で、世界中で愛されている。",
        emoji: "🐼",
        rarity: "rare",
        category: "animal"
    },
    {
        id: "item5",
        nameJa: "エッフェル塔",
        nameEn: "Eiffel Tower",
        country: "フランス",
        description: "フランスの象徴的な建造物で、パリのランドマーク。",
        emoji: "🗼",
        rarity: "super-rare",
        category: "landmark"
    }
];

const recentPulls = [
    { itemId: "item1", date: "2025年4月28日" },
    { itemId: "item3", date: "2025年4月27日" },
    { itemId: "item4", date: "2025年4月26日" }
];

const gachaState = {
    coins: 50,
    freeGachaPulls: 0,
    selectedType: "world",
    isAnimating: false
};

function initEnhancedGacha() {
    createEnhancedGachaMachine();
    
    addAnimationEffects();
    
    createGachaResultModal();
    
    updateGachaCurrency();
    
    checkFreeGachaAvailability();
}

function createEnhancedGachaMachine() {
    const gachaContainer = document.querySelector('.gacha-machine-container');
    if (!gachaContainer) return;
    
    gachaContainer.innerHTML = '';
    
    const gachaMachine = document.createElement('div');
    gachaMachine.className = 'gacha-machine';
    
    const gachaMachineBase = document.createElement('div');
    gachaMachineBase.className = 'gacha-machine-base';
    
    const gachaMachineGlass = document.createElement('div');
    gachaMachineGlass.className = 'gacha-machine-glass';
    
    const gachaMachineItems = document.createElement('div');
    gachaMachineItems.className = 'gacha-machine-items';
    
    const sampleEmojis = ["🍣", "🗽", "🌮", "🐼", "🗼"];
    sampleEmojis.forEach((emoji, index) => {
        const item = document.createElement('div');
        item.className = 'gacha-item';
        item.textContent = emoji;
        gachaMachineItems.appendChild(item);
    });
    
    gachaMachineGlass.appendChild(gachaMachineItems);
    gachaMachineBase.appendChild(gachaMachineGlass);
    
    const gachaMachineHandle = document.createElement('div');
    gachaMachineHandle.className = 'gacha-machine-handle';
    gachaMachineHandle.setAttribute('title', 'ガチャを回す');
    
    gachaMachine.appendChild(gachaMachineBase);
    gachaMachine.appendChild(gachaMachineHandle);
    
    gachaContainer.appendChild(gachaMachine);
    
    gachaMachineHandle.addEventListener('click', () => {
        if (!gachaState.isAnimating) {
            pullGacha('free');
        }
    });
}

function addAnimationEffects() {
    const gachaContainer = document.querySelector('.gacha-machine-container');
    if (!gachaContainer) return;
    
    const lightEffect = document.createElement('div');
    lightEffect.className = 'gacha-light-effect';
    gachaContainer.appendChild(lightEffect);
    
    const explosionEffect = document.createElement('div');
    explosionEffect.className = 'gacha-explosion-effect';
    gachaContainer.appendChild(explosionEffect);
    
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'gacha-particles';
    gachaContainer.appendChild(particlesContainer);
    
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.backgroundColor = getRandomColor();
        particlesContainer.appendChild(particle);
    }
}

function createGachaResultModal() {
    if (document.querySelector('.gacha-result-container')) return;
    
    const resultContainer = document.createElement('div');
    resultContainer.className = 'gacha-result-container';
    
    const resultContent = document.createElement('div');
    resultContent.className = 'gacha-result';
    
    const resultHeader = document.createElement('div');
    resultHeader.className = 'gacha-result-header';
    resultHeader.innerHTML = '<h3>ガチャ結果</h3>';
    
    const resultContentArea = document.createElement('div');
    resultContentArea.className = 'gacha-result-content';
    
    const resultActions = document.createElement('div');
    resultActions.className = 'gacha-result-actions';
    
    const closeButton = document.createElement('button');
    closeButton.className = 'gacha-result-button secondary';
    closeButton.textContent = '閉じる';
    closeButton.addEventListener('click', () => {
        resultContainer.style.display = 'none';
        resultContent.classList.remove('show');
    });
    
    const collectionButton = document.createElement('button');
    collectionButton.className = 'gacha-result-button primary';
    collectionButton.textContent = 'コレクションを見る';
    collectionButton.addEventListener('click', () => {
        window.location.href = '/collection';
    });
    
    resultActions.appendChild(closeButton);
    resultActions.appendChild(collectionButton);
    
    resultContent.appendChild(resultHeader);
    resultContent.appendChild(resultContentArea);
    resultContent.appendChild(resultActions);
    
    resultContainer.appendChild(resultContent);
    document.body.appendChild(resultContainer);
}

function setupGachaControls() {
    const freeButton = document.querySelector('.gacha-button.free');
    const premiumButton = document.querySelector('.gacha-button.premium');
    
    if (freeButton) {
        freeButton.addEventListener('click', () => {
            if (!gachaState.isAnimating) {
                pullGacha('free');
            }
        });
    }
    
    if (premiumButton) {
        premiumButton.addEventListener('click', () => {
            if (!gachaState.isAnimating && gachaState.coins >= 10) {
                pullGacha('premium');
            }
        });
    }
}

function setupGachaTypes() {
    const gachaTypes = document.querySelectorAll('.gacha-type');
    
    gachaTypes.forEach(type => {
        type.addEventListener('click', () => {
            gachaTypes.forEach(t => t.classList.remove('active'));
            type.classList.add('active');
            
            gachaState.selectedType = type.dataset.type;
        });
    });
}

function updateGachaCurrency() {
    const currencyElement = document.querySelector('.gacha-currency span');
    if (currencyElement) {
        currencyElement.textContent = gachaState.coins;
    }
}

function checkFreeGachaAvailability() {
    const freeButton = document.querySelector('.gacha-button.free');
    const freeCount = document.querySelector('.gacha-button.free .count');
    
    if (!freeButton || !freeCount) return;
    
    const remainingFreeGacha = 1 - gachaState.freeGachaPulls;
    
    freeCount.textContent = remainingFreeGacha;
    
    if (remainingFreeGacha <= 0) {
        freeButton.disabled = true;
        freeButton.title = '今日の無料ガチャはすべて使用しました';
    } else {
        freeButton.disabled = false;
        freeButton.title = '無料ガチャを引く';
    }
}

function loadRecentItems() {
    const itemsGrid = document.querySelector('.items-grid');
    if (!itemsGrid) return;
    
    itemsGrid.innerHTML = '';
    
    recentPulls.forEach(pull => {
        const item = sampleItems.find(item => item.id === pull.itemId);
        if (!item) return;
        
        const itemCard = document.createElement('div');
        itemCard.className = 'item-card';
        
        const itemIcon = document.createElement('div');
        itemIcon.className = 'item-icon';
        itemIcon.textContent = item.emoji;
        
        const itemName = document.createElement('div');
        itemName.className = 'item-name';
        itemName.textContent = item.nameJa;
        
        const itemRarity = document.createElement('div');
        itemRarity.className = `item-rarity rarity-${item.rarity}`;
        itemRarity.textContent = getRarityName(item.rarity);
        
        const itemCountry = document.createElement('div');
        itemCountry.className = 'item-country';
        itemCountry.textContent = item.country;
        
        itemCard.appendChild(itemIcon);
        itemCard.appendChild(itemName);
        itemCard.appendChild(itemRarity);
        itemCard.appendChild(itemCountry);
        
        itemsGrid.appendChild(itemCard);
    });
}

function pullGacha(type) {
    if (gachaState.isAnimating) return;
    
    gachaState.isAnimating = true;
    
    if (type === 'free') {
        gachaState.freeGachaPulls++;
        checkFreeGachaAvailability();
    } else if (type === 'premium') {
        gachaState.coins -= 10;
        updateGachaCurrency();
    }
    
    const gachaMachine = document.querySelector('.gacha-machine');
    const gachaMachineHandle = document.querySelector('.gacha-machine-handle');
    const lightEffect = document.querySelector('.gacha-light-effect');
    const explosionEffect = document.querySelector('.gacha-explosion-effect');
    const particles = document.querySelectorAll('.particle');
    
    
    gachaMachineHandle.classList.add('pulling');
    
    setTimeout(() => {
        gachaMachine.classList.add('gacha-rotation');
        
        playSound('gacha-spin');
    }, 300);
    
    setTimeout(() => {
        lightEffect.classList.add('flash');
        
        playSound('gacha-light');
    }, 1000);
    
    setTimeout(() => {
        explosionEffect.classList.add('explode');
        
        particles.forEach(particle => {
            const x = (Math.random() - 0.5) * 300;
            const y = (Math.random() - 0.5) * 300;
            particle.style.setProperty('--x', `${x}px`);
            particle.style.setProperty('--y', `${y}px`);
            particle.classList.add('show');
        });
        
        playSound('gacha-explosion');
    }, 1500);
    
    setTimeout(() => {
        const item = getRandomItem(type);
        
        showGachaResult(item);
        
        gachaMachineHandle.classList.remove('pulling');
        gachaMachine.classList.remove('gacha-rotation');
        lightEffect.classList.remove('flash');
        explosionEffect.classList.remove('explode');
        particles.forEach(particle => {
            particle.classList.remove('show');
        });
        
        gachaState.isAnimating = false;
    }, 2000);
}

function getRandomItem(type) {
    let filteredItems = [...sampleItems];
    
    if (type === 'premium') {
        filteredItems = filteredItems.filter(item => 
            item.rarity === 'rare' || item.rarity === 'super-rare' || item.rarity === 'ultra-rare'
        );
    }
    
    const randomIndex = Math.floor(Math.random() * filteredItems.length);
    return filteredItems[randomIndex] || sampleItems[0];
}

function showGachaResult(item) {
    const resultContainer = document.querySelector('.gacha-result-container');
    const resultContent = document.querySelector('.gacha-result');
    const resultContentArea = document.querySelector('.gacha-result-content');
    
    if (!resultContainer || !resultContent || !resultContentArea) return;
    
    resultContentArea.innerHTML = '';
    
    const itemIcon = document.createElement('div');
    itemIcon.className = 'gacha-result-item';
    itemIcon.textContent = item.emoji;
    
    const itemName = document.createElement('div');
    itemName.className = 'gacha-result-name';
    itemName.textContent = item.nameJa;
    
    const itemDescription = document.createElement('div');
    itemDescription.className = 'gacha-result-description';
    itemDescription.textContent = item.description;
    
    const itemRarity = document.createElement('div');
    itemRarity.className = `gacha-result-rarity rarity-${item.rarity}`;
    itemRarity.textContent = getRarityName(item.rarity);
    
    const encouragingMessage = document.createElement('div');
    encouragingMessage.className = 'gacha-result-message';
    encouragingMessage.textContent = getEncouragingMessage(item.rarity);
    
    const encyclopediaLink = document.createElement('a');
    encyclopediaLink.className = 'encyclopedia-link';
    encyclopediaLink.href = `/collection#${item.id}`;
    encyclopediaLink.innerHTML = '<i class="fas fa-book"></i> 図鑑で詳細を見る';
    
    resultContentArea.appendChild(itemIcon);
    resultContentArea.appendChild(itemName);
    resultContentArea.appendChild(itemRarity);
    resultContentArea.appendChild(itemDescription);
    resultContentArea.appendChild(encouragingMessage);
    resultContentArea.appendChild(encyclopediaLink);
    
    resultContainer.style.display = 'flex';
    
    setTimeout(() => {
        resultContent.classList.add('show');
        
        playSound(`gacha-${item.rarity}`);
    }, 100);
    
    addToRecentPulls(item);
}

function addToRecentPulls(item) {
    const now = new Date();
    const formattedDate = `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日`;
    
    const newPull = {
        itemId: item.id,
        date: formattedDate
    };
    
    recentPulls.unshift(newPull);
    
    if (recentPulls.length > 5) {
        recentPulls.pop();
    }
    
    loadRecentItems();
}

function getRarityName(rarity) {
    const rarityNames = {
        'common': '一般',
        'rare': 'レア',
        'super-rare': 'スーパーレア',
        'ultra-rare': 'ウルトラレア'
    };
    
    return rarityNames[rarity] || rarity;
}

function getEncouragingMessage(rarity) {
    const messages = {
        'common': 'いいね！コレクションに追加しました！',
        'rare': 'すごい！レアアイテムをゲットしました！',
        'super-rare': 'おめでとう！スーパーレアアイテムです！',
        'ultra-rare': '信じられない！ウルトラレアアイテムです！'
    };
    
    return messages[rarity] || 'コレクションに追加しました！';
}

function getRandomColor() {
    const colors = [
        '#ff6b6b', '#ff9e7d', '#feca57', '#1dd1a1', 
        '#48dbfb', '#0abde3', '#c56cf0', '#ff9ff3'
    ];
    
    return colors[Math.floor(Math.random() * colors.length)];
}

function playSound(soundId) {
    console.log(`Playing sound: ${soundId}`);
    
    /*
    const audio = new Audio(`/static/audio/${soundId}.mp3`);
    audio.volume = 0.5;
    audio.play().catch(e => console.log('Auto-play prevented:', e));
    */
}

window.pullGacha = pullGacha;
