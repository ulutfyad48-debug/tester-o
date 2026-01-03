const FOLDERS = {
    novel: '1PWDGvI9Pxkzma58-BDPZYAxq4Mhw1gdu',
    poetry: '1Bje7U53wmDHhuUrAvj-NaHDAXAfMiG_h',
    codewords: '1n8MuNqMaOe6eAntLDf-zTHXaNji3NEkn',
    about: '1QHIFfbqFIcpzHKEwEzPlRovHrC4t7wkX'
};

const API_KEY = 'AIzaSyCMppjIJi2_xBi3oLVXN0XjdANMX10xmwE';

let purchasedEpisodes = JSON.parse(localStorage.getItem('purchased_episodes')) || [];

window.onload = () => { loadEpisodes(); };

function showSection(section) {
    document.getElementById('home-screen').style.display = 'none';
    document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
    const targetSection = document.getElementById(section + '-section');
    targetSection.classList.add('active');

    // Baaki sections load karne ka naya tarika
    if (section === 'poetry') loadDriveContent(FOLDERS.poetry, 'poetry-container');
    if (section === 'codewords') loadDriveContent(FOLDERS.codewords, 'codewords-container');
    if (section === 'about') loadDriveContent(FOLDERS.about, 'about-container');
}

function showHome() {
    document.getElementById('home-screen').style.display = 'block';
    document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
}

async function loadDriveContent(folderId, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = '<div style="color:white; text-align:center;">لوڈ ہو رہا ہے...</div>';
    
    // API Query jo folder ke andar ki saari files nikaalti hai
    const url = `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents+and+trashed=false&key=${API_KEY}&fields=files(id,name,webViewLink)`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.files && data.files.length > 0) {
            container.innerHTML = '';
            data.files.forEach(file => {
                const item = document.createElement('div');
                item.className = 'episode-card'; // Styling purani hi use hogi
                item.style.width = '100%';
                item.style.marginBottom = '10px';
                item.innerHTML = `📄 ${file.name}`;
                item.onclick = () => window.open(file.webViewLink, '_blank');
                container.appendChild(item);
            });
        } else {
            container.innerHTML = '<div style="color:white; text-align:center;">ابھی کوئی فائل موجود نہیں ہے۔</div>';
        }
    } catch (error) {
        container.innerHTML = '<div style="color:white; text-align:center;">کنکشن کا مسئلہ یا فولڈر پبلک نہیں ہے۔</div>';
    }
}

// Baki Novel load hone ka function wahi rahega jo pehle diya tha
