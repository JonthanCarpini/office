// Painel Office IPTV - Sistema Completo de Gerenciamento
// Gerencia todas as 60+ tabelas do banco de dados IPTV

const API_URL = 'api/';

// Verificar autenticação
if (!localStorage.getItem('token')) {
    window.location.href = 'auth.html';
}

const user = JSON.parse(localStorage.getItem('user') || '{}');
document.getElementById('userName').textContent = user.username || 'Admin';

// Logout
document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'auth.html';
});

// Sistema de navegação
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

// Títulos das páginas
const pageTitles = {
    'dashboard': 'Dashboard',
    'users': 'Gerenciar Usuários',
    'users-groups': 'Grupos de Usuários',
    'login-logs': 'Logs de Login',
    'lines': 'Gerenciar Linhas (Clientes)',
    'lines-live': 'Conexões Ativas',
    'lines-activity': 'Atividades das Linhas',
    'lines-logs': 'Logs de Linhas',
    'streams': 'Gerenciar Streams',
    'streams-categories': 'Categorias de Streams',
    'streams-series': 'Séries',
    'streams-stats': 'Estatísticas de Streams',
    'servers': 'Gerenciar Servidores',
    'servers-stats': 'Monitoramento de Servidores',
    'epg': 'Gerenciar EPG',
    'epg-channels': 'Canais EPG',
    'bouquets': 'Gerenciar Bouquets',
    'mag-devices': 'Dispositivos MAG',
    'enigma2-devices': 'Dispositivos Enigma2',
    'blocked-ips': 'IPs Bloqueados',
    'detect-restream': 'Detecção de Restream',
    'settings': 'Configurações do Sistema',
    'panel-logs': 'Logs do Painel'
};

// Carregar página
async function loadPage(page) {
    const content = document.getElementById('content');
    const pageTitle = document.getElementById('pageTitle');
    
    pageTitle.textContent = pageTitles[page] || 'Painel Office IPTV';
    
    switch(page) {
        case 'dashboard':
            await loadDashboard();
            break;
        case 'users':
            await loadUsers();
            break;
        case 'users-groups':
            await loadUsersGroups();
            break;
        case 'login-logs':
            await loadLoginLogs();
            break;
        case 'lines':
            await loadLines();
            break;
        case 'lines-live':
            await loadLinesLive();
            break;
        case 'lines-activity':
            await loadLinesActivity();
            break;
        case 'lines-logs':
            await loadLinesLogs();
            break;
        case 'streams':
            await loadStreams();
            break;
        case 'streams-categories':
            await loadStreamsCategories();
            break;
        case 'streams-series':
            await loadStreamsSeries();
            break;
        case 'streams-stats':
            await loadStreamsStats();
            break;
        case 'servers':
            await loadServers();
            break;
        case 'servers-stats':
            await loadServersStats();
            break;
        case 'epg':
            await loadEPG();
            break;
        case 'epg-channels':
            await loadEPGChannels();
            break;
        case 'bouquets':
            await loadBouquets();
            break;
        case 'mag-devices':
            await loadMAGDevices();
            break;
        case 'enigma2-devices':
            await loadEnigma2Devices();
            break;
        case 'blocked-ips':
            await loadBlockedIPs();
            break;
        case 'detect-restream':
            await loadDetectRestream();
            break;
        case 'settings':
            await loadSettings();
            break;
        case 'panel-logs':
            await loadPanelLogs();
            break;
        default:
            await loadDashboard();
    }
}

