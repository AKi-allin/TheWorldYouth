document.addEventListener('DOMContentLoaded', function() {
    const favoriteSlots = document.querySelectorAll('.favorite-slot');
    const regionTabs = document.querySelectorAll('.region-tab');
    const countriesGrid = document.querySelector('.countries-grid');
    const countrySearch = document.getElementById('country-search');
    const searchButton = document.getElementById('search-button');
    const countryModal = document.getElementById('country-modal');
    const closeButton = document.querySelector('.close-button');
    const confirmCountryBtn = document.getElementById('confirm-country');
    const cancelSelectionBtn = document.getElementById('cancel-selection');
    const selectedRankSpan = document.getElementById('selected-rank');
    
    let countries = [];
    let filteredCountries = [];
    let selectedCountry = null;
    let selectedRank = 1;
    let currentRegion = 'all';
    let favorites = [null, null, null]; // 3 slots, 0-indexed
    
    const sampleCountries = [
        {
            id: 'jp',
            name: '日本',
            name_en: 'Japan',
            region: 'asia',
            region_ja: 'アジア',
            flag: '🇯🇵',
            description: '東アジアに位置する島国。伝統と現代技術が融合した文化を持つ。',
            icon: '🏯'
        },
        {
            id: 'us',
            name: 'アメリカ合衆国',
            name_en: 'United States',
            region: 'north-america',
            region_ja: '北米',
            flag: '🇺🇸',
            description: '北アメリカに位置する連邦共和国。多様な文化と広大な国土を持つ。',
            icon: '🗽'
        },
        {
            id: 'cn',
            name: '中国',
            name_en: 'China',
            region: 'asia',
            region_ja: 'アジア',
            flag: '🇨🇳',
            description: '東アジアに位置する世界最大の人口を持つ国。長い歴史と豊かな文化がある。',
            icon: '🐼'
        },
        {
            id: 'kr',
            name: '韓国',
            name_en: 'South Korea',
            region: 'asia',
            region_ja: 'アジア',
            flag: '🇰🇷',
            description: '東アジアの朝鮮半島南部に位置する国。K-POPやドラマなど現代文化が人気。',
            icon: '🥁'
        },
        {
            id: 'gb',
            name: 'イギリス',
            name_en: 'United Kingdom',
            region: 'europe',
            region_ja: 'ヨーロッパ',
            flag: '🇬🇧',
            description: '西ヨーロッパに位置する島国。長い歴史と伝統を持つ。',
            icon: '👑'
        },
        {
            id: 'fr',
            name: 'フランス',
            name_en: 'France',
            region: 'europe',
            region_ja: 'ヨーロッパ',
            flag: '🇫🇷',
            description: '西ヨーロッパに位置する国。芸術、料理、ファッションで知られる。',
            icon: '🗼'
        },
        {
            id: 'it',
            name: 'イタリア',
            name_en: 'Italy',
            region: 'europe',
            region_ja: 'ヨーロッパ',
            flag: '🇮🇹',
            description: '南ヨーロッパに位置する国。美食、芸術、歴史的建造物で有名。',
            icon: '🍕'
        },
        {
            id: 'au',
            name: 'オーストラリア',
            name_en: 'Australia',
            region: 'oceania',
            region_ja: 'オセアニア',
            flag: '🇦🇺',
            description: 'オセアニアに位置する国。広大な自然と独特の野生動物で知られる。',
            icon: '🦘'
        },
        {
            id: 'br',
            name: 'ブラジル',
            name_en: 'Brazil',
            region: 'south-america',
            region_ja: '南米',
            flag: '🇧🇷',
            description: '南アメリカに位置する最大の国。サッカー、カーニバル、アマゾンの熱帯雨林で有名。',
            icon: '⚽'
        },
        {
            id: 'eg',
            name: 'エジプト',
            name_en: 'Egypt',
            region: 'africa',
            region_ja: 'アフリカ',
            flag: '🇪🇬',
            description: '北アフリカに位置する国。古代文明とピラミッドで知られる。',
            icon: '🔺'
        }
    ];
    
    function loadCountries() {
        countries = sampleCountries;
        filteredCountries = [...countries];
        
        const loadingIndicator = document.querySelector('.loading-indicator');
        if (loadingIndicator) {
            loadingIndicator.remove();
        }
        
        renderCountries();
    }
    
    function filterCountriesByRegion(region) {
        if (region === 'all') {
            filteredCountries = [...countries];
        } else {
            filteredCountries = countries.filter(country => country.region === region);
        }
        
        renderCountries();
    }
    
    function filterCountriesBySearch(term) {
        if (!term) {
            filterCountriesByRegion(currentRegion);
            return;
        }
        
        const lowerTerm = term.toLowerCase();
        
        filteredCountries = countries.filter(country => 
            country.name.toLowerCase().includes(lowerTerm) || 
            country.name_en.toLowerCase().includes(lowerTerm)
        );
        
        renderCountries();
    }
    
    function renderCountries() {
        countriesGrid.innerHTML = '';
        
        if (filteredCountries.length === 0) {
            const emptyMessage = document.createElement('div');
            emptyMessage.className = 'empty-message';
            emptyMessage.textContent = '国が見つかりませんでした。';
            countriesGrid.appendChild(emptyMessage);
            return;
        }
        
        filteredCountries.forEach(country => {
            const countryCard = document.createElement('div');
            countryCard.className = 'country-card';
            countryCard.setAttribute('data-country-id', country.id);
            
            countryCard.innerHTML = `
                <div class="country-card-flag">${country.flag}</div>
                <div class="country-card-name">${country.name}</div>
            `;
            
            countryCard.addEventListener('click', () => {
                openCountryModal(country);
            });
            
            countriesGrid.appendChild(countryCard);
        });
    }
    
    function openCountryModal(country) {
        selectedCountry = country;
        
        const countryFlag = document.querySelector('.country-flag');
        const countryName = document.getElementById('country-name');
        const countryRegion = document.getElementById('country-region');
        const countryDescription = document.getElementById('country-description');
        
        countryFlag.textContent = country.flag;
        countryName.textContent = country.name;
        countryRegion.textContent = country.region_ja;
        countryDescription.textContent = country.description;
        
        selectedRankSpan.textContent = selectedRank;
        
        countryModal.style.display = 'block';
    }
    
    function closeCountryModal() {
        countryModal.style.display = 'none';
        selectedCountry = null;
    }
    
    function setFavoriteCountry(country, rank) {
        favorites[rank - 1] = country;
        
        const slot = document.querySelector(`.favorite-slot[data-rank="${rank}"]`);
        const placeholder = slot.querySelector('.country-placeholder');
        let selected = slot.querySelector('.country-selected');
        
        if (!selected) {
            selected = document.createElement('div');
            selected.className = 'country-selected';
            
            selected.innerHTML = `
                <div class="country-flag"></div>
                <div class="country-name"></div>
                <div class="country-region"></div>
                <button class="remove-favorite"><i class="fas fa-times"></i></button>
            `;
            
            slot.appendChild(selected);
            
            const removeBtn = selected.querySelector('.remove-favorite');
            removeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                removeFavorite(rank);
            });
        }
        
        selected.querySelector('.country-flag').textContent = country.flag;
        selected.querySelector('.country-name').textContent = country.name;
        selected.querySelector('.country-region').textContent = country.region_ja;
        
        placeholder.style.display = 'none';
        selected.style.display = 'block';
        
        saveFavorites();
    }
    
    function removeFavorite(rank) {
        favorites[rank - 1] = null;
        
        const slot = document.querySelector(`.favorite-slot[data-rank="${rank}"]`);
        const placeholder = slot.querySelector('.country-placeholder');
        const selected = slot.querySelector('.country-selected');
        
        if (selected) {
            placeholder.style.display = 'flex';
            selected.style.display = 'none';
        }
        
        saveFavorites();
    }
    
    function saveFavorites() {
        const favoritesData = favorites.map(country => country ? country.id : null);
        localStorage.setItem('favoriteCountries', JSON.stringify(favoritesData));
    }
    
    function loadFavorites() {
        const savedFavorites = localStorage.getItem('favoriteCountries');
        
        if (savedFavorites) {
            const favoritesData = JSON.parse(savedFavorites);
            
            favoritesData.forEach((countryId, index) => {
                if (countryId) {
                    const country = countries.find(c => c.id === countryId);
                    if (country) {
                        setFavoriteCountry(country, index + 1);
                    }
                }
            });
        }
    }
    
    favoriteSlots.forEach(slot => {
        slot.addEventListener('click', function() {
            selectedRank = parseInt(this.getAttribute('data-rank'));
            
            const existingCountry = favorites[selectedRank - 1];
            if (existingCountry) {
                openCountryModal(existingCountry);
            } else {
                selectedRankSpan.textContent = selectedRank;
            }
        });
    });
    
    regionTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            regionTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            currentRegion = this.getAttribute('data-region');
            filterCountriesByRegion(currentRegion);
        });
    });
    
    searchButton.addEventListener('click', function() {
        filterCountriesBySearch(countrySearch.value);
    });
    
    countrySearch.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            filterCountriesBySearch(this.value);
        }
    });
    
    closeButton.addEventListener('click', closeCountryModal);
    
    confirmCountryBtn.addEventListener('click', function() {
        if (selectedCountry) {
            setFavoriteCountry(selectedCountry, selectedRank);
            closeCountryModal();
        }
    });
    
    cancelSelectionBtn.addEventListener('click', closeCountryModal);
    
    loadCountries();
    
    setTimeout(loadFavorites, 100);
});
