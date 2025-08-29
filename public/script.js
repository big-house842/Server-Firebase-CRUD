const API_URL = 'http://localhost:3000/api';

// Elementos do DOM
const userForm = document.getElementById('userForm');
const userIdInput = document.getElementById('userId');
const submitBtn = document.getElementById('submitBtn');
const cancelEditBtn = document.getElementById('cancelEdit');
const usersList = document.getElementById('usersList');

// Estado da aplicação
let isEditing = false;

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    loadUsers();
    setupEventListeners();
});

// Configurar event listeners
function setupEventListeners() {
    userForm.addEventListener('submit', handleFormSubmit);
    cancelEditBtn.addEventListener('click', cancelEdit);
}

// Manipular envio do formulário
async function handleFormSubmit(e) {
    e.preventDefault();
    
    const userData = getFormData();
    
    if (!validateForm(userData)) {
        return;
    }

    try {
        if (isEditing) {
            await updateUser(userData);
        } else {
            await createUser(userData);
        }
        
        resetForm();
        loadUsers();
    } catch (error) {
        alert('Erro ao salvar usuário: ' + error.message);
    }
}

// Obter dados do formulário - CORRIGIDO!
function getFormData() {
    return {
        nome: document.getElementById('nome').value.trim() || '',
        cpf: document.getElementById('cpf').value.trim() || '',
        telefone: document.getElementById('telefone').value.trim() || '',
        email: document.getElementById('email').value.trim() || '',
        matricula: document.getElementById('matricula').value.trim() || '',
        aluno: document.getElementById('aluno').value || 'false',
        escola: document.getElementById('escola').value.trim() || ''
    };
}

// Validar formulário
function validateForm(data) {
    if (!data.nome || data.nome === '') {
        alert('Nome é obrigatório');
        return false;
    }
    
    if (!data.cpf || data.cpf === '' || data.cpf.length !== 11) {
        alert('CPF deve ter 11 dígitos');
        return false;
    }
    
    if (!data.email || data.email === '' || !data.email.includes('@')) {
        alert('Email inválido');
        return false;
    }
    
    return true;
}

// Criar usuário
async function createUser(userData) {
    const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    });
    
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao criar usuário');
    }
    
    alert('Usuário criado com sucesso!');
}

// Atualizar usuário
async function updateUser(userData) {
    const userId = userIdInput.value;
    const response = await fetch(`${API_URL}/update/${userId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    });
    
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao atualizar usuário');
    }
    
    alert('Usuário atualizado com sucesso!');
}

// Carregar usuários
async function loadUsers() {
    try {
        usersList.innerHTML = '<p>Carregando usuários...</p>';
        
        const response = await fetch(`${API_URL}/request`);
        
        if (!response.ok) {
            throw new Error('Erro ao carregar usuários');
        }
        
        const users = await response.json();
        displayUsers(users);
        
    } catch (error) {
        usersList.innerHTML = `<p style="color: red;"> Erro ao carregar usuários: ${error.message}</p>`;
        console.error('Erro:', error);
    }
}

// Exibir usuários
function displayUsers(users) {
    if (users.length === 0) {
        usersList.innerHTML = '<p>Nenhum usuário cadastrado.</p>';
        return;
    }
    
    usersList.innerHTML = '';
    
    users.forEach(user => {
        const userElement = createUserElement(user);
        usersList.appendChild(userElement);
    });
}

// Criar elemento de usuário
function createUserElement(user) {
    const div = document.createElement('div');
    div.className = 'user-item';
    div.innerHTML = `
        <strong>${user.name || 'Não informado'}</strong>
        <div class="user-info">
            <span> Email: ${user.email || 'Não informado'}</span>
            <span> Telefone: ${user.phone || 'Não informado'}</span>
            <span> CPF: ${user.cpf || 'Não informado'}</span>
            <span> Matrícula: ${user.registration || 'Não informada'}</span>
            <span> Aluno: ${user.student === true ? 'Sim' : 'Não'}</span>
            <span> Escola: ${user.school || 'Não informada'}</span>
        </div>
        <div class="user-actions">
            <button class="edit-btn" onclick="startEdit('${user.id}')">Editar</button>
            <button class="delete-btn" onclick="deleteUser('${user.id}')">Excluir</button>
        </div>
    `;
    return div;
}

// Iniciar edição
async function startEdit(userId) {
    try {
        const response = await fetch(`${API_URL}/request/${userId}`);
        
        if (!response.ok) {
            throw new Error('Erro ao carregar usuário');
        }
        
        const user = await response.json();
        fillForm(user);
        setEditMode(true);
        
    } catch (error) {
        alert('Erro ao carregar usuário: ' + error.message);
    }
}

// Preencher formulário
function fillForm(user) {
    document.getElementById('nome').value = user.name || '';
    document.getElementById('cpf').value = user.cpf || '';
    document.getElementById('telefone').value = user.phone || '';
    document.getElementById('email').value = user.email || '';
    document.getElementById('matricula').value = user.registration || '';
    document.getElementById('aluno').value = user.student ? 'true' : 'false';
    document.getElementById('escola').value = user.school || '';
    userIdInput.value = user.id;
}

// Modo edição
function setEditMode(editing) {
    isEditing = editing;
    submitBtn.textContent = editing ? 'Atualizar' : 'Cadastrar';
    cancelEditBtn.style.display = editing ? 'block' : 'none';
}

// Cancelar edição
function cancelEdit() {
    resetForm();
    setEditMode(false);
}

// Resetar formulário
function resetForm() {
    userForm.reset();
    userIdInput.value = '';
    setEditMode(false);
}

// Deletar usuário
async function deleteUser(userId) {
    if (!confirm('Tem certeza que deseja excluir este usuário?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/delete/${userId}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error('Erro ao excluir usuário');
        }
        
        alert('Usuário excluído com sucesso!');
        loadUsers();
        
    } catch (error) {
        alert('Erro ao excluir usuário: ' + error.message);
    }
}

// Funções globais para os botões
window.startEdit = startEdit;
window.deleteUser = deleteUser;