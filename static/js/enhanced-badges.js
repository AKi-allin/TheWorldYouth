/**
 * Enhanced Badges Implementation for World Youth Atlas
 * Features:
 * - Emphasized progress bars and achievement rates
 * - Silhouette hints for locked badges
 * - Badge unlock animations
 * - Detailed badge information
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log("Enhanced badges script is loading!");
    
    initEnhancedBadges();
    
    setupCategoryFilters();
    
    setupBadgeDetailModal();
});

const sampleBadges = [
    {
        id: "badge1",
        name: "世界旅行者",
        description: "世界中の様々な地域から会話を記録しよう",
        category: "region",
        icon: "🌍",
        progress: 2,
        total: 6,
        requirements: [
            { text: "北米から会話を記録する", completed: true },
            { text: "南米から会話を記録する", completed: false },
            { text: "ヨーロッパから会話を記録する", completed: true },
            { text: "アフリカから会話を記録する", completed: false },
            { text: "アジアから会話を記録する", completed: false },
            { text: "オセアニアから会話を記録する", completed: false }
        ],
        unlocked: true,
        hint: "世界の6大陸を探検しよう"
    },
    {
        id: "badge2",
        name: "文化コレクター",
        description: "様々な文化アイテムを集めよう",
        category: "collection",
        icon: "🏺",
        progress: 5,
        total: 10,
        requirements: [
            { text: "レアアイテムを3つ集める", completed: true },
            { text: "スーパーレアアイテムを1つ集める", completed: false }
        ],
        unlocked: true,
        hint: "ガチャを回して珍しいアイテムを集めよう"
    },
    {
        id: "badge3",
        name: "言語マスター",
        description: "様々な言語のあいさつを学ぼう",
        category: "activity",
        icon: "🗣️",
        progress: 0,
        total: 5,
        requirements: [
            { text: "5つの異なる言語であいさつを学ぶ", completed: false }
        ],
        unlocked: false,
        hint: "会話の中で新しい言語のあいさつを聞いてみよう"
    },
    {
        id: "badge4",
        name: "写真家",
        description: "会話の思い出を写真に残そう",
        category: "activity",
        icon: "📸",
        progress: 3,
        total: 5,
        requirements: [
            { text: "5つの会話で写真を撮る", completed: false }
        ],
        unlocked: true,
        hint: "会話の後に写真を撮ろう"
    },
    {
        id: "badge5",
        name: "ミッションマスター",
        description: "様々なミッションをクリアしよう",
        category: "activity",
        icon: "🎯",
        progress: 2,
        total: 10,
        requirements: [
            { text: "10個のミッションをクリアする", completed: false }
        ],
        unlocked: true,
        hint: "ミッションパネルでミッションを確認しよう"
    },
    {
        id: "badge6",
        name: "友情の架け橋",
        description: "長期間にわたって交流を続けよう",
        category: "special",
        icon: "🤝",
        progress: 0,
        total: 3,
        requirements: [
            { text: "同じ人と3回以上会話する", completed: false }
        ],
        unlocked: false,
        hint: "同じ人と何度も会話してみよう"
    },
    {
        id: "badge7",
        name: "文化大使",
        description: "自分の文化について5回紹介しよう",
        category: "special",
        icon: "🎭",
        progress: 0,
        total: 5,
        requirements: [
            { text: "自分の文化について5回紹介する", completed: false }
        ],
        unlocked: false,
        hint: "会話の中で自分の文化について話してみよう"
    },
    {
        id: "badge8",
        name: "ガチャマスター",
        description: "ガチャを50回引こう",
        category: "collection",
        icon: "🎁",
        progress: 12,
        total: 50,
        requirements: [
            { text: "ガチャを50回引く", completed: false }
        ],
        unlocked: true,
        hint: "毎日無料ガチャを引こう"
    },
    {
        id: "badge9",
        name: "推し国マニア",
        description: "推し国を3つ登録しよう",
        category: "region",
        icon: "⭐",
        progress: 1,
        total: 3,
        requirements: [
            { text: "推し国を3つ登録する", completed: false }
        ],
        unlocked: true,
        hint: "お気に入りの国を推し国に登録しよう"
    },
    {
        id: "badge10",
        name: "伝説の探検家",
        description: "すべてのバッジを獲得しよう",
        category: "special",
        icon: "👑",
        progress: 0,
        total: 9,
        requirements: [
            { text: "他のすべてのバッジを獲得する", completed: false }
        ],
        unlocked: false,
        hint: "まずは他のバッジを集めよう"
    }
];

const recentAchievements = [
    {
        badgeId: "badge1",
        name: "世界旅行者",
        description: "ヨーロッパから初めての会話を記録しました",
        date: "2025年4月28日",
        icon: "🌍"
    },
    {
        badgeId: "badge2",
        name: "文化コレクター",
        description: "レアアイテム「寿司」を獲得しました",
        date: "2025年4月27日",
        icon: "🏺"
    },
    {
        badgeId: "badge4",
        name: "写真家",
        description: "3人目の友達と写真を撮りました",
        date: "2025年4月25日",
        icon: "📸"
    }
];

function initEnhancedBadges() {
    addProgressGradients();
    
    updateBadgeStats();
    
    loadBadges();
    
    loadRecentAchievements();
}

function addProgressGradients() {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.style.width = "0";
    svg.style.height = "0";
    svg.style.position = "absolute";
    svg.setAttribute("aria-hidden", "true");
    
    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    
    const badgeGradient = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient");
    badgeGradient.setAttribute("id", "badge-progress-gradient");
    badgeGradient.setAttribute("x1", "0%");
    badgeGradient.setAttribute("y1", "0%");
    badgeGradient.setAttribute("x2", "100%");
    badgeGradient.setAttribute("y2", "0%");
    
    const stop1 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
    stop1.setAttribute("offset", "0%");
    stop1.setAttribute("stop-color", "#9b59b6");
    
    const stop2 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
    stop2.setAttribute("offset", "100%");
    stop2.setAttribute("stop-color", "#3498db");
    
    badgeGradient.appendChild(stop1);
    badgeGradient.appendChild(stop2);
    defs.appendChild(badgeGradient);
    
    svg.appendChild(defs);
    document.body.appendChild(svg);
}

function updateBadgeStats() {
    const badgesCount = sampleBadges.filter(badge => badge.unlocked).length;
    const totalBadges = sampleBadges.length;
    const percentage = Math.round((badgesCount / totalBadges) * 100);
    
    document.getElementById('badges-count').textContent = badgesCount;
    document.getElementById('badges-percentage').textContent = `${percentage}%`;
    
    const statsContainer = document.querySelector('.badges-stats');
    if (!statsContainer) return;
    
    const stats = statsContainer.querySelectorAll('.stat');
    
    stats.forEach((stat, index) => {
        const statValue = stat.querySelector('span').textContent;
        const statLabel = stat.querySelector('label').textContent;
        let percentage = 0;
        
        if (index === 0) { // Badges count
            percentage = Math.round((parseInt(statValue) / totalBadges) * 100);
        } else { // Already percentage
            percentage = parseInt(statValue);
        }
        
        const circleRadius = 54;
        const circleCircumference = 2 * Math.PI * circleRadius;
        
        const statCircle = document.createElement('div');
        statCircle.className = 'stat-circle';
        
        const circleSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        circleSvg.setAttribute("viewBox", "0 0 120 120");
        
        const backgroundCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        backgroundCircle.setAttribute("cx", "60");
        backgroundCircle.setAttribute("cy", "60");
        backgroundCircle.setAttribute("r", circleRadius);
        backgroundCircle.classList.add("bg");
        
        const progressCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        progressCircle.setAttribute("cx", "60");
        progressCircle.setAttribute("cy", "60");
        progressCircle.setAttribute("r", circleRadius);
        progressCircle.classList.add("progress");
        progressCircle.style.strokeDasharray = circleCircumference;
        progressCircle.style.strokeDashoffset = circleCircumference - (percentage / 100) * circleCircumference;
        
        circleSvg.appendChild(backgroundCircle);
        circleSvg.appendChild(progressCircle);
        
        const percentageText = document.createElement('div');
        percentageText.className = 'percentage';
        percentageText.textContent = index === 0 ? statValue : `${percentage}%`;
        
        statCircle.appendChild(circleSvg);
        statCircle.appendChild(percentageText);
        
        stat.innerHTML = '';
        stat.appendChild(statCircle);
        
        const newLabel = document.createElement('label');
        newLabel.textContent = statLabel;
        stat.appendChild(newLabel);
    });
}

function loadBadges() {
    const badgesGrid = document.querySelector('.badges-grid');
    if (!badgesGrid) return;
    
    badgesGrid.innerHTML = '';
    
    sampleBadges.forEach(badge => {
        const badgeCard = document.createElement('div');
        badgeCard.className = `badge-card ${badge.unlocked ? '' : 'locked'}`;
        badgeCard.dataset.category = badge.category;
        badgeCard.dataset.id = badge.id;
        
        const badgeIcon = document.createElement('div');
        badgeIcon.className = 'badge-icon';
        badgeIcon.innerHTML = badge.icon;
        
        if (!badge.unlocked) {
            const badgeSilhouette = document.createElement('div');
            badgeSilhouette.className = 'badge-silhouette';
            badgeSilhouette.innerHTML = '<i class="fas fa-question"></i>';
            badgeCard.appendChild(badgeSilhouette);
            
            const badgeHint = document.createElement('div');
            badgeHint.className = 'badge-hint';
            badgeHint.textContent = badge.hint;
            badgeCard.appendChild(badgeHint);
        }
        
        const badgeName = document.createElement('div');
        badgeName.className = 'badge-name';
        badgeName.textContent = badge.name;
        
        const badgeCategory = document.createElement('div');
        badgeCategory.className = 'badge-category';
        badgeCategory.textContent = getCategoryName(badge.category);
        
        const badgeProgress = document.createElement('div');
        badgeProgress.className = 'badge-progress';
        
        const progressLabel = document.createElement('div');
        progressLabel.className = 'progress-label';
        progressLabel.innerHTML = `<span>進捗</span><span>${badge.progress}/${badge.total}</span>`;
        
        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';
        
        const progressFill = document.createElement('div');
        progressFill.className = 'progress-fill';
        progressFill.style.width = `${(badge.progress / badge.total) * 100}%`;
        
        const progressText = document.createElement('div');
        progressText.className = 'progress-text';
        progressText.textContent = `${Math.round((badge.progress / badge.total) * 100)}%`;
        
        progressBar.appendChild(progressFill);
        badgeProgress.appendChild(progressLabel);
        badgeProgress.appendChild(progressBar);
        badgeProgress.appendChild(progressText);
        
        badgeCard.appendChild(badgeIcon);
        badgeCard.appendChild(badgeName);
        badgeCard.appendChild(badgeCategory);
        badgeCard.appendChild(badgeProgress);
        
        badgeCard.addEventListener('click', () => {
            showBadgeDetail(badge);
        });
        
        badgesGrid.appendChild(badgeCard);
    });
}

function getCategoryName(category) {
    const categories = {
        'region': '地域',
        'collection': 'コレクション',
        'activity': '活動',
        'special': '特別'
    };
    
    return categories[category] || category;
}

function loadRecentAchievements() {
    const achievementsList = document.querySelector('.achievements-list');
    if (!achievementsList) return;
    
    achievementsList.innerHTML = '';
    
    if (recentAchievements.length === 0) {
        const emptyMessage = document.createElement('p');
        emptyMessage.className = 'empty-message';
        emptyMessage.textContent = 'まだ達成したバッジはありません。冒険を続けましょう！';
        achievementsList.appendChild(emptyMessage);
        return;
    }
    
    recentAchievements.forEach(achievement => {
        const achievementItem = document.createElement('div');
        achievementItem.className = 'achievement-item';
        
        const achievementIcon = document.createElement('div');
        achievementIcon.className = 'achievement-icon';
        achievementIcon.innerHTML = achievement.icon;
        
        const achievementInfo = document.createElement('div');
        achievementInfo.className = 'achievement-info';
        
        const achievementName = document.createElement('div');
        achievementName.className = 'achievement-name';
        achievementName.textContent = achievement.name;
        
        const achievementDate = document.createElement('div');
        achievementDate.className = 'achievement-date';
        achievementDate.innerHTML = `<i class="far fa-calendar-alt"></i> ${achievement.date}`;
        
        const achievementDescription = document.createElement('div');
        achievementDescription.className = 'achievement-description';
        achievementDescription.textContent = achievement.description;
        
        achievementInfo.appendChild(achievementName);
        achievementInfo.appendChild(achievementDate);
        achievementInfo.appendChild(achievementDescription);
        
        achievementItem.appendChild(achievementIcon);
        achievementItem.appendChild(achievementInfo);
        
        achievementsList.appendChild(achievementItem);
    });
}

function setupCategoryFilters() {
    const categoryTabs = document.querySelectorAll('.category-tab');
    if (!categoryTabs.length) return;
    
    categoryTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            categoryTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            const category = tab.dataset.category;
            filterBadges(category);
        });
    });
}

function filterBadges(category) {
    const badgeCards = document.querySelectorAll('.badge-card');
    if (!badgeCards.length) return;
    
    badgeCards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
            card.style.display = '';
            card.classList.add('badge-entrance');
            setTimeout(() => {
                card.classList.remove('badge-entrance');
            }, 500);
        } else {
            card.style.display = 'none';
        }
    });
}

function setupBadgeDetailModal() {
    const modal = document.getElementById('badge-modal');
    if (!modal) return;
    
    const closeButton = modal.querySelector('.close-button');
    const closeDetailButton = document.getElementById('close-badge-detail');
    
    if (closeButton) {
        closeButton.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }
    
    if (closeDetailButton) {
        closeDetailButton.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }
    
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

function showBadgeDetail(badge) {
    const modal = document.getElementById('badge-modal');
    if (!modal) return;
    
    const badgeIcon = modal.querySelector('.badge-icon');
    const badgeName = document.getElementById('badge-name');
    const badgeDescription = document.getElementById('badge-description');
    const progressFill = modal.querySelector('.progress-fill');
    const progressText = modal.querySelector('.progress-text');
    const requirementsList = document.getElementById('requirements-list');
    
    badgeIcon.innerHTML = badge.icon;
    badgeName.textContent = badge.name;
    badgeDescription.textContent = badge.description;
    
    const progressPercentage = (badge.progress / badge.total) * 100;
    progressFill.style.width = `${progressPercentage}%`;
    progressText.textContent = `${badge.progress}/${badge.total}`;
    
    requirementsList.innerHTML = '';
    badge.requirements.forEach(req => {
        const li = document.createElement('li');
        li.textContent = req.text;
        if (req.completed) {
            li.classList.add('completed');
        }
        requirementsList.appendChild(li);
    });
    
    modal.style.display = 'block';
    
    if (badge.unlocked && badge.isNew) {
        badgeIcon.classList.add('badge-unlocked');
        setTimeout(() => {
            badgeIcon.classList.remove('badge-unlocked');
        }, 1000);
    }
}

function unlockBadge(badgeId) {
    const badge = sampleBadges.find(b => b.id === badgeId);
    if (!badge || badge.unlocked) return;
    
    badge.unlocked = true;
    badge.isNew = true; // Flag for animation
    
    loadBadges();
    updateBadgeStats();
    
    showBadgeUnlockNotification(badge);
    
    const now = new Date();
    const formattedDate = `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日`;
    
    recentAchievements.unshift({
        badgeId: badge.id,
        name: badge.name,
        description: `${badge.name}バッジを獲得しました！`,
        date: formattedDate,
        icon: badge.icon
    });
    
    loadRecentAchievements();
    
    setTimeout(() => {
        showBadgeDetail(badge);
    }, 1500);
}

function showBadgeUnlockNotification(badge) {
    const notification = document.createElement('div');
    notification.className = 'badge-unlock-notification';
    notification.innerHTML = `
        <div class="notification-icon">${badge.icon}</div>
        <div class="notification-content">
            <h3>新しいバッジを獲得！</h3>
            <p>${badge.name}</p>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 500);
    }, 5000);
}

window.unlockBadge = unlockBadge;
