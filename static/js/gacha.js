document.addEventListener('DOMContentLoaded', function() {
    const pullGachaBtn = document.getElementById('pull-gacha');
    const worldGachaBtn = document.getElementById('world-gacha');
    const favoriteGachaBtn = document.getElementById('favorite-gacha');
    const gachaResult = document.querySelector('.gacha-result');
    const closeResultBtn = document.querySelector('.close-result');
    const addToCollectionBtn = document.querySelector('.add-to-collection');
    const tryAgainBtn = document.querySelector('.try-again');
    const dailyPullsSpan = document.getElementById('daily-pulls');
    const coinAmountSpan = document.getElementById('coin-amount');
    const globeItems = document.querySelector('.globe-items');
    
    let gachaType = 'world'; // 'world' or 'favorite'
    let dailyPulls = 1;
    let coins = 100;
    let currentItem = null;
    
    const culturalItems = [
        {
            id: 'item1',
            name: '寿司',
            country: '日本',
            description: '日本の伝統的な料理。新鮮な魚と酢飯で作られる。',
            emoji: '🍣',
            rarity: 'common'
        },
        {
            id: 'item2',
            name: '着物',
            country: '日本',
            description: '日本の伝統的な衣装。様々な場面で着用される。',
            emoji: '👘',
            rarity: 'rare'
        },
        {
            id: 'item3',
            name: 'タコス',
            country: 'メキシコ',
            description: 'メキシコの代表的な料理。トルティーヤに具材を包んで食べる。',
            emoji: '🌮',
            rarity: 'common'
        },
        {
            id: 'item4',
            name: '自由の女神',
            country: 'アメリカ',
            description: 'ニューヨークにある有名な像。自由と民主主義の象徴。',
            emoji: '🗽',
            rarity: 'rare'
        },
        {
            id: 'item5',
            name: 'エッフェル塔',
            country: 'フランス',
            description: 'パリにある鉄塔。フランスの象徴的な建造物。',
            emoji: '🗼',
            rarity: 'rare'
        },
        {
            id: 'item6',
            name: 'パンダ',
            country: '中国',
            description: '中国原産の動物。世界中で愛されている。',
            emoji: '🐼',
            rarity: 'ultra-rare'
        },
        {
            id: 'item7',
            name: 'ピザ',
            country: 'イタリア',
            description: 'イタリア発祥の料理。世界中で人気がある。',
            emoji: '🍕',
            rarity: 'common'
        },
        {
            id: 'item8',
            name: 'カンガルー',
            country: 'オーストラリア',
            description: 'オーストラリアに生息する有袋類。跳躍力が高い。',
            emoji: '🦘',
            rarity: 'rare'
        },
        {
            id: 'item9',
            name: 'ピラミッド',
            country: 'エジプト',
            description: '古代エジプトの王のための墓。世界の七不思議の一つ。',
            emoji: '🔺',
            rarity: 'ultra-rare'
        },
        {
            id: 'item10',
            name: 'サッカーボール',
            country: 'ブラジル',
            description: 'ブラジルはサッカー大国として知られている。',
            emoji: '⚽',
            rarity: 'common'
        }
    ];
    
    let userCollection = [];
    
    function initGlobeItems() {
        globeItems.innerHTML = '';
        
        const sampleItems = [];
        for (let i = 0; i < 5; i++) {
            const randomItem = culturalItems[Math.floor(Math.random() * culturalItems.length)];
            sampleItems.push(randomItem);
        }
        
        sampleItems.forEach((item, index) => {
            const itemEl = document.createElement('div');
            itemEl.className = 'globe-item';
            itemEl.textContent = item.emoji;
            
            const angle = (index / sampleItems.length) * 2 * Math.PI;
            const radius = 60;
            const x = radius * Math.cos(angle);
            const y = radius * Math.sin(angle);
            
            itemEl.style.left = `calc(50% + ${x}px)`;
            itemEl.style.top = `calc(50% + ${y}px)`;
            
            globeItems.appendChild(itemEl);
        });
    }
    
    function updateUI() {
        dailyPullsSpan.textContent = dailyPulls;
        coinAmountSpan.textContent = coins;
        
        pullGachaBtn.disabled = (gachaType === 'world' && dailyPulls === 0 && coins < 50) || 
                               (gachaType === 'favorite' && dailyPulls === 0 && coins < 70);
    }
    
    function pullGacha() {
        if (dailyPulls === 0) {
            if (gachaType === 'world' && coins < 50) {
                alert('コインが足りません！');
                return;
            }
            if (gachaType === 'favorite' && coins < 70) {
                alert('コインが足りません！');
                return;
            }
        }
        
        if (dailyPulls > 0) {
            dailyPulls--;
        } else {
            if (gachaType === 'world') {
                coins -= 50;
            } else {
                coins -= 70;
            }
        }
        
        globeItems.classList.add('spinning');
        pullGachaBtn.disabled = true;
        
        let filteredItems = culturalItems;
        if (gachaType === 'favorite') {
            filteredItems = culturalItems.filter(item => 
                item.rarity === 'rare' || item.rarity === 'ultra-rare'
            );
            if (filteredItems.length === 0) filteredItems = culturalItems;
        }
        
        let weights = {
            'common': gachaType === 'world' ? 70 : 40,
            'rare': gachaType === 'world' ? 25 : 50,
            'ultra-rare': gachaType === 'world' ? 5 : 10
        };
        
        let totalWeight = 0;
        const weightedItems = filteredItems.map(item => {
            const weight = weights[item.rarity];
            totalWeight += weight;
            return { item, weight };
        });
        
        let random = Math.random() * totalWeight;
        let selectedItem = null;
        
        for (const { item, weight } of weightedItems) {
            random -= weight;
            if (random <= 0) {
                selectedItem = item;
                break;
            }
        }
        
        if (!selectedItem) selectedItem = filteredItems[0];
        currentItem = selectedItem;
        
        setTimeout(() => {
            globeItems.classList.remove('spinning');
            showResult(selectedItem);
            updateUI();
        }, 2000);
    }
    
    function showResult(item) {
        const itemRarity = document.querySelector('.rarity-badge');
        const itemImage = document.querySelector('.item-image');
        const itemName = document.querySelector('.item-name');
        const itemCountry = document.querySelector('.item-country');
        const itemDescription = document.querySelector('.item-description');
        
        itemRarity.textContent = {
            'common': '一般',
            'rare': 'レア',
            'ultra-rare': '超レア'
        }[item.rarity];
        itemRarity.className = `rarity-badge ${item.rarity}`;
        
        itemImage.innerHTML = `<div style="font-size: 80px; text-align: center;">${item.emoji}</div>`;
        itemName.textContent = item.name;
        itemCountry.textContent = item.country;
        itemDescription.textContent = item.description;
        
        gachaResult.style.display = 'flex';
    }
    
    function addToCollection(item) {
        if (!item) return;
        
        userCollection.push({
            ...item,
            acquired: new Date().toISOString()
        });
        
        localStorage.setItem('culturalItems', JSON.stringify(userCollection));
        
        updateCollectionPreview();
    }
    
    function updateCollectionPreview() {
        const recentItems = document.querySelector('.recent-items');
        const emptyMessage = document.querySelector('.empty-message');
        
        if (userCollection.length === 0) {
            emptyMessage.style.display = 'block';
            return;
        }
        
        emptyMessage.style.display = 'none';
        recentItems.innerHTML = '';
        
        const recentFive = [...userCollection].sort((a, b) => 
            new Date(b.acquired) - new Date(a.acquired)
        ).slice(0, 5);
        
        recentFive.forEach(item => {
            const itemEl = document.createElement('div');
            itemEl.className = 'item-preview';
            itemEl.innerHTML = `
                <div class="preview-image">${item.emoji}</div>
                <div class="preview-name">${item.name}</div>
            `;
            recentItems.appendChild(itemEl);
        });
    }
    
    pullGachaBtn.addEventListener('click', pullGacha);
    
    worldGachaBtn.addEventListener('click', function() {
        gachaType = 'world';
        worldGachaBtn.classList.add('active');
        favoriteGachaBtn.classList.remove('active');
        updateUI();
    });
    
    favoriteGachaBtn.addEventListener('click', function() {
        gachaType = 'favorite';
        favoriteGachaBtn.classList.add('active');
        worldGachaBtn.classList.remove('active');
        updateUI();
    });
    
    closeResultBtn.addEventListener('click', function() {
        gachaResult.style.display = 'none';
        currentItem = null;
    });
    
    addToCollectionBtn.addEventListener('click', function() {
        addToCollection(currentItem);
        gachaResult.style.display = 'none';
        currentItem = null;
    });
    
    tryAgainBtn.addEventListener('click', function() {
        gachaResult.style.display = 'none';
        currentItem = null;
        pullGacha();
    });
    
    const savedCollection = localStorage.getItem('culturalItems');
    if (savedCollection) {
        userCollection = JSON.parse(savedCollection);
        updateCollectionPreview();
    }
    
    initGlobeItems();
    updateUI();
});
