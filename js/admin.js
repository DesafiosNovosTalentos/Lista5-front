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

        const h3 = document.createElement('h3');
        h3.textContent = user.name;

        const meta = document.createElement('p');
        meta.className = 'post-meta';
        meta.textContent = `${user.email} · ${user.role}`;

        const actions = document.createElement('div');
        actions.className = 'post-actions';

        const btn = document.createElement('button');
        btn.className = 'btn btn-secondary';
        btn.textContent = 'Ver Notificações';
        btn.addEventListener('click', () => loadUserNotifications(user.id, user.name));

        actions.appendChild(btn);
        article.appendChild(h3);
        article.appendChild(meta);
        article.appendChild(actions);
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
