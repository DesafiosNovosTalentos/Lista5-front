document.addEventListener('DOMContentLoaded', async () => {
    const user = await validateSession();
    if (!user) return;
});

async function createOrder(event) {
    event.preventDefault();

    const productName = document.getElementById('product_name').value;

    const amount = parseInt(document.getElementById('amount').value, 10);

    try {
        await apiFetch('/orders', {
            method: 'POST',
            body: JSON.stringify({
                product_name: productName,
                amount: amount
            })
        });
        window.location.href = '/view/home.html';

    } catch (error) {
        console.error('Erro ao criar pedido:', error);
        alert(error.message || 'Falha ao realizar pedido. Verifique os dados.');
    }
}