const WEATHER_API_KEY = 'YOUR_API_KEY'; // Replace with your actual API key
const WEATHER_API_BASE = 'https://api.weatherapi.com/v1';

// DOM elements
const elements = {
    cityInput: document.getElementById('cityInput'),
    searchBtn: document.getElementById('searchBtn'),
    weatherCard: document.getElementById('weatherCard'),
    loading: document.getElementById('loading'),
    errorMessage: document.getElementById('errorMessage')
};

// API calls
async function fetchWeather(city) {
    const url = `${WEATHER_API_BASE}/current.json?key=${WEATHER_API_KEY}&q=${encodeURIComponent(city)}&aqi=no`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Weather unavailable');
    return response.json();
}

async function fetchForecast(city) {
    const url = `${WEATHER_API_BASE}/forecast.json?key=${WEATHER_API_KEY}&q=${encodeURIComponent(city)}&days=7&aqi=no&alerts=no`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Forecast unavailable');
    return response.json();
}

// Display functions
function displayWeather(data) {
    document.getElementById('cityName').textContent = `${data.location.name}, ${data.location.country}`;
    document.getElementById('temp').textContent = `${data.current.temp_c}°C`;
    document.getElementById('description').textContent = data.current.condition.text;
    document.getElementById('weatherIcon').src = `https:${data.current.condition.icon}`;
    document.getElementById('humidity').textContent = `${data.current.humidity}%`;
    document.getElementById('windSpeed').textContent = `${data.current.wind_kph} km/h`;
    document.getElementById('pressure').textContent = `${data.current.pressure_mb} hPa`;
    document.getElementById('visibility').textContent = `${data.current.vis_km} km`;
    document.getElementById('feelsLike').textContent = `Feels like ${data.current.feelslike_c}°C`;
    elements.weatherCard.style.display = 'block';
}

function displayForecast(data) {
    const container = document.getElementById('forecastCards');
    container.innerHTML = data.forecast.forecastday.map(f => `
        <div class="forecast-card">
            <div class="font-medium text-white/90 mb-3 text-sm">
                ${new Date(f.date).toLocaleDateString('en-US', {weekday: 'short', month: 'short', day: 'numeric'})}
            </div>
            <img src="https:${f.day.condition.icon}" alt="${f.day.condition.text}" class="w-12 h-12 mx-auto mb-3">
            <div class="text-lg font-semibold text-white mb-1">${f.day.maxtemp_c}°</div>
            <div class="text-sm text-white/70 mb-2">${f.day.mintemp_c}°</div>
            <div class="text-xs text-white/60 capitalize leading-tight">${f.day.condition.text}</div>
        </div>
    `).join('');
}

// Update current date display
function updateCurrentDate() {
    const now = new Date();
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    document.getElementById('currentDate').textContent = now.toLocaleDateString('en-US', options);
}

// Show/hide elements with smooth transitions
function showLoading() {
    elements.loading.classList.remove('hidden');
    elements.errorMessage.classList.add('hidden');
}

function hideLoading() {
    elements.loading.classList.add('hidden');
}

function showError(message) {
    document.getElementById('errorMessage').querySelector('p').textContent = message;
    elements.errorMessage.classList.remove('hidden');
    setTimeout(() => {
        elements.errorMessage.classList.add('hidden');
    }, 5000);
}

// Main function
async function getWeather(city) {
    try {
        showLoading();
        const [weather, forecast] = await Promise.all([
            fetchWeather(city),
            fetchForecast(city)
        ]);
        displayWeather(weather);
        displayForecast(forecast);
        updateCurrentDate();
        // Show forecast card after successful fetch
        document.getElementById('forecast').style.display = 'block';
    } catch (error) {
        showError('Unable to fetch weather data. Please try again.');
        elements.weatherCard.style.display = 'none';
        document.getElementById('forecast').style.display = 'none';
    } finally {
        hideLoading();
    }
}

// Event listeners
elements.searchBtn.addEventListener('click', () => {
    const city = elements.cityInput.value.trim();
    if (city) {
        getWeather(city);
        elements.cityInput.value = '';
    }
});

elements.cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') elements.searchBtn.click();
});

// Initialize app (no default weather fetch)
document.addEventListener('DOMContentLoaded', () => {
    elements.weatherCard.style.display = 'none';
    document.getElementById('forecast').style.display = 'none';
    updateCurrentDate();
    setInterval(updateCurrentDate, 60000);
});

// Add this function to test different backgrounds
function cycleBackgrounds() {
    const backgrounds = [
        'linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)',
        'linear-gradient(45deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%)',
        'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
        '#0f0f23'
    ];
    
    let currentBg = 0;
    
    setInterval(() => {
        document.body.style.background = backgrounds[currentBg];
        document.body.style.backgroundSize = '400% 400%';
        currentBg = (currentBg + 1) % backgrounds.length;
    }, 5000);
}

cycleBackgrounds();
