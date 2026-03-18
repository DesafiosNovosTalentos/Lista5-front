document.addEventListener('DOMContentLoaded', async () => {
    const session = await validateSession();
    if (!session) return;

    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    if (!id) {
        window.location.href = '/view/home.html';
        return;
    }

    try {
        const order = await apiFetch(`/orders/${id}`);

        document.getElementById('order-id').value = order.id;
        document.getElementById('product-name').value = order.product_name;
        document.getElementById('amount').value = order.amount;

        document.getElementById('loading-msg').style.display = 'none';
        document.getElementById('edit-order-form').classList.remove('hidden');
    } catch (error) {
        console.error('Erro ao carregar pedido:', error);
        alert('Falha ao carregar pedido.');
    }
});

async function submitEdit(event) {
    event.preventDefault();

    const id = document.getElementById('order-id').value;
    const productName = document.getElementById('product-name').value;
    const amount = parseInt(document.getElementById('amount').value, 10);

    try {
        await apiFetch(`/orders/${id}`, {
            method: 'PUT',
            body: JSON.stringify({
                product_name: productName,
                amount: amount,
            }),
        });

        window.location.href = '/view/home.html';
    } catch (error) {
        console.error('Erro ao editar pedido:', error);
        alert('Falha ao editar pedido.');
    }
}