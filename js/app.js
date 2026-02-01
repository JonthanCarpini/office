const API_URL = 'api/';

if (!localStorage.getItem('token')) {
    window.location.href = 'https://algoritimo.site/auth.html';
}

const user = JSON.parse(localStorage.getItem('user') || '{}');
document.getElementById('userName').textContent = user.username || 'Admin';

document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'https://algoritimo.site/auth.html';
});

const navItems = document.querySelectorAll('.nav-item');
navItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        navItems.forEach(nav => nav.classList.remove('active'));
        item.classList.add('active');
        
        const page = item.getAttribute('data-page');
        loadPage(page);
    });
});

async function loadPage(page) {
    const content = document.getElementById('content');
    const pageTitle = document.getElementById('pageTitle');
    
    const titles = {
        dashboard: 'Dashboard',
        users: 'Gerenciar Usuários',
        lines: 'Gerenciar Linhas',
        streams: 'Gerenciar Streams',
        servers: 'Gerenciar Servidores',
        categories: 'Categorias',
        bouquets: 'Bouquets',
        epg: 'EPG',
        mag: 'MAG Devices',
        activity: 'Atividades',
        settings: 'Configurações'
    };
    
    pageTitle.textContent = titles[page] || 'Dashboard';
    
    switch(page) {
        case 'dashboard':
            loadDashboard();
            break;
        case 'users':
            loadUsers();
            break;
        case 'lines':
            loadLines();
            break;
        case 'streams':
            loadStreams();
            break;
        case 'servers':
            loadServers();
            break;
        case 'categories':
            loadCategories();
            break;
        case 'bouquets':
            loadBouquets();
            break;
        case 'epg':
            loadEPG();
            break;
        case 'mag':
            loadMAG();
            break;
        case 'activity':
            loadActivity();
            break;
        case 'settings':
            loadSettings();
            break;
    }
}

async function loadDashboard() {
    try {
        const stats = await apiRequest('dashboard/stats.php');
        
        document.getElementById('totalUsers').textContent = stats.total_users || 0;
        document.getElementById('activeConnections').textContent = stats.active_connections || 0;
        document.getElementById('totalStreams').textContent = stats.total_streams || 0;
        document.getElementById('onlineServers').textContent = stats.online_servers || 0;
        
        initConnectionsChart(stats.connections_data || []);
        initStreamsChart(stats.top_streams || []);
        
        loadRecentActivities();
    } catch (error) {
        console.error('Erro ao carregar dashboard:', error);
    }
}

