// Твой ключ от Dropbox (тот самый со скриншота)
const DROPBOX_TOKEN = 'sl.u.AGci_BtP6cp5Ms7_PsLG6OEdiHsMLN3ywqwwKARTWmmzh8tNdP-ILIzldqKwtOa...'; 

async function uploadOzonBarcode(file) {
    // 1. Загружаем файл в Dropbox
    const response = await fetch('https://content.dropboxapi.com/2/files/upload', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + DROPBOX_TOKEN,
            'Dropbox-API-Arg': JSON.stringify({
                path: '/barcodes/' + Date.now() + '_' + file.name,
                mode: 'add'
            }),
            'Content-Type': 'application/octet-stream'
        },
        body: file
    });

    const data = await response.json();
    
    // 2. Получаем ссылку на файл
    const sharedLinkResponse = await fetch('https://api.dropboxapi.com/2/sharing/create_shared_link_with_settings', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + DROPBOX_TOKEN,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ path: data.path_lower })
    });

    const linkData = await sharedLinkResponse.json();
    const finalUrl = linkData.url.replace('?dl=0', '?dl=1'); // Ссылка на скачивание

    // 3. Автоматически создаем заказ в Firebase
    db.collection("orders").add({
        userEmail: "b18313014@gmail.com", // Потом заменим на автоматический ID
        type: "Ozon",
        status: "new",
        price: 100,
        barcodeUrl: finalUrl,
        createdAt: new Date()
    });

    alert("Заказ принят! Ожидайте курьера.");
}