// ============================================
// DASHBOARD
// ============================================
async function loadDashboard() {
    const content = document.getElementById('content');
    
    content.innerHTML = `
        <div class="space-y-6">
            <!-- Cards de Estatísticas -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div class="bg-white rounded-lg shadow p-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm text-gray-600">Total de Usuários</p>
                            <p class="text-3xl font-bold text-gray-800" id="totalUsers">-</p>
                        </div>
                        <div class="p-3 bg-blue-100 rounded-full">
                            <i class="fas fa-users text-blue-600 text-2xl"></i>
                        </div>
                    </div>
                </div>

                <div class="bg-white rounded-lg shadow p-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm text-gray-600">Linhas Ativas</p>
                            <p class="text-3xl font-bold text-green-600" id="activeLines">-</p>
                        </div>
                        <div class="p-3 bg-green-100 rounded-full">
                            <i class="fas fa-signal text-green-600 text-2xl"></i>
                        </div>
                    </div>
                </div>

                <div class="bg-white rounded-lg shadow p-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm text-gray-600">Conexões Ativas</p>
                            <p class="text-3xl font-bold text-purple-600" id="activeConnections">-</p>
                        </div>
                        <div class="p-3 bg-purple-100 rounded-full">
                            <i class="fas fa-broadcast-tower text-purple-600 text-2xl"></i>
                        </div>
                    </div>
                </div>

                <div class="bg-white rounded-lg shadow p-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm text-gray-600">Total de Streams</p>
                            <p class="text-3xl font-bold text-indigo-600" id="totalStreams">-</p>
                        </div>
                        <div class="p-3 bg-indigo-100 rounded-full">
                            <i class="fas fa-video text-indigo-600 text-2xl"></i>
                        </div>
                    </div>
                </div>

                <div class="bg-white rounded-lg shadow p-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm text-gray-600">Servidores Online</p>
                            <p class="text-3xl font-bold text-teal-600" id="onlineServers">-</p>
                        </div>
                        <div class="p-3 bg-teal-100 rounded-full">
                            <i class="fas fa-server text-teal-600 text-2xl"></i>
                        </div>
                    </div>
                </div>

                <div class="bg-white rounded-lg shadow p-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm text-gray-600">Linhas Expiradas</p>
                            <p class="text-3xl font-bold text-red-600" id="expiredLines">-</p>
                        </div>
                        <div class="p-3 bg-red-100 rounded-full">
                            <i class="fas fa-exclamation-triangle text-red-600 text-2xl"></i>
                        </div>
                    </div>
                </div>

                <div class="bg-white rounded-lg shadow p-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm text-gray-600">Dispositivos MAG</p>
                            <p class="text-3xl font-bold text-orange-600" id="totalMAG">-</p>
                        </div>
                        <div class="p-3 bg-orange-100 rounded-full">
                            <i class="fas fa-tablet-alt text-orange-600 text-2xl"></i>
                        </div>
                    </div>
                </div>

                <div class="bg-white rounded-lg shadow p-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm text-gray-600">Dispositivos Enigma2</p>
                            <p class="text-3xl font-bold text-cyan-600" id="totalEnigma2">-</p>
                        </div>
                        <div class="p-3 bg-cyan-100 rounded-full">
                            <i class="fas fa-satellite-dish text-cyan-600 text-2xl"></i>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Gráficos -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div class="bg-white rounded-lg shadow p-6">
                    <h3 class="text-lg font-semibold mb-4">Conexões nas Últimas 24h</h3>
                    <canvas id="connectionsChart"></canvas>
                </div>

                <div class="bg-white rounded-lg shadow p-6">
                    <h3 class="text-lg font-semibold mb-4">Top 10 Streams Mais Assistidos</h3>
                    <canvas id="topStreamsChart"></canvas>
                </div>
            </div>

            <!-- Atividades Recentes -->
            <div class="bg-white rounded-lg shadow p-6">
                <h3 class="text-lg font-semibold mb-4">Atividades Recentes</h3>
                <div id="recentActivities" class="space-y-3">
                    <p class="text-gray-500">Carregando...</p>
                </div>
            </div>
        </div>
    `;

    try {
        const data = await apiRequest('dashboard/stats.php');
        
        document.getElementById('totalUsers').textContent = data.total_users || 0;
        document.getElementById('activeLines').textContent = data.active_lines || 0;
        document.getElementById('activeConnections').textContent = data.active_connections || 0;
        document.getElementById('totalStreams').textContent = data.total_streams || 0;
        document.getElementById('onlineServers').textContent = data.online_servers || 0;
        document.getElementById('expiredLines').textContent = data.expired_lines || 0;
        document.getElementById('totalMAG').textContent = data.total_mag || 0;
        document.getElementById('totalEnigma2').textContent = data.total_enigma2 || 0;

        // Gráfico de Conexões
        if (data.connections_data) {
            const ctx = document.getElementById('connectionsChart').getContext('2d');
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: data.connections_data.map(d => d.hour),
                    datasets: [{
                        label: 'Conexões',
                        data: data.connections_data.map(d => d.count),
                        borderColor: 'rgb(99, 102, 241)',
                        backgroundColor: 'rgba(99, 102, 241, 0.1)',
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true
                }
            });
        }

        // Gráfico de Top Streams
        if (data.top_streams && data.top_streams.length > 0) {
            const ctx = document.getElementById('topStreamsChart').getContext('2d');
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: data.top_streams.map(s => s.name || 'Sem nome'),
                    datasets: [{
                        label: 'Visualizações',
                        data: data.top_streams.map(s => s.views),
                        backgroundColor: 'rgba(99, 102, 241, 0.8)'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    indexAxis: 'y'
                }
            });
        }

        // Atividades Recentes
        if (data.recent_activities) {
            const activitiesHTML = data.recent_activities.map(activity => `
                <div class="flex items-center space-x-3 p-3 bg-gray-50 rounded">
                    <i class="fas ${activity.icon} text-${activity.color}-600"></i>
                    <div class="flex-1">
                        <p class="text-sm font-medium">${activity.description}</p>
                        <p class="text-xs text-gray-500">${activity.time}</p>
                    </div>
                </div>
            `).join('');
            document.getElementById('recentActivities').innerHTML = activitiesHTML;
        }

    } catch (error) {
        console.error('Erro ao carregar dashboard:', error);
        content.innerHTML = '<div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">Erro ao carregar dashboard</div>';
    }
}

// ============================================
// FUNÇÕES AUXILIARES
// ============================================
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
        window.location.href = 'auth.html';
        return;
    }
    
    return await response.json();
}

function formatDate(timestamp) {
    if (!timestamp) return '-';
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('pt-BR') + ' ' + date.toLocaleTimeString('pt-BR');
}

function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// Carregar dashboard ao iniciar
loadDashboard();
