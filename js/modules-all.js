// ============================================
// MÓDULO DE USUÁRIOS
// ============================================

async function loadUsers() {
    const content = document.getElementById('content');
    content.innerHTML = `
        <div class="space-y-6">
            <div class="bg-white rounded-lg shadow p-4">
                <div class="flex items-center justify-between">
                    <input type="text" id="searchUsers" placeholder="Buscar usuários..." class="px-4 py-2 border rounded-lg w-64">
                    <button onclick="openUserModal()" class="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
                        <i class="fas fa-plus mr-2"></i>Novo Usuário
                    </button>
                </div>
            </div>
            <div class="bg-white rounded-lg shadow overflow-hidden">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Username</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Grupo</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Créditos</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
                        </tr>
                    </thead>
                    <tbody id="usersTableBody" class="bg-white divide-y divide-gray-200">
                        <tr><td colspan="7" class="px-6 py-4 text-center">Carregando...</td></tr>
                    </tbody>
                </table>
                <div id="usersPagination" class="px-6 py-4 border-t"></div>
            </div>
        </div>
    `;
    await loadUsersData();
}

async function loadUsersData(page = 1) {
    try {
        const data = await apiRequest(`users/list.php?page=${page}`);
        const tbody = document.getElementById('usersTableBody');
        
        if (data.users && data.users.length > 0) {
            tbody.innerHTML = data.users.map(u => `
                <tr>
                    <td class="px-6 py-4 text-sm">${u.id}</td>
                    <td class="px-6 py-4 text-sm font-medium">${u.username}</td>
                    <td class="px-6 py-4 text-sm">${u.email || '-'}</td>
                    <td class="px-6 py-4 text-sm">${u.group_name || '-'}</td>
                    <td class="px-6 py-4"><span class="px-2 py-1 text-xs rounded-full ${u.status == 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">${u.status == 1 ? 'Ativo' : 'Inativo'}</span></td>
                    <td class="px-6 py-4 text-sm">${u.credits || 0}</td>
                    <td class="px-6 py-4 text-sm">
                        <button onclick="editUser(${u.id})" class="text-blue-600 hover:text-blue-800 mr-3"><i class="fas fa-edit"></i></button>
                        <button onclick="deleteUser(${u.id}, '${u.username}')" class="text-red-600 hover:text-red-800"><i class="fas fa-trash"></i></button>
                    </td>
                </tr>
            `).join('');
        } else {
            tbody.innerHTML = '<tr><td colspan="7" class="px-6 py-4 text-center">Nenhum usuário encontrado</td></tr>';
        }
    } catch (error) {
        console.error('Erro ao carregar usuários:', error);
    }
}

function openUserModal() { alert('Função em desenvolvimento'); }
function editUser(id) { alert('Função em desenvolvimento'); }
function deleteUser(id, name) { if(confirm(`Deletar ${name}?`)) alert('Função em desenvolvimento'); }

async function loadUsersGroups() {
    const content = document.getElementById('content');
    content.innerHTML = '<div class="bg-white rounded-lg shadow p-6"><h3 class="text-lg font-semibold mb-4">Grupos de Usuários</h3><div id="groupsList">Carregando...</div></div>';
    
    try {
        const data = await apiRequest('users/groups.php');
        document.getElementById('groupsList').innerHTML = data.groups.map(g => `
            <div class="p-4 border rounded mb-2">
                <h4 class="font-semibold">${g.group_name}</h4>
                <p class="text-sm text-gray-600">Admin: ${g.is_admin ? 'Sim' : 'Não'} | Revendedor: ${g.is_reseller ? 'Sim' : 'Não'}</p>
            </div>
        `).join('');
    } catch (error) {
        console.error('Erro:', error);
    }
}

async function loadLoginLogs() {
    const content = document.getElementById('content');
    content.innerHTML = '<div class="bg-white rounded-lg shadow p-6"><p>Logs de Login - Em desenvolvimento</p></div>';
}

// ============================================
// MÓDULO DE STREAMS
// ============================================

async function loadStreams() {
    const content = document.getElementById('content');
    content.innerHTML = `
        <div class="space-y-6">
            <div class="bg-white rounded-lg shadow p-4">
                <div class="flex items-center justify-between">
                    <div class="flex space-x-4">
                        <input type="text" id="searchStreams" placeholder="Buscar streams..." class="px-4 py-2 border rounded-lg w-64">
                        <select id="filterType" class="px-4 py-2 border rounded-lg">
                            <option value="">Todos os Tipos</option>
                            <option value="1">Live TV</option>
                            <option value="2">Movies</option>
                            <option value="3">Series</option>
                        </select>
                    </div>
                    <button onclick="openStreamModal()" class="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
                        <i class="fas fa-plus mr-2"></i>Novo Stream
                    </button>
                </div>
            </div>
            <div class="bg-white rounded-lg shadow overflow-hidden">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Servidores</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Visualizações 24h</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ativos Agora</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
                        </tr>
                    </thead>
                    <tbody id="streamsTableBody" class="bg-white divide-y divide-gray-200">
                        <tr><td colspan="7" class="px-6 py-4 text-center">Carregando...</td></tr>
                    </tbody>
                </table>
                <div id="streamsPagination" class="px-6 py-4 border-t"></div>
            </div>
        </div>
    `;
    
    document.getElementById('searchStreams').addEventListener('input', debounce(() => loadStreamsData(), 500));
    document.getElementById('filterType').addEventListener('change', () => loadStreamsData());
    await loadStreamsData();
}

