const DRIVE_FOLDER = '1PWDGvI9Pxkzma58-BDPZYAxq4Mhw1gdu';
const API_KEY = 'AIzaSyCMppjIJi2_xBi3oLVXN0XjdANMX10xmwE';
const MY_WA = "923125540048";

let unlocked = JSON.parse(localStorage.getItem('nov_unlocked')) || [];
let currentPkgId = "";

// روزانہ کوڈ بدلنے کا فارمولا
function getDailyCode(pkgId) {
    const today = new Date();
    const dateStr = today.getDate().toString() + (today.getMonth() + 1).toString(); 
    // فارمولا: PKG_ID + آج کی تاریخ + X
    return (pkgId + dateStr + "X").toUpperCase();
}

function showNovels() {
    document.getElementById('home-screen').style.display = 'none';
    document.getElementById('novel-screen').style.display = 'block';
    renderEpisodes();
}

function renderEpisodes() {
    const list = document.getElementById('episodes-list');
    list.innerHTML = '';

    for (let i = 1; i <= 100; i++) {
        let pkg = getPkgData(i);
        const card = document.createElement('div');
        
        const isFree = i <= 10;
        const isOpen = unlocked.includes(pkg.id);

        if (isFree || isOpen) {
            card.className = 'ep-card';
            card.innerHTML = `قسط ${i} <span class="status" style="color:green">🔓 اوپن</span>`;
            card.onclick = () => openFile(i);
        } else {
            card.className = 'ep-card locked';
            card.innerHTML = `قسط ${i} <span class="status" style="color:red">🔒 لاک</span>`;
            card.onclick = () => {
                currentPkgId = pkg.id;
                document.getElementById('pay-info').innerText = `قسط ${i} پیکیج کا حصہ ہے۔ قیمت: ${pkg.price} روپے۔`;
                document.getElementById('wa-link').href = `https://wa.me/${MY_WA}?text=السلام علیکم! مجھے ناول کا پیکیج ${pkg.id} خریدنا ہے۔ قیمت: ${pkg.price} روپے۔ (تاریخ: ${new Date().toLocaleDateString()})`;
                document.getElementById('pay-modal').classList.add('active');
            };
        }
        list.appendChild(card);
    }
}

function getPkgData(n) {
    if (n <= 10) return { id: "FREE", price: 0 };
    if (n <= 50) return { id: "P1_" + Math.ceil((n-10)/5), price: 50 };
    if (n <= 80) return { id: "P2_" + Math.ceil((n-50)/5), price: 100 };
    return { id: "P3_FINAL", price: 300 };
}

async function openFile(num) {
    const url = `https://www.googleapis.com/drive/v3/files?q='${DRIVE_FOLDER}'+in+parents+and+name+contains+'${num}'+and+trashed=false&key=${API_KEY}&fields=files(id,webViewLink)`;
    try {
        const res = await fetch(url);
        const data = await res.json();
        if (data.files && data.files.length > 0) {
            window.location.assign(data.files[0].webViewLink);
        } else { alert("فائل اپلوڈ نہیں ہوئی۔"); }
    } catch (e) { alert("نیٹ ورک ایرر۔"); }
}

function verifyAccess() {
    const userInput = document.getElementById('user-code').value.trim().toUpperCase();
    const correctCode = getDailyCode(currentPkgId);
    
    if (userInput === correctCode) {
        unlocked.push(currentPkgId);
        localStorage.setItem('nov_unlocked', JSON.stringify(unlocked));
        alert("کوڈ درست ہے! پیکیج ان لاک ہو گیا۔");
        location.reload();
    } else {
        alert("غلط کوڈ یا پرانا کوڈ! براہ کرم نیا کوڈ حاصل کریں۔");
    }
}

function closeModals() { document.querySelectorAll('.modal').forEach(m => m.classList.remove('active')); }
function showCodeInput() { closeModals(); document.getElementById('code-modal').classList.add('active'); }
