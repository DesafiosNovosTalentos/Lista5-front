async function register(name, email, password) {
    try {
        const data = await apiFetch('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ name, email, password })
        });

        saveSessionAndRedirect(data);
    } catch (error) {
        alert(error.message || 'Erro ao registrar, verique seu email!');
    }
}

async function login(email, password) {
    try {
        const data = await apiFetch('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });

        saveSessionAndRedirect(data);
    } catch (error) {
        alert(error.message || 'Credenciais inválidas.');
    }
}

function saveSessionAndRedirect(data) {
    localStorage.setItem('auth_token', data.token);
    localStorage.setItem('token_type', data.token_type);
    localStorage.setItem('logged_user_id', data.user.id);
    localStorage.setItem('role', data.user.role);
    window.location.href = '/view/home.html';
}

function loginEvent(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
}

function registerEvent(event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    register(name, email, password);
}