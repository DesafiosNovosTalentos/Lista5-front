document.addEventListener('DOMContentLoaded', async () => {
    const session = await validateSession();
    if (!session) return;

    const role = localStorage.getItem('role');

    if (role === 'admin') {
        document.getElementById('admin-section').style.display = 'block';
        document.getElementById('btn-new-order').style.display = 'none';
        document.getElementById('btn-notifications').style.display = 'none';
    } else {
        document.getElementById('orders-section').style.display = 'block';
        loadOrders();
    }
});

async function loadOrders() {
    try {
        const response = await fetch('http://localhost:8000/api/orders', {
            method: 'GET',
            headers: getAuthHeaders(),
        });

        const orders = await response.json();
        renderOrders(orders);
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
        article.innerHTML = `
            <h3>${order.product_name}</h3>
            <p class="post-meta">
                Quantidade: ${order.amount} · Status: ${order.status} · ${order.created_at ?? '-'}
            </p>
            <div class="post-actions">
                <button onclick="window.location.href='/view/editOrder.html?id=${order.id}'" class="btn btn-secondary">Editar</button>
                <button onclick="deleteOrder('${order.id}')" class="btn btn-danger">Deletar</button>
            </div>
        `;
        container.appendChild(article);
    });
}

async function deleteOrder(id) {
    if (!confirm('Tem certeza que deseja deletar este pedido?')) return;

    try {
        await fetch(`http://localhost:8000/api/orders/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });

        loadOrders();
    } catch (error) {
        console.error('Erro ao deletar pedido:', error);
        alert('Falha ao deletar pedido.');
    }
}

async function loadMyNotifications() {
    const userId = localStorage.getItem('logged_user_id');

    try {
        const response = await fetch(`http://localhost:8000/api/users/${userId}/notifications`, {
            method: 'GET',
            headers: getAuthHeaders(),
        });

        const notifications = await response.json();
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
        article.innerHTML = `
            <p>${notification.message}</p>
            <p class="post-meta">
                Status: ${notification.status} · Tentativas: ${notification.attempts} · ${notification.created_at ?? '-'}
            </p>
        `;
        container.appendChild(article);
    });
}

function closeNotifications() {
    document.getElementById('notifications-section').style.display = 'none';
}

async function logout() {
    try {
        await fetch('http://localhost:8000/api/auth/logout', {
            method: 'POST',
            headers: getAuthHeaders(),
        });
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