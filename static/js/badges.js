document.addEventListener('DOMContentLoaded', function() {
    const badgesGrid = document.querySelector('.badges-grid');
    const categoryTabs = document.querySelectorAll('.category-tab');
    const badgesCountSpan = document.getElementById('badges-count');
    const badgesPercentageSpan = document.getElementById('badges-percentage');
    const achievementsList = document.querySelector('.achievements-list');
    const badgeModal = document.getElementById('badge-modal');
    const closeButton = document.querySelector('.close-button');
    const closeBadgeDetailBtn = document.getElementById('close-badge-detail');
    
    let badges = [];
    let userBadges = [];
    let filteredBadges = [];
    let currentCategory = 'all';
    
    const sampleBadges = [
        {
            id: 'badge1',
            name: 'アジア探検家',
            description: 'アジアの国々を探検しよう',
            category: 'region',
            category_ja: '地域',
            icon: '🧭',
            requirements: [
                { id: 'req1', description: '日本の会話を記録する', completed: true },
                { id: 'req2', description: '中国の会話を記録する', completed: false },
                { id: 'req3', description: '韓国の会話を記録する', completed: false },
                { id: 'req4', description: 'インドの会話を記録する', completed: false },
                { id: 'req5', description: 'タイの会話を記録する', completed: false }
            ],
            progress: 1,
            total: 5,
            acquired: false,
            acquired_at: null
        },
        {
            id: 'badge2',
            name: '世界の料理通',
            description: '世界中の料理に関する知識を集めよう',
            category: 'collection',
            category_ja: 'コレクション',
            icon: '🍲',
            requirements: [
                { id: 'req1', description: '寿司（日本）のアイテムを獲得する', completed: true },
                { id: 'req2', description: 'ピザ（イタリア）のアイテムを獲得する', completed: true },
                { id: 'req3', description: 'タコス（メキシコ）のアイテムを獲得する', completed: false },
                { id: 'req4', description: 'クロワッサン（フランス）のアイテムを獲得する', completed: false },
                { id: 'req5', description: 'カレー（インド）のアイテムを獲得する', completed: false }
            ],
            progress: 2,
            total: 5,
            acquired: false,
            acquired_at: null
        },
        {
            id: 'badge3',
            name: '5大陸コンプリート',
            description: '5大陸すべてから会話を記録しよう',
            category: 'region',
            category_ja: '地域',
            icon: '🌍',
            requirements: [
                { id: 'req1', description: 'アジアの会話を記録する', completed: true },
                { id: 'req2', description: 'ヨーロッパの会話を記録する', completed: false },
                { id: 'req3', description: '北アメリカの会話を記録する', completed: true },
                { id: 'req4', description: '南アメリカの会話を記録する', completed: false },
                { id: 'req5', description: 'アフリカの会話を記録する', completed: false },
                { id: 'req6', description: 'オセアニアの会話を記録する', completed: false }
            ],
            progress: 2,
            total: 6,
            acquired: false,
            acquired_at: null
        },
        {
            id: 'badge4',
            name: '文化ガチャマスター',
            description: '文化ガチャを極めよう',
            category: 'activity',
            category_ja: '活動',
            icon: '🎁',
            requirements: [
                { id: 'req1', description: '文化ガチャを10回引く', completed: true },
                { id: 'req2', description: '文化ガチャを50回引く', completed: false },
                { id: 'req3', description: '文化ガチャを100回引く', completed: false },
                { id: 'req4', description: 'レアアイテムを5つ獲得する', completed: false },
                { id: 'req5', description: '超レアアイテムを1つ獲得する', completed: false }
            ],
            progress: 1,
            total: 5,
            acquired: false,
            acquired_at: null
        },
        {
            id: 'badge5',
            name: '冒険の始まり',
            description: '世界ユースアトラスの冒険を始めよう',
            category: 'special',
            category_ja: '特別',
            icon: '🚀',
            requirements: [
                { id: 'req1', description: 'アプリを初めて起動する', completed: true },
                { id: 'req2', description: 'アバターを作成する', completed: true },
                { id: 'req3', description: '最初の会話を記録する', completed: true }
            ],
            progress: 3,
            total: 3,
            acquired: true,
            acquired_at: '2025-04-20 10:15:30'
        }
    ];
    
    function loadBadges() {
        badges = sampleBadges;
        
        userBadges = badges.filter(badge => badge.acquired);
        
        const loadingIndicator = document.querySelector('.loading-indicator');
        if (loadingIndicator) {
            loadingIndicator.remove();
        }
        
        filteredBadges = [...badges];
        renderBadges();
        updateStats();
        renderRecentAchievements();
    }
    
    function filterBadgesByCategory(category) {
        if (category === 'all') {
            filteredBadges = [...badges];
        } else {
            filteredBadges = badges.filter(badge => badge.category === category);
        }
        
        renderBadges();
    }
    
    function renderBadges() {
        badgesGrid.innerHTML = '';
        
        if (filteredBadges.length === 0) {
            const emptyMessage = document.createElement('div');
            emptyMessage.className = 'empty-message';
            emptyMessage.textContent = 'バッジが見つかりませんでした。';
            badgesGrid.appendChild(emptyMessage);
            return;
        }
        
        filteredBadges.forEach(badge => {
            const badgeCard = document.createElement('div');
            badgeCard.className = `badge-card ${badge.acquired ? 'acquired' : 'locked'}`;
            badgeCard.setAttribute('data-badge-id', badge.id);
            
            const progressPercentage = (badge.progress / badge.total) * 100;
            
            badgeCard.innerHTML = `
                <div class="badge-icon">${badge.icon}</div>
                <div class="badge-name">${badge.name}</div>
                <div class="badge-category">${badge.category_ja}</div>
                <div class="badge-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${progressPercentage}%"></div>
                    </div>
                    <div class="progress-text">${badge.progress}/${badge.total}</div>
                </div>
            `;
            
            badgeCard.addEventListener('click', () => {
                openBadgeModal(badge);
            });
            
            badgesGrid.appendChild(badgeCard);
        });
    }
    
    function updateStats() {
        const acquiredCount = badges.filter(badge => badge.acquired).length;
        const totalCount = badges.length;
        const percentage = Math.round((acquiredCount / totalCount) * 100);
        
        badgesCountSpan.textContent = acquiredCount;
        badgesPercentageSpan.textContent = `${percentage}%`;
    }
    
    function renderRecentAchievements() {
        const emptyMessage = document.querySelector('.achievements-list .empty-message');
        
        if (userBadges.length === 0) {
            if (!emptyMessage) {
                const newEmptyMessage = document.createElement('p');
                newEmptyMessage.className = 'empty-message';
                newEmptyMessage.textContent = 'まだ達成したバッジはありません。冒険を続けましょう！';
                achievementsList.appendChild(newEmptyMessage);
            }
            return;
        }
        
        if (emptyMessage) {
            emptyMessage.remove();
        }
        
        achievementsList.innerHTML = '';
        
        const sortedBadges = [...userBadges].sort((a, b) => {
            if (!a.acquired_at) return 1;
            if (!b.acquired_at) return -1;
            return new Date(b.acquired_at) - new Date(a.acquired_at);
        });
        
        sortedBadges.forEach(badge => {
            const achievementItem = document.createElement('div');
            achievementItem.className = 'achievement-item';
            
            achievementItem.innerHTML = `
                <div class="achievement-icon">${badge.icon}</div>
                <div class="achievement-info">
                    <div class="achievement-name">${badge.name}</div>
                    <div class="achievement-date">${formatDate(badge.acquired_at)}</div>
                    <div class="achievement-description">${badge.description}</div>
                </div>
            `;
            
            achievementItem.addEventListener('click', () => {
                openBadgeModal(badge);
            });
            
            achievementsList.appendChild(achievementItem);
        });
    }
    
    function formatDate(dateString) {
        if (!dateString) return '';
        
        const date = new Date(dateString);
        return date.toLocaleDateString('ja-JP', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
    
    function openBadgeModal(badge) {
        const badgeIcon = document.querySelector('.badge-detail .badge-icon');
        const badgeName = document.getElementById('badge-name');
        const badgeDescription = document.getElementById('badge-description');
        const progressFill = document.querySelector('.badge-detail .progress-fill');
        const progressText = document.querySelector('.badge-detail .progress-text');
        const requirementsList = document.getElementById('requirements-list');
        
        badgeIcon.textContent = badge.icon;
        badgeName.textContent = badge.name;
        badgeDescription.textContent = badge.description;
        
        const progressPercentage = (badge.progress / badge.total) * 100;
        progressFill.style.width = `${progressPercentage}%`;
        progressText.textContent = `${badge.progress}/${badge.total}`;
        
        requirementsList.innerHTML = '';
        
        badge.requirements.forEach(req => {
            const li = document.createElement('li');
            li.className = req.completed ? 'completed' : '';
            li.textContent = req.description;
            requirementsList.appendChild(li);
        });
        
        badgeModal.style.display = 'block';
    }
    
    function closeBadgeModal() {
        badgeModal.style.display = 'none';
    }
    
    categoryTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            categoryTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            currentCategory = this.getAttribute('data-category');
            filterBadgesByCategory(currentCategory);
        });
    });
    
    closeButton.addEventListener('click', closeBadgeModal);
    closeBadgeDetailBtn.addEventListener('click', closeBadgeModal);
    
    loadBadges();
});
