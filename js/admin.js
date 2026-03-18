document.addEventListener('DOMContentLoaded', async () => {
    const session = await validateSession();
    if (!session) return;

    loadUsers();
});

async function loadUsers() {
    try {
        const users = await apiFetch('/users');
        renderUsers(users);
    } catch (error) {
        console.error('Erro ao carregar usuários:', error);
        alert('Falha ao carregar usuários.');
    }
}

function renderUsers(users) {
    const container = document.getElementById('users-list');

    if (users.length === 0) {
        container.innerHTML = '<p class="empty-state">Nenhum usuário encontrado.</p>';
        return;
    }

    container.innerHTML = '';
    users.forEach(user => {
        const article = document.createElement('article');
        article.className = 'post-card';
        article.innerHTML = `
            <h3>${user.name}</h3>
            <p class="post-meta">${user.email} · ${user.role}</p>
            <div class="post-actions">
                <button onclick="loadUserNotifications('${user.id}', '${user.name}')" class="btn btn-secondary">Ver Notificações</button>
            </div>
        `;
        container.appendChild(article);
    });
}

async function loadUserNotifications(userId, userName) {
    try {
        const notifications = await apiFetch(`/notifications/${userId}`);
        renderNotifications(notifications, userName);
        document.getElementById('notifications-section').style.display = 'block';
    } catch (error) {
        console.error('Erro ao carregar notificações:', error);
        alert('Falha ao carregar notificações.');
    }
}

function renderNotifications(notifications, userName) {
    document.getElementById('notifications-title').textContent = `Notificações de ${userName}`;

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