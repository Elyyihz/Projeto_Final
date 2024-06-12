function showPopup() {
    document.getElementById('popup').style.display = 'block';
}

function hidePopup() {
    document.getElementById('popup').style.display = 'none';
}

function subscribeNotifications() {
    // Aqui você pode adicionar a lógica para assinar notificações
    alert('Você se inscreveu para receber notificações!');
    hidePopup();
}

// Mostrar o pop-up após 3 segundos
setTimeout(showPopup, 3000);