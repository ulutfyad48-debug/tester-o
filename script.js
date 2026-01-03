const FOLDERS = {
    novel: '1PWDGvI9Pxkzma58-BDPZYAxq4Mhw1gdu',
    poetry: '1Bje7U53wmDHhuUrAvj-NaHDAXAfMiG_h',
    codewords: '1n8MuNqMaOe6eAntLDf-zTHXaNji3NEkn',
    about: '1QHIFfbqFIcpzHKEwEzPlRovHrC4t7wkX'
};

const API_KEY = 'AIzaSyCMppjIJi2_xBi3oLVXN0XjdANMX10xmwE';
const MY_WA = "923125540048";

let unlocked = JSON.parse(localStorage.getItem('nov_unlocked')) || [];
let currentPkg = "";

function getDailyCode(pkgId) {
    const d = new Date();
    return (pkgId + d.getDate() + (d.getMonth() + 1) + "X").toUpperCase();
}

function openSection(mode) {
    document.getElementById('home-screen').style.display = 'none';
    document.getElementById('content-screen').style.display = 'block';
    
    const titles = { novel:"ناول کی اقساط", poetry:"اردو شاعری", codewords:"کوڈ ورڈز", about:"مصنف" };
    document.getElementById('section-title').innerText = titles[mode];

    if (mode === 'novel') renderNovel(); else loadFiles(FOLDERS[mode]);
}

function renderNovel() {
    const list = document.getElementById('items-list');
    list.innerHTML = '';
    for (let i = 1; i <= 100; i++) {
        let pkg = getPkg(i);
        const isOpen = i <= 10 || unlocked.includes(pkg.id);
        
        const card = document.createElement('div');
        card.className = `card ${isOpen ? '' : 'locked'}`;
        card.innerHTML = `قسط ${i} <br> <small style="color:${isOpen?'green':'red'}">${isOpen?'🔓 اوپن':'🔒 لاک'}</small>`;
        
        card.onclick = isOpen ? () => fetchAndOpen(i, FOLDERS.novel) : () => {
            currentPkg = pkg.id;
            document.getElementById('pay-info').innerText = `قسط ${i} پیکیج کا حصہ ہے۔ قیمت: ${pkg.price} روپے۔`;
            // واٹس ایپ بیہیویر کو بہتر بنایا گیا ہے تاکہ میسج میں مکمل تفصیل جائے
            document.getElementById('wa-link').href = `https://wa.me/${MY_WA}?text=السلام علیکم! مجھے ناول کا پیکیج ${pkg.id} (قسط ${i}) خریدنا ہے۔ قیمت: ${pkg.price} روپے۔`;
            document.getElementById('pay-modal').classList.add('active');
        };
        list.appendChild(card);
    }
}

async function loadFiles(fId) {
    const list = document.getElementById('items-list');
    list.innerHTML = '<p style="grid-column:1/-1; text-align:center;">لوڈ ہو رہا ہے...</p>';
    const url = `https://www.googleapis.com/drive/v3/files?q='${fId}'+in+parents+and+trashed=false&key=${API_KEY}&fields=files(id,name,webViewLink)&orderBy=name`;
    try {
        const res = await fetch(url);
        const data = await res.json();
        list.innerHTML = '';
        if(data.files.length === 0) { list.innerHTML = 'کوئی فائل نہیں ملی۔'; return; }
        data.files.forEach(f => {
            const c = document.createElement('div');
            c.className = 'card';
            c.innerText = f.name.replace('.pdf','');
            c.onclick = () => window.open(f.webViewLink, '_blank'); // نئی ونڈو میں فائل کھولیں
            list.appendChild(c);
        });
    } catch (e) { list.innerHTML = 'فائلیں لوڈ نہیں ہو سکیں۔ پرمیشن چیک کریں۔'; }
}

function getPkg(n) {
    if (n <= 10) return { id: "FREE", price: 0 };
    if (n <= 50) return { id: "P1_" + Math.ceil((n-10)/5), price: 50 };
    if (n <= 80) return { id: "P2_" + Math.ceil((n-50)/5), price: 100 };
    return { id: "P3_FINAL", price: 300 };
}

async function fetchAndOpen(name, fId) {
    const url = `https://www.googleapis.com/drive/v3/files?q='${fId}'+in+parents+and+name+contains+'${name}'+and+trashed=false&key=${API_KEY}&fields=files(id,webViewLink)`;
    try {
        const res = await fetch(url);
        const data = await res.json();
        if (data.files.length > 0) window.open(data.files[0].webViewLink, '_blank');
        else alert("فائل ڈرائیو میں نہیں ملی!");
    } catch (e) { alert("نیٹ ورک ایرر!"); }
}

function checkAccess() {
    if (document.getElementById('user-code').value.trim().toUpperCase() === getDailyCode(currentPkg)) {
        unlocked.push(currentPkg);
        localStorage.setItem('nov_unlocked', JSON.stringify(unlocked));
        alert("ان لاک ہو گیا!"); location.reload();
    } else alert("غلط کوڈ!");
}

function closeModals() { document.querySelectorAll('.modal').forEach(m => m.classList.remove('active')); }
function showCodeInput() { closeModals(); document.getElementById('code-modal').classList.add('active'); }
