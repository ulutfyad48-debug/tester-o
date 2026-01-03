const FOLDERS = {
    novel: '1PWDGvI9Pxkzma58-BDPZYAxq4Mhw1gdu',
    poetry: '1Bje7U53wmDHhuUrAvj-NaHDAXAfMiG_h',
    codewords: '1n8MuNqMaOe6eAntLDf-zTHXaNji3NEkn',
    about: '1QHIFfbqFIcpzHKEwEzPlRovHrC4t7wkX'
};

const API_KEY = 'AIzaSyCMppjIJi2_xBi3oLVXN0XjdANMX10xmwE';
const WHATSAPP_NUMBER = "923125540048";

let purchasedEpisodes = JSON.parse(localStorage.getItem('purchased_episodes')) || [];
let currentPkg = null;

window.onload = loadEpisodes;

// ... (showSection, showHome, loadEpisodes functions remain the same) ...

async function openFileByName(num, folderId) {
    const url = `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents+and+name+contains+'${num}'+and+trashed=false&key=${API_KEY}&fields=files(id,webViewLink)`;
    try {
        const res = await fetch(url);
        const data = await res.json();
        if (data.files && data.files.length > 0) {
            // یہ لنک موبائل پر ڈرائیو ایپ کو ٹرگر کرتا ہے
            window.open(data.files[0].webViewLink, '_blank');
        } else {
            alert('فائل نہیں ملی۔');
        }
    } catch (e) {
        alert('کنکشن کا مسئلہ۔');
    }
}