async function loadStreamsData(page = 1) {
    const search = document.getElementById('searchStreams')?.value || '';
    const type = document.getElementById('filterType')?.value || '';
    
    try {
        const data = await apiRequest(`streams/list.php?page=${page}&search=${search}&type=${type}`);
        const tbody = document.getElementById('streamsTableBody');
        
        if (data.streams && data.streams.length > 0) {
            tbody.innerHTML = data.streams.map(s => `
                <tr>
                    <td class="px-6 py-4 text-sm">${s.id}</td>
                    <td class="px-6 py-4 text-sm font-medium">${s.stream_display_name || '-'}</td>
                    <td class="px-6 py-4 text-sm">${s.type_text}</td>
                    <td class="px-6 py-4 text-sm">${s.server_count || 0}</td>
                    <td class="px-6 py-4 text-sm">${s.views_24h || 0}</td>
                    <td class="px-6 py-4 text-sm">${s.active_viewers || 0}</td>
                    <td class="px-6 py-4 text-sm">
                        <button onclick="editStream(${s.id})" class="text-blue-600 hover:text-blue-800 mr-3"><i class="fas fa-edit"></i></button>
                        <button onclick="deleteStream(${s.id})" class="text-red-600 hover:text-red-800"><i class="fas fa-trash"></i></button>
                    </td>
                </tr>
            `).join('');
        } else {
            tbody.innerHTML = '<tr><td colspan="7" class="px-6 py-4 text-center">Nenhum stream encontrado</td></tr>';
        }
        
        if (data.pagination) {
            renderPagination('streamsPagination', data.pagination, loadStreamsData);
        }
    } catch (error) {
        console.error('Erro ao carregar streams:', error);
    }
}

function openStreamModal() { alert('Função em desenvolvimento'); }
function editStream(id) { alert('Função em desenvolvimento'); }
function deleteStream(id) { if(confirm('Deletar stream?')) alert('Função em desenvolvimento'); }

async function loadStreamsCategories() {
    const content = document.getElementById('content');
    content.innerHTML = '<div class="bg-white rounded-lg shadow p-6"><p>Categorias de Streams - Em desenvolvimento</p></div>';
}

async function loadStreamsSeries() {
    const content = document.getElementById('content');
    content.innerHTML = '<div class="bg-white rounded-lg shadow p-6"><p>Séries - Em desenvolvimento</p></div>';
}

async function loadStreamsStats() {
    const content = document.getElementById('content');
    content.innerHTML = '<div class="bg-white rounded-lg shadow p-6"><p>Estatísticas de Streams - Em desenvolvimento</p></div>';
}

// ============================================
// MÓDULO DE SERVIDORES
// ============================================

async function loadServers() {
    const content = document.getElementById('content');
    content.innerHTML = `
        <div class="space-y-6">
            <div class="bg-white rounded-lg shadow p-4">
                <button onclick="openServerModal()" class="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
                    <i class="fas fa-plus mr-2"></i>Novo Servidor
                </button>
            </div>
            <div class="bg-white rounded-lg shadow overflow-hidden">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">IP</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">CPU</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Memória</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Conexões</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Streams</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
                        </tr>
                    </thead>
                    <tbody id="serversTableBody" class="bg-white divide-y divide-gray-200">
                        <tr><td colspan="9" class="px-6 py-4 text-center">Carregando...</td></tr>
                    </tbody>
                </table>
            </div>
        </div>
    `;
    await loadServersData();
}

async function loadServersData() {
    try {
        const data = await apiRequest('servers/list.php');
        const tbody = document.getElementById('serversTableBody');
        
        if (data.servers && data.servers.length > 0) {
            tbody.innerHTML = data.servers.map(s => `
                <tr>
                    <td class="px-6 py-4 text-sm">${s.id}</td>
                    <td class="px-6 py-4 text-sm font-medium">${s.server_name}</td>
                    <td class="px-6 py-4 text-sm">${s.server_ip}</td>
                    <td class="px-6 py-4"><span class="px-2 py-1 text-xs rounded-full bg-${s.status_color}-100 text-${s.status_color}-800">${s.status_text}</span></td>
                    <td class="px-6 py-4 text-sm">${s.cpu ? s.cpu.toFixed(1) + '%' : '-'}</td>
                    <td class="px-6 py-4 text-sm">${s.memory_percent ? s.memory_percent.toFixed(1) + '%' : '-'}</td>
                    <td class="px-6 py-4 text-sm">${s.active_connections || 0}</td>
                    <td class="px-6 py-4 text-sm">${s.stream_count || 0}</td>
                    <td class="px-6 py-4 text-sm">
                        <button onclick="editServer(${s.id})" class="text-blue-600 hover:text-blue-800 mr-3"><i class="fas fa-edit"></i></button>
                        <button onclick="deleteServer(${s.id})" class="text-red-600 hover:text-red-800"><i class="fas fa-trash"></i></button>
                    </td>
                </tr>
            `).join('');
        } else {
            tbody.innerHTML = '<tr><td colspan="9" class="px-6 py-4 text-center">Nenhum servidor encontrado</td></tr>';
        }
    } catch (error) {
        console.error('Erro ao carregar servidores:', error);
    }
}