function initConnectionsChart(data) {
    const ctx = document.getElementById('connectionsChart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.map(d => d.hour || d.label),
            datasets: [{
                label: 'Conexões',
                data: data.map(d => d.count || 0),
                borderColor: '#7c3aed',
                backgroundColor: 'rgba(124, 58, 237, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function initStreamsChart(data) {
    const ctx = document.getElementById('streamsChart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.map(d => d.name || 'Stream'),
            datasets: [{
                label: 'Visualizações',
                data: data.map(d => d.views || 0),
                backgroundColor: [
                    '#7c3aed',
                    '#3b82f6',
                    '#10b981',
                    '#f59e0b',
                    '#ef4444'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

async function loadRecentActivities() {
    try {
        const activities = await apiRequest('dashboard/activities.php');
        const container = document.getElementById('recentActivities');
        
        if (!activities || activities.length === 0) {
            container.innerHTML = '<p class="text-gray-500 text-center py-4">Nenhuma atividade recente</p>';
            return;
        }
        
        container.innerHTML = activities.map(activity => `
            <div class="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                <div class="bg-${activity.color || 'blue'}-100 p-2 rounded-lg">
                    <i class="fas fa-${activity.icon || 'info'} text-${activity.color || 'blue'}-500"></i>
                </div>
                <div class="flex-1">
                    <p class="text-sm font-medium text-gray-800">${activity.title}</p>
                    <p class="text-xs text-gray-500">${activity.description} - ${activity.time}</p>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Erro ao carregar atividades:', error);
    }
}

async function loadUsers() {
    const content = document.getElementById('content');
    content.innerHTML = `
        <div class="bg-white rounded-xl shadow-sm">
            <div class="p-6 border-b border-gray-200">
                <div class="flex justify-between items-center">
                    <h3 class="text-lg font-semibold text-gray-800">Lista de Usuários</h3>
                    <button onclick="openUserModal()" class="btn btn-primary">
                        <i class="fas fa-plus mr-2"></i>Novo Usuário
                    </button>
                </div>
            </div>
            <div class="p-6">
                <div class="mb-4 flex gap-4">
                    <input type="search" id="searchUsers" placeholder="Buscar usuários..." class="form-input flex-1">
                    <select id="filterGroup" class="form-select w-48">
                        <option value="">Todos os grupos</option>
                        <option value="1">Administrador</option>
                        <option value="2">Revendedor</option>
                    </select>
                </div>
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Usuário</th>
                                <th>Email</th>
                                <th>Grupo</th>
                                <th>Créditos</th>
                                <th>Status</th>
                                <th>Último Login</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody id="usersTableBody">
                            <tr>
                                <td colspan="8" class="text-center py-8">
                                    <div class="loading mx-auto"></div>
                                    <p class="text-gray-500 mt-2">Carregando...</p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div id="usersPagination" class="pagination"></div>
            </div>
        </div>
    `;
    
    loadUsersData();
}

async function loadUsersData(page = 1) {
    try {
        const search = document.getElementById('searchUsers')?.value || '';
        const group = document.getElementById('filterGroup')?.value || '';
        
        const data = await apiRequest(`users/list.php?page=${page}&search=${search}&group=${group}`);
        const tbody = document.getElementById('usersTableBody');
        
        if (!data.users || data.users.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" class="text-center py-8 text-gray-500">Nenhum usuário encontrado</td></tr>';
            return;
        }
        
        tbody.innerHTML = data.users.map(user => `
            <tr>
                <td class="font-medium">#${user.id}</td>
                <td>
                    <div class="flex items-center space-x-2">
                        <div class="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                            <i class="fas fa-user text-purple-500 text-sm"></i>
                        </div>
                        <span class="font-medium">${user.username}</span>
                    </div>
                </td>
                <td>${user.email || '-'}</td>
                <td><span class="badge badge-info">${user.group_name || 'N/A'}</span></td>
                <td class="font-medium">${parseFloat(user.credits || 0).toFixed(2)}</td>
                <td>
                    <span class="badge ${user.status == 1 ? 'badge-success' : 'badge-danger'}">
                        ${user.status == 1 ? 'Ativo' : 'Inativo'}
                    </span>
                </td>
                <td>${formatDate(user.last_login)}</td>
                <td>
                    <div class="flex gap-2">
                        <button onclick="editUser(${user.id})" class="text-blue-500 hover:text-blue-700">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button onclick="deleteUser(${user.id})" class="text-red-500 hover:text-red-700">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
        
        renderPagination('usersPagination', data.total_pages, page, loadUsersData);
    } catch (error) {
        console.error('Erro ao carregar usuários:', error);
    }
}

async function loadLines() {
    const content = document.getElementById('content');
    content.innerHTML = `
        <div class="bg-white rounded-xl shadow-sm">
            <div class="p-6 border-b border-gray-200">
                <div class="flex justify-between items-center">
                    <h3 class="text-lg font-semibold text-gray-800">Lista de Linhas</h3>
                    <button onclick="openLineModal()" class="btn btn-primary">
                        <i class="fas fa-plus mr-2"></i>Nova Linha
                    </button>
                </div>
            </div>
            <div class="p-6">
                <div class="mb-4 flex gap-4">
                    <input type="search" id="searchLines" placeholder="Buscar linhas..." class="form-input flex-1">
                    <select id="filterStatus" class="form-select w-48">
                        <option value="">Todos</option>
                        <option value="active">Ativos</option>
                        <option value="expired">Expirados</option>
                        <option value="disabled">Desabilitados</option>
                    </select>
                </div>
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Usuário</th>
                                <th>Senha</th>
                                <th>Conexões</th>
                                <th>Expira em</th>
                                <th>Status</th>
                                <th>Último IP</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody id="linesTableBody">
                            <tr>
                                <td colspan="8" class="text-center py-8">
                                    <div class="loading mx-auto"></div>
                                    <p class="text-gray-500 mt-2">Carregando...</p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div id="linesPagination" class="pagination"></div>
            </div>
        </div>
    `;
    
    loadLinesData();
}

async function loadLinesData(page = 1) {
    try {
        const search = document.getElementById('searchLines')?.value || '';
        const status = document.getElementById('filterStatus')?.value || '';
        
        const data = await apiRequest(`lines/list.php?page=${page}&search=${search}&status=${status}`);
        const tbody = document.getElementById('linesTableBody');
        
        if (!data.lines || data.lines.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" class="text-center py-8 text-gray-500">Nenhuma linha encontrada</td></tr>';
            return;
        }
        
        tbody.innerHTML = data.lines.map(line => `
            <tr>
                <td class="font-medium">#${line.id}</td>
                <td class="font-medium">${line.username}</td>
                <td>
                    <code class="bg-gray-100 px-2 py-1 rounded text-sm">${line.password}</code>
                </td>
                <td>
                    <span class="badge badge-info">${line.max_connections}</span>
                </td>
                <td>${formatDate(line.exp_date)}</td>
                <td>
                    <span class="badge ${getLineStatusBadge(line)}">
                        ${getLineStatusText(line)}
                    </span>
                </td>
                <td>${line.last_ip || '-'}</td>
                <td>
                    <div class="flex gap-2">
                        <button onclick="editLine(${line.id})" class="text-blue-500 hover:text-blue-700">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button onclick="deleteLine(${line.id})" class="text-red-500 hover:text-red-700">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
        
        renderPagination('linesPagination', data.total_pages, page, loadLinesData);
    } catch (error) {
        console.error('Erro ao carregar linhas:', error);
    }
}

async function loadStreams() {
    const content = document.getElementById('content');
    content.innerHTML = `
        <div class="bg-white rounded-xl shadow-sm">
            <div class="p-6 border-b border-gray-200">
                <div class="flex justify-between items-center">
                    <h3 class="text-lg font-semibold text-gray-800">Lista de Streams</h3>
                    <button onclick="openStreamModal()" class="btn btn-primary">
                        <i class="fas fa-plus mr-2"></i>Novo Stream
                    </button>
                </div>
            </div>
            <div class="p-6">
                <div class="mb-4 flex gap-4">
                    <input type="search" id="searchStreams" placeholder="Buscar streams..." class="form-input flex-1">
                    <select id="filterType" class="form-select w-48">
                        <option value="">Todos os tipos</option>
                        <option value="1">Live TV</option>
                        <option value="2">Filmes</option>
                        <option value="3">Séries</option>
                    </select>
                </div>
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nome</th>
                                <th>Tipo</th>
                                <th>Categoria</th>
                                <th>Status</th>
                                <th>Visualizações</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody id="streamsTableBody">
                            <tr>
                                <td colspan="7" class="text-center py-8">
                                    <div class="loading mx-auto"></div>
                                    <p class="text-gray-500 mt-2">Carregando...</p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div id="streamsPagination" class="pagination"></div>
            </div>
        </div>
    `;
    
    loadStreamsData();
}

async function loadStreamsData(page = 1) {
    try {
        const search = document.getElementById('searchStreams')?.value || '';
        const type = document.getElementById('filterType')?.value || '';
        
        const data = await apiRequest(`streams/list.php?page=${page}&search=${search}&type=${type}`);
        const tbody = document.getElementById('streamsTableBody');
        
        if (!data.streams || data.streams.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="text-center py-8 text-gray-500">Nenhum stream encontrado</td></tr>';
            return;
        }
        
        tbody.innerHTML = data.streams.map(stream => `
            <tr>
                <td class="font-medium">#${stream.id}</td>
                <td>
                    <div class="flex items-center space-x-2">
                        ${stream.stream_icon ? `<img src="${stream.stream_icon}" class="w-8 h-8 rounded" onerror="this.style.display='none'">` : ''}
                        <span class="font-medium">${stream.stream_display_name || 'Sem nome'}</span>
                    </div>
                </td>
                <td><span class="badge badge-info">${getStreamType(stream.type)}</span></td>
                <td>${stream.category_name || '-'}</td>
                <td>
                    <span class="badge ${stream.stream_status == 1 ? 'badge-success' : 'badge-danger'}">
                        ${stream.stream_status == 1 ? 'Online' : 'Offline'}
                    </span>
                </td>
                <td>${stream.views || 0}</td>
                <td>
                    <div class="flex gap-2">
                        <button onclick="editStream(${stream.id})" class="text-blue-500 hover:text-blue-700">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button onclick="deleteStream(${stream.id})" class="text-red-500 hover:text-red-700">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
        
        renderPagination('streamsPagination', data.total_pages, page, loadStreamsData);
    } catch (error) {
        console.error('Erro ao carregar streams:', error);
    }
}

async function loadServers() {
    const content = document.getElementById('content');
    content.innerHTML = `
        <div class="bg-white rounded-xl shadow-sm">
            <div class="p-6 border-b border-gray-200">
                <div class="flex justify-between items-center">
                    <h3 class="text-lg font-semibold text-gray-800">Lista de Servidores</h3>
                    <button onclick="openServerModal()" class="btn btn-primary">
                        <i class="fas fa-plus mr-2"></i>Novo Servidor
                    </button>
                </div>
            </div>
            <div class="p-6">
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nome</th>
                                <th>IP</th>
                                <th>Status</th>
                                <th>CPU</th>
                                <th>Memória</th>
                                <th>Conexões</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody id="serversTableBody">
                            <tr>
                                <td colspan="8" class="text-center py-8">
                                    <div class="loading mx-auto"></div>
                                    <p class="text-gray-500 mt-2">Carregando...</p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
    
    loadServersData();
}

async function loadServersData() {
    try {
        const data = await apiRequest('servers/list.php');
        const tbody = document.getElementById('serversTableBody');
        
        if (!data.servers || data.servers.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" class="text-center py-8 text-gray-500">Nenhum servidor encontrado</td></tr>';
            return;
        }
        
        tbody.innerHTML = data.servers.map(server => `
            <tr>
                <td class="font-medium">#${server.id}</td>
                <td class="font-medium">${server.server_name}</td>
                <td><code class="bg-gray-100 px-2 py-1 rounded text-sm">${server.server_ip}</code></td>
                <td>
                    <span class="badge ${server.status == 1 ? 'badge-success' : 'badge-danger'}">
                        ${server.status == 1 ? 'Online' : 'Offline'}
                    </span>
                </td>
                <td>
                    <div class="flex items-center gap-2">
                        <div class="w-16 bg-gray-200 rounded-full h-2">
                            <div class="bg-blue-500 h-2 rounded-full" style="width: ${server.cpu || 0}%"></div>
                        </div>
                        <span class="text-sm">${server.cpu || 0}%</span>
                    </div>
                </td>
                <td>
                    <div class="flex items-center gap-2">
                        <div class="w-16 bg-gray-200 rounded-full h-2">
                            <div class="bg-green-500 h-2 rounded-full" style="width: ${server.memory || 0}%"></div>
                        </div>
                        <span class="text-sm">${server.memory || 0}%</span>
                    </div>
                </td>
                <td><span class="badge badge-info">${server.connections || 0}</span></td>
                <td>
                    <div class="flex gap-2">
                        <button onclick="editServer(${server.id})" class="text-blue-500 hover:text-blue-700">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button onclick="deleteServer(${server.id})" class="text-red-500 hover:text-red-700">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Erro ao carregar servidores:', error);
    }
}

function loadCategories() {
    const content = document.getElementById('content');
    content.innerHTML = '<div class="text-center py-12"><p class="text-gray-500">Módulo de Categorias em desenvolvimento</p></div>';
}

function loadBouquets() {
    const content = document.getElementById('content');
    content.innerHTML = '<div class="text-center py-12"><p class="text-gray-500">Módulo de Bouquets em desenvolvimento</p></div>';
}

function loadEPG() {
    const content = document.getElementById('content');
    content.innerHTML = '<div class="text-center py-12"><p class="text-gray-500">Módulo de EPG em desenvolvimento</p></div>';
}

function loadMAG() {
    const content = document.getElementById('content');
    content.innerHTML = '<div class="text-center py-12"><p class="text-gray-500">Módulo de MAG Devices em desenvolvimento</p></div>';
}

function loadActivity() {
    const content = document.getElementById('content');
    content.innerHTML = '<div class="text-center py-12"><p class="text-gray-500">Módulo de Atividades em desenvolvimento</p></div>';
}

function loadSettings() {
    const content = document.getElementById('content');
    content.innerHTML = '<div class="text-center py-12"><p class="text-gray-500">Módulo de Configurações em desenvolvimento</p></div>';
}

async function apiRequest(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    
    const response = await fetch(API_URL + endpoint, {
        ...options,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            ...options.headers
        }
    });
    
    if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = 'https://algoritimo.site/auth.html';
        return;
    }
    
    return await response.json();
}

function formatDate(timestamp) {
    if (!timestamp) return '-';
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('pt-BR') + ' ' + date.toLocaleTimeString('pt-BR');
}

function getLineStatusBadge(line) {
    const now = Math.floor(Date.now() / 1000);
    if (line.admin_enabled == 0 || line.enabled == 0) return 'badge-danger';
    if (line.exp_date < now) return 'badge-warning';
    return 'badge-success';
}

function getLineStatusText(line) {
    const now = Math.floor(Date.now() / 1000);
    if (line.admin_enabled == 0 || line.enabled == 0) return 'Desabilitado';
    if (line.exp_date < now) return 'Expirado';
    return 'Ativo';
}

function getStreamType(type) {
    const types = {
        1: 'Live TV',
        2: 'Filme',
        3: 'Série',
        4: 'Rádio'
    };
    return types[type] || 'Desconhecido';
}

function renderPagination(containerId, totalPages, currentPage, callback) {
    const container = document.getElementById(containerId);
    if (!container || totalPages <= 1) {
        container.innerHTML = '';
        return;
    }
    
    let html = `
        <button ${currentPage <= 1 ? 'disabled' : ''} onclick="${callback.name}(${currentPage - 1})">
            <i class="fas fa-chevron-left"></i>
        </button>
    `;
    
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
            html += `<button class="${i === currentPage ? 'active' : ''}" onclick="${callback.name}(${i})">${i}</button>`;
        } else if (i === currentPage - 3 || i === currentPage + 3) {
            html += '<span class="px-2">...</span>';
        }
    }
    
    html += `
        <button ${currentPage >= totalPages ? 'disabled' : ''} onclick="${callback.name}(${currentPage + 1})">
            <i class="fas fa-chevron-right"></i>
        </button>
    `;
    
    container.innerHTML = html;
}

document.getElementById('sidebarToggle')?.addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('open');
});

loadDashboard();
