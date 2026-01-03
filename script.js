const FOLDERS = {
    novel: '1PWDGvI9Pxkzma58-BDPZYAxq4Mhw1gdu',
    poetry: '1Bje7U53wmDHhuUrAvj-NaHDAXAfMiG_h'
};

const API_KEY = 'AIzaSyCMppjIJi2_xBi3oLVXN0XjdANMX10xmwE';

let purchasedEpisodes = JSON.parse(localStorage.getItem('purchased_episodes')) || [];
let currentPurchase = null;

window.onload = () => { loadEpisodes(); };

function showSection(section) {
    document.getElementById('home-screen').style.display = 'none';
    document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
    document.getElementById(section + '-section').classList.add('active');
    if (section === 'poetry') loadFiles(FOLDERS.poetry, 'poetry-container');
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
        card.className = 'episode-card';
        let pkgId = i <= 10 ? 'free' : (i <= 80 ? Math.ceil((i-10)/5) : 'final');
        
        if (i <= 10 || purchasedEpisodes.includes('pkg_'+pkgId)) {
            card.innerHTML = `قسط ${i}<br><span style="color:green;font-size:10px;">اوپن</span>`;
            card.onclick = () => openFile(i);
        } else {
            card.innerHTML = `قسط ${i}<br><span style="color:red;font-size:10px;">لاک</span>`;
            card.onclick = () => {
                currentPurchase = { pkgId };
                document.getElementById('payment-message').innerText = `قسط ${i} لاک ہے۔ کوڈ کے لیے رابطہ کریں۔`;
                document.getElementById('payment-modal').classList.add('active');
            };
        }
        container.appendChild(card);
    }
}

function verifyCode() {
    const input = document.getElementById('code-input').value.trim().toUpperCase();
    const expected = `YHD${currentPurchase.pkgId}MS`.toUpperCase();
    if (input === expected) {
        purchasedEpisodes.push('pkg_'+currentPurchase.pkgId);
        localStorage.setItem('purchased_episodes', JSON.stringify(purchasedEpisodes));
        alert('کامیاب!');
        location.reload();
    } else { alert('غلط کوڈ!'); }
}

async function openFile(num) {
    // فائل کو نام کے ذریعے ڈھونڈنا
    const url = `https://www.googleapis.com/drive/v3/files?q='${FOLDERS.novel}'+in+parents+and+name+contains+'${num}'+and+trashed=false&key=${API_KEY}`;
    try {
        const res = await fetch(url);
        const data = await res.json();
        if (data.files && data.files.length > 0) {
            window.open(data.files[0].webViewLink, '_blank');
        } else { alert('فائل ڈرائیو پر نہیں ملی۔ نام چیک کریں (مثال: 11.pdf)'); }
    } catch (e) { alert('کنکشن ایرر'); }
}

async function loadFiles(fId, cId) {
    const container = document.getElementById(cId);
    container.innerHTML = 'لوڈ ہو رہا ہے...';
    const url = `https://www.googleapis.com/drive/v3/files?q='${fId}'+in+parents+and+trashed=false&key=${API_KEY}`;
    try {
        const res = await fetch(url);
        const data = await res.json();
        container.innerHTML = '';
        data.files.forEach(f => {
            const div = document.createElement('div');
            div.className = 'episode-card';
            div.style.width = '100%';
            div.innerHTML = f.name;
            div.onclick = () => window.open(f.webViewLink, '_blank');
            container.appendChild(div);
        });
    } catch (e) { container.innerHTML = 'مسئلہ آیا۔'; }
}

function closeModal() { document.querySelectorAll('.modal').forEach(m => m.classList.remove('active')); }
function showCodeModal() { closeModal(); document.getElementById('code-modal').classList.add('active'); }
