const FOLDERS = {
    novels: '1PWDGvI9Pxkzma58-BDPZYAxq4Mhw1gdu',
    poetry: '1Bje7U53wmDHhuUrAvj-NaHDAXAfMiG_h',
    codewords: '1n8MuNqMaOe6eAntLDf-zTHXaNji3NEkn',
    about: '1QHIFfbqFIcpzHKEwEzPlRovHrC4t7wkX'
};

const API_KEY = 'AIzaSyCMppjIJi2_xBi3oLVXN0XjdANMX10xmwE';

function showSection(id) {
    document.getElementById('home-screen').style.display = 'none';
    const section = document.getElementById(id + '-section') || document.getElementById('novels-section');
    section.classList.add('active');
    
    // ڈرائیو سے فائلیں لوڈ کریں
    loadDriveData(FOLDERS[id], id + '-list');
}

function goBack() {
    location.reload(); // ہوم پیج پر واپسی کے لیے ری فریش
}

async function loadDriveData(folderId, containerId) {
    const container = document.getElementById(containerId) || document.getElementById('novels-list');
    container.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">فائلیں تلاش کی جا رہی ہیں...</p>';
    
    // نام کے حساب سے ترتیب (Ascending Order)
    const url = `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents+and+trashed=false&key=${API_KEY}&fields=files(id,name,webViewLink)&orderBy=name`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        container.innerHTML = '';

        if (data.files && data.files.length > 0) {
            data.files.forEach(file => {
                const btn = document.createElement('div');
                btn.className = 'episode-card';
                // ایکسٹینشن (.pdf) ہٹا کر نام دکھائیں
                btn.innerText = file.name.replace('.pdf', '').replace('.PDF', '');
                
                // براہ راست ایپ میں کھولنے کا ایڈوانس طریقہ
                btn.onclick = () => {
                    window.location.assign(file.webViewLink);
                };
                container.appendChild(btn);
            });
        } else {
            container.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">فی الحال کوئی قسط موجود نہیں۔</p>';
        }
    } catch (error) {
        container.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--accent);">انٹرنیٹ کنکشن چیک کریں۔</p>';
    }
}