function openServerModal() { alert('Função em desenvolvimento'); }
function editServer(id) { alert('Função em desenvolvimento'); }
function deleteServer(id) { if(confirm('Deletar servidor?')) alert('Função em desenvolvimento'); }

async function loadServersStats() {
    const content = document.getElementById('content');
    content.innerHTML = '<div class="bg-white rounded-lg shadow p-6"><h3 class="text-lg font-semibold mb-4">Monitoramento de Servidores</h3><div id="serverStats">Carregando...</div></div>';
    
    try {
        const data = await apiRequest('servers/stats.php');
        document.getElementById('serverStats').innerHTML = data.servers.map(s => `
            <div class="p-4 border rounded mb-4">
                <h4 class="font-semibold">${s.server_name} - ${s.server_ip}</h4>
                <div class="grid grid-cols-3 gap-4 mt-2">
                    <div><span class="text-sm text-gray-600">CPU:</span> <span class="font-semibold ${s.cpu_status === 'danger' ? 'text-red-600' : s.cpu_status === 'warning' ? 'text-yellow-600' : 'text-green-600'}">${s.cpu_percent?.toFixed(1) || 0}%</span></div>
                    <div><span class="text-sm text-gray-600">Memória:</span> <span class="font-semibold ${s.memory_status === 'danger' ? 'text-red-600' : s.memory_status === 'warning' ? 'text-yellow-600' : 'text-green-600'}">${s.memory_percent?.toFixed(1) || 0}%</span></div>
                    <div><span class="text-sm text-gray-600">Conexões:</span> <span class="font-semibold">${s.active_connections || 0}</span></div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Erro:', error);
    }
}

// ============================================
// DEMAIS MÓDULOS (SIMPLIFICADOS)
// ============================================

async function loadEPG() {
    const content = document.getElementById('content');
    content.innerHTML = '<div class="bg-white rounded-lg shadow p-6"><p>EPG - Em desenvolvimento</p></div>';
}

async function loadEPGChannels() {
    const content = document.getElementById('content');
    content.innerHTML = '<div class="bg-white rounded-lg shadow p-6"><p>Canais EPG - Em desenvolvimento</p></div>';
}

async function loadBouquets() {
    const content = document.getElementById('content');
    content.innerHTML = '<div class="bg-white rounded-lg shadow p-6"><p>Bouquets - Em desenvolvimento</p></div>';
}

async function loadMAGDevices() {
    const content = document.getElementById('content');
    content.innerHTML = '<div class="bg-white rounded-lg shadow p-6"><p>Dispositivos MAG - Em desenvolvimento</p></div>';
}

async function loadEnigma2Devices() {
    const content = document.getElementById('content');
    content.innerHTML = '<div class="bg-white rounded-lg shadow p-6"><p>Dispositivos Enigma2 - Em desenvolvimento</p></div>';
}

async function loadBlockedIPs() {
    const content = document.getElementById('content');
    content.innerHTML = '<div class="bg-white rounded-lg shadow p-6"><p>IPs Bloqueados - Em desenvolvimento</p></div>';
}

async function loadDetectRestream() {
    const content = document.getElementById('content');
    content.innerHTML = '<div class="bg-white rounded-lg shadow p-6"><p>Detecção de Restream - Em desenvolvimento</p></div>';
}

async function loadSettings() {
    const content = document.getElementById('content');
    content.innerHTML = '<div class="bg-white rounded-lg shadow p-6"><p>Configurações do Sistema - Em desenvolvimento</p></div>';
}

async function loadPanelLogs() {
    const content = document.getElementById('content');
    content.innerHTML = '<div class="bg-white rounded-lg shadow p-6"><p>Logs do Painel - Em desenvolvimento</p></div>';
}

// ============================================
// FUNÇÕES AUXILIARES
// ============================================

function renderPagination(containerId, pagination, callback) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const { current_page, total_pages } = pagination;
    let html = '<div class="flex items-center justify-between">';
    html += `<div class="text-sm text-gray-700">Página ${current_page} de ${total_pages}</div>`;
    html += '<div class="flex space-x-2">';
    
    if (current_page > 1) {
        html += `<button onclick="${callback.name}(${current_page - 1})" class="px-3 py-1 border rounded hover:bg-gray-50">Anterior</button>`;
    }
    
    if (current_page < total_pages) {
        html += `<button onclick="${callback.name}(${current_page + 1})" class="px-3 py-1 border rounded hover:bg-gray-50">Próxima</button>`;
    }
    
    html += '</div></div>';
    container.innerHTML = html;
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
