const FOLDERS = {
    novel: '1PWDGvI9Pxkzma58-BDPZYAxq4Mhw1gdu',
    poetry: '1Bje7U53wmDHhuUrAvj-NaHDAXAfMiG_h',
    codewords: '1n8MuNqMaOe6eAntLDf-zTHXaNji3NEkn',
    about: '1QHIFfbqFIcpzHKEwEzPlRovHrC4t7wkX'
};

const API_KEY = 'AIzaSyCMppjIJi2_xBi3oLVXN0XjdANMX10xmwE';
const MY_WA = "923125540048";

let unlocked = JSON.parse(localStorage.getItem('nov_unlocked')) || [];
let currentPkgId = "";

// ڈیلی کوڈ فارمولا: PKG_ID + Date + Month + X
function getDailyCode(pkgId) {
    const d = new Date();
    const codeKey = pkgId + d.getDate() + (d.getMonth() + 1) + "X";
    return codeKey.toUpperCase();
}

function showSection(mode) {
    document.getElementById('home-screen').style.display = 'none';
    document.getElementById('content-screen').style.display = 'block';
    
    const titles = { novel: "ناول کی اقساط", poetry: "اردو شاعری", codewords: "کوڈ ورڈز", about: "مصنف" };
    document.getElementById('section-title').innerText = titles[mode];

    if (mode === 'novel') renderNovel(); else loadAutoFiles(FOLDERS[mode]);
}

function renderNovel() {
    const list = document.getElementById('items-list');
    list.innerHTML = '';
    for (let i = 1; i <= 100; i++) {
        let pkg = getPkgData(i);
        const card = document.createElement('div');
        const isOpen = i <= 10 || unlocked.includes(pkg.id);

        card.className = `item-card ${isOpen ? '' : 'locked'}`;
        card.innerHTML = `قسط ${i} <span class="status" style="color:${isOpen?'green':'red'}">${isOpen?'🔓 اوپن':'🔒 لاک'}</span>`;
        card.onclick = isOpen ? () => openFile(i, FOLDERS.novel) : () => openPayModal(pkg, i);
        list.appendChild(card);
    }
}

async function loadAutoFiles(folderId) {
    const list = document.getElementById('items-list');
    list.innerHTML = '<p style="grid-column:1/-1; text-align:center;">لوڈ ہو رہا ہے...</p>';
    const url = `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents+and+trashed=false&key=${API_KEY}&fields=files(id,name,webViewLink)&orderBy=name`;
    try {
        const res = await fetch(url);
        const data = await res.json();
        list.innerHTML = '';
        data.files.forEach(file => {
            const card = document.createElement('div');
            card.className = 'item-card';
            card.innerText = file.name.replace('.pdf', '');
            card.onclick = () => window.location.assign(file.webViewLink);
            list.appendChild(card);
        });
    } catch (e) { list.innerHTML = 'نیٹ ورک ایرر!'; }
}

function getPkgData(n) {
    if (n <= 10) return { id: "FREE", price: 0 };
    if (n <= 50) return { id: "P1_" + Math.ceil((n-10)/5), price: 50 };
    if (n <= 80) return { id: "P2_" + Math.ceil((n-50)/5), price: 100 };
    return { id: "P3_FINAL", price: 300 };
}

function openPayModal(pkg, num) {
    currentPkgId = pkg.id;
    document.getElementById('pay-info').innerText = `قسط ${num} پیکیج کا حصہ ہے۔ قیمت: ${pkg.price} روپے۔`;
    document.getElementById('wa-link').href = `https://wa.me/${MY_WA}?text=السلام علیکم! مجھے پیکیج ${pkg.id} خریدنا ہے۔ قیمت: ${pkg.price} روپے۔`;
    document.getElementById('pay-modal').classList.add('active');
}

async function openFile(name, folderId) {
    const url = `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents+and+name+contains+'${name}'+and+trashed=false&key=${API_KEY}&fields=files(id,webViewLink)`;
    try {
        const res = await fetch(url);
        const data = await res.json();
        if (data.files.length > 0) window.location.assign(data.files[0].webViewLink);
    } catch (e) { alert("مسئلہ آ رہا ہے۔"); }
}

function verifyAccess() {
    const userInput = document.getElementById('user-code').value.trim().toUpperCase();
    if (userInput === getDailyCode(currentPkgId)) {
        unlocked.push(currentPkgId);
        localStorage.setItem('nov_unlocked', JSON.stringify(unlocked));
        alert("ان لاک ہو گیا!"); location.reload();
    } else alert("غلط کوڈ!");
}

function goHome() { location.reload(); }
function closeModals() { document.querySelectorAll('.modal').forEach(m => m.classList.remove('active')); }
function showCodeInput() { closeModals(); document.getElementById('code-modal').classList.add('active'); }
