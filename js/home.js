document.addEventListener('DOMContentLoaded', async () => {
    const session = await validateSession();
    if (!session) return;

    const role = localStorage.getItem('role');

    if (role === 'admin') {
        window.location.href = '/view/admin.html';
        return;
    }

    document.getElementById('orders-section').style.display = 'block';
    loadOrders();
});

async function loadOrders() {
    try {
        const result = await apiFetch('/orders');
        renderOrders(result.data);
    } catch (error) {
        console.error('Erro ao carregar pedidos:', error);
        alert('Falha ao carregar pedidos.');
    }
}

function renderOrders(orders) {
    const container = document.getElementById('orders-list');

    if (orders.length === 0) {
        container.innerHTML = '<p class="empty-state">Nenhum pedido encontrado.</p>';
        return;
    }

    container.innerHTML = '';
    orders.forEach(order => {
        const article = document.createElement('article');
        article.className = 'post-card';

        const h3 = document.createElement('h3');
        h3.textContent = order.product_name;

        const meta = document.createElement('p');
        meta.className = 'post-meta';
        meta.textContent = `Quantidade: ${order.amount} · Status: ${order.status} · ${order.created_at ?? '-'}`;

        const actions = document.createElement('div');
        actions.className = 'post-actions';

        const editBtn = document.createElement('button');
        editBtn.className = 'btn btn-secondary';
        editBtn.textContent = 'Editar';
        editBtn.addEventListener('click', () => {
            window.location.href = `/view/editOrder.html?id=${order.id}`;
        });

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn btn-danger';
        deleteBtn.textContent = 'Deletar';
        deleteBtn.addEventListener('click', () => deleteOrder(order.id));

        actions.appendChild(editBtn);
        actions.appendChild(deleteBtn);
        article.appendChild(h3);
        article.appendChild(meta);
        article.appendChild(actions);
        container.appendChild(article);
    });
}

async function deleteOrder(id) {
    if (!confirm('Tem certeza que deseja deletar este pedido?')) return;

    try {
        await apiFetch(`/orders/${id}`, { method: 'DELETE' });
        loadOrders();
    } catch (error) {
        console.error('Erro ao deletar pedido:', error);
        alert('Falha ao deletar pedido.');
    }
}

async function loadMyNotifications() {
    const userId = localStorage.getItem('logged_user_id');

    try {
        const notifications = await apiFetch(`/notifications/${userId}`);
        renderNotifications(notifications);
        document.getElementById('notifications-section').style.display = 'block';
    } catch (error) {
        console.error('Erro ao carregar notificações:', error);
        alert('Falha ao carregar notificações.');
    }
}

function renderNotifications(notifications) {
    const container = document.getElementById('notifications-list');

    if (notifications.length === 0) {
        container.innerHTML = '<p class="empty-state">Nenhuma notificação encontrada.</p>';
        return;
    }

    container.innerHTML = '';
    notifications.forEach(notification => {
        const article = document.createElement('article');
        article.className = 'post-card';

        const message = document.createElement('p');
        message.textContent = notification.message;

        const meta = document.createElement('p');
        meta.className = 'post-meta';
        meta.textContent = `Status: ${notification.status} · Tentativas: ${notification.attempts} · ${notification.created_at ?? '-'}`;

        article.appendChild(message);
        article.appendChild(meta);
        container.appendChild(article);
    });
}

function closeNotifications() {
    document.getElementById('notifications-section').style.display = 'none';
}

async function logout() {
    try {
        await apiFetch('/auth/logout', { method: 'POST' });
    } catch (error) {
        console.error('Erro ao fazer logout:', error);
    } finally {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('token_type');
        localStorage.removeItem('logged_user_id');
        localStorage.removeItem('role');
        window.location.href = '/index.html';
    }
}
