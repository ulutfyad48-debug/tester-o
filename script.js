const FOLDERS = {
    novel: '1PWDGvI9Pxkzma58-BDPZYAxq4Mhw1gdu',
    poetry: '1Bje7U53wmDHhuUrAvj-NaHDAXAfMiG_h',
    codewords: '1n8MuNqMaOe6eAntLDf-zTHXaNji3NEkn',
    about: '1QHIFfbqFIcpzHKEwEzPlRovHrC4t7wkX'
};

const API_KEY = 'AIzaSyCMppjIJi2_xBi3oLVXN0XjdANMX10xmwE';
let purchasedEpisodes = JSON.parse(localStorage.getItem('purchased_episodes')) || [];
let currentPkg = null;

window.onload = loadEpisodes;

function showSection(section) {
    document.getElementById('home-screen').style.display = 'none';
    document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
    document.getElementById(section + '-section').classList.add('active');
    
    if (section !== 'novels') {
        loadDriveContent(FOLDERS[section], section + '-container');
    }
}

function showHome() {
    document.getElementById('home-screen').style.display = 'block';
    document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
}

function loadEpisodes() {
    const container = document.getElementById('episodes-container');
    container.innerHTML = '';
    for (let i = 1; i <= 100; i++) {
        const card = document.createElement('div');
        card.className = 'item-box';
        let pkg = i <= 10 ? 'free' : (i <= 80 ? Math.ceil((i-10)/5) : 'final');
        
        if (i <= 10 || purchasedEpisodes.includes('pkg_'+pkg)) {
            card.innerHTML = `قسط ${i}<br><small>اوپن</small>`;
            card.onclick = () => openNovel(i);
        } else {
            card.innerHTML = `قسط ${i}<br><small>لاک</small>`;
            card.onclick = () => {
                currentPkg = pkg;
                document.getElementById('payment-message').innerText = `قسط ${i} لاک ہے۔ کوڈ کے لیے رابطہ کریں۔`;
                document.getElementById('wa-btn').href = `https://wa.me/923125540048?text=I want code for Ep ${i}`;
                document.getElementById('payment-modal').classList.add('active');
            };
        }
        container.appendChild(card);
    }
}

async function loadDriveContent(folderId, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = 'لوڈ ہو رہا ہے...';
    const url = `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents+and+trashed=false&key=${API_KEY}`;
    try {
        const res = await fetch(url);
        const data = await res.json();
        container.innerHTML = '';
        data.files.forEach(f => {
            const div = document.createElement('div');
            div.className = 'item-box';
            div.innerHTML = `📄 ${f.name}`;
            div.onclick = () => window.open(f.webViewLink, '_blank');
            container.appendChild(div);
        });
    } catch (e) { container.innerHTML = 'فائلیں لوڈ نہیں ہو سکیں۔'; }
}

async function openNovel(num) {
    const url = `https://www.googleapis.com/drive/v3/files?q='${FOLDERS.novel}'+in+parents+and+name+contains+'${num}'+and+trashed=false&key=${API_KEY}`;
    try {
        const res = await fetch(url);
        const data = await res.json();
        if (data.files.length > 0) window.open(data.files[0].webViewLink, '_blank');
        else alert('فائل نہیں ملی۔');
    } catch (e) { alert('کنکشن مسئلہ۔'); }
}

function verifyCode() {
    const input = document.getElementById('code-input').value.trim().toUpperCase();
    if (input === `YHD${currentPkg}MS`.toUpperCase()) {
        purchasedEpisodes.push('pkg_'+currentPkg);
        localStorage.setItem('purchased_episodes', JSON.stringify(purchasedEpisodes));
        location.reload();
    } else alert('غلط کوڈ!');
}

function closeModal() { document.querySelectorAll('.modal').forEach(m => m.classList.remove('active')); }
function showCodeModal() { closeModal(); document.getElementById('code-modal').classList.add('active'); }
