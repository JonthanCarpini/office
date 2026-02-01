// ============================================
// MÓDULO DE LINHAS (CLIENTES IPTV)
// ============================================

async function loadLines() {
    const content = document.getElementById('content');
    
    content.innerHTML = `
        <div class="space-y-6">
            <!-- Filtros e Ações -->
            <div class="bg-white rounded-lg shadow p-4">
                <div class="flex flex-wrap items-center justify-between gap-4">
                    <div class="flex items-center space-x-4">
                        <input type="text" id="searchLines" placeholder="Buscar por username ou IP..." 
                            class="px-4 py-2 border rounded-lg w-64">
                        <select id="filterStatus" class="px-4 py-2 border rounded-lg">
                            <option value="">Todos os Status</option>
                            <option value="active">Ativas</option>
                            <option value="expired">Expiradas</option>
                            <option value="disabled">Desabilitadas</option>
                            <option value="trial">Trial</option>
                        </select>
                    </div>
                    <button onclick="openLineModal()" class="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
                        <i class="fas fa-plus mr-2"></i>Nova Linha
                    </button>
                </div>
            </div>

            <!-- Tabela de Linhas -->
            <div class="bg-white rounded-lg shadow overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Username</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expira em</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Conexões</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Max Conexões</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Último IP</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Proprietário</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
                            </tr>
                        </thead>
                        <tbody id="linesTableBody" class="bg-white divide-y divide-gray-200">
                            <tr><td colspan="9" class="px-6 py-4 text-center text-gray-500">Carregando...</td></tr>
                        </tbody>
                    </table>
                </div>
                
                <!-- Paginação -->
                <div id="linesPagination" class="px-6 py-4 border-t border-gray-200"></div>
            </div>
        </div>

        <!-- Modal de Linha -->
        <div id="lineModal" class="hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div class="p-6 border-b border-gray-200">
                    <h3 class="text-xl font-semibold" id="lineModalTitle">Nova Linha</h3>
                </div>
                <form id="lineForm" class="p-6 space-y-4">
                    <input type="hidden" id="lineId">
                    
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Username *</label>
                            <input type="text" id="lineUsername" required class="w-full px-4 py-2 border rounded-lg">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Password *</label>
                            <input type="text" id="linePassword" required class="w-full px-4 py-2 border rounded-lg">
                        </div>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Data de Expiração</label>
                            <input type="date" id="lineExpDate" class="w-full px-4 py-2 border rounded-lg">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Max Conexões</label>
                            <input type="number" id="lineMaxConnections" value="1" min="1" class="w-full px-4 py-2 border rounded-lg">
                        </div>
                    </div>

                    <div class="grid grid-cols-3 gap-4">
                        <div class="flex items-center">
                            <input type="checkbox" id="lineAdminEnabled" checked class="mr-2">
                            <label class="text-sm font-medium text-gray-700">Admin Habilitado</label>
                        </div>
                        <div class="flex items-center">
                            <input type="checkbox" id="lineEnabled" checked class="mr-2">
                            <label class="text-sm font-medium text-gray-700">Habilitado</label>
                        </div>
                        <div class="flex items-center">
                            <input type="checkbox" id="lineIsTrial" class="mr-2">
                            <label class="text-sm font-medium text-gray-700">Trial</label>
                        </div>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Notas do Admin</label>
                        <textarea id="lineAdminNotes" rows="3" class="w-full px-4 py-2 border rounded-lg"></textarea>
                    </div>

                    <div class="flex justify-end space-x-3 pt-4">
                        <button type="button" onclick="closeLineModal()" class="px-4 py-2 border rounded-lg hover:bg-gray-50">
                            Cancelar
                        </button>
                        <button type="submit" class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                            Salvar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;

    // Event listeners
    document.getElementById('searchLines').addEventListener('input', debounce(() => loadLinesData(), 500));
    document.getElementById('filterStatus').addEventListener('change', () => loadLinesData());
    document.getElementById('lineForm').addEventListener('submit', handleLineSave);

    await loadLinesData();
}

async function loadLinesData(page = 1) {
    const search = document.getElementById('searchLines').value;
    const status = document.getElementById('filterStatus').value;
    
    try {
        const data = await apiRequest(`lines/list.php?page=${page}&search=${search}&status=${status}`);
        
        const tbody = document.getElementById('linesTableBody');
        
        if (data.lines && data.lines.length > 0) {
            tbody.innerHTML = data.lines.map(line => `
                <tr class="hover:bg-gray-50">
                    <td class="px-6 py-4 text-sm">${line.id}</td>
                    <td class="px-6 py-4 text-sm font-medium">${line.username}</td>
                    <td class="px-6 py-4">
                        <span class="px-2 py-1 text-xs rounded-full bg-${line.status_color}-100 text-${line.status_color}-800">
                            ${line.status_text}
                        </span>
                    </td>
                    <td class="px-6 py-4 text-sm">
                        ${line.days_remaining > 0 ? line.days_remaining + ' dias' : 'Expirada'}
                    </td>
                    <td class="px-6 py-4 text-sm">${line.active_connections || 0}</td>
                    <td class="px-6 py-4 text-sm">${line.max_connections}</td>
                    <td class="px-6 py-4 text-sm">${line.last_ip || '-'}</td>
                    <td class="px-6 py-4 text-sm">${line.owner_username || '-'}</td>
                    <td class="px-6 py-4 text-sm">
                        <button onclick="editLine(${line.id})" class="text-blue-600 hover:text-blue-800 mr-3">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button onclick="deleteLine(${line.id}, '${line.username}')" class="text-red-600 hover:text-red-800">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `).join('');
        } else {
            tbody.innerHTML = '<tr><td colspan="9" class="px-6 py-4 text-center text-gray-500">Nenhuma linha encontrada</td></tr>';
        }

        // Paginação
        if (data.pagination) {
            renderPagination('linesPagination', data.pagination, loadLinesData);
        }

    } catch (error) {
        console.error('Erro ao carregar linhas:', error);
        document.getElementById('linesTableBody').innerHTML = 
            '<tr><td colspan="9" class="px-6 py-4 text-center text-red-500">Erro ao carregar linhas</td></tr>';
    }
}

function openLineModal(lineId = null) {
    const modal = document.getElementById('lineModal');
    const title = document.getElementById('lineModalTitle');
    const form = document.getElementById('lineForm');
    
    form.reset();
    document.getElementById('lineId').value = '';
    
    if (lineId) {
        title.textContent = 'Editar Linha';
        loadLineData(lineId);
    } else {
        title.textContent = 'Nova Linha';
        // Definir data de expiração padrão (30 dias)
        const expDate = new Date();
        expDate.setDate(expDate.getDate() + 30);
        document.getElementById('lineExpDate').value = expDate.toISOString().split('T')[0];
    }
    
    modal.classList.remove('hidden');
}

function closeLineModal() {
    document.getElementById('lineModal').classList.add('hidden');
}

async function loadLineData(lineId) {
    try {
        const data = await apiRequest(`lines/list.php?id=${lineId}`);
        const line = data.lines[0];
        
        if (line) {
            document.getElementById('lineId').value = line.id;
            document.getElementById('lineUsername').value = line.username;
            document.getElementById('linePassword').value = line.password;
            document.getElementById('lineMaxConnections').value = line.max_connections;
            document.getElementById('lineAdminEnabled').checked = line.admin_enabled == 1;
            document.getElementById('lineEnabled').checked = line.enabled == 1;
            document.getElementById('lineIsTrial').checked = line.is_trial == 1;
            document.getElementById('lineAdminNotes').value = line.admin_notes || '';
            
            if (line.exp_date > 0) {
                const expDate = new Date(line.exp_date * 1000);
                document.getElementById('lineExpDate').value = expDate.toISOString().split('T')[0];
            }
        }
    } catch (error) {
        console.error('Erro ao carregar dados da linha:', error);
        alert('Erro ao carregar dados da linha');
    }
}

async function handleLineSave(e) {
    e.preventDefault();
    
    const lineId = document.getElementById('lineId').value;
    const expDateInput = document.getElementById('lineExpDate').value;
    const expDate = expDateInput ? Math.floor(new Date(expDateInput).getTime() / 1000) : 0;
    
    const lineData = {
        username: document.getElementById('lineUsername').value,
        password: document.getElementById('linePassword').value,
        exp_date: expDate,
        max_connections: parseInt(document.getElementById('lineMaxConnections').value),
        admin_enabled: document.getElementById('lineAdminEnabled').checked ? 1 : 0,
        enabled: document.getElementById('lineEnabled').checked ? 1 : 0,
        is_trial: document.getElementById('lineIsTrial').checked ? 1 : 0,
        admin_notes: document.getElementById('lineAdminNotes').value
    };
    
    try {
        if (lineId) {
            lineData.id = lineId;
            await apiRequest('lines/update.php', {
                method: 'POST',
                body: JSON.stringify(lineData)
            });
            alert('Linha atualizada com sucesso!');
        } else {
            await apiRequest('lines/create.php', {
                method: 'POST',
                body: JSON.stringify(lineData)
            });
            alert('Linha criada com sucesso!');
        }
        
        closeLineModal();
        loadLinesData();
    } catch (error) {
        console.error('Erro ao salvar linha:', error);
        alert('Erro ao salvar linha: ' + (error.message || 'Erro desconhecido'));
    }
}

function editLine(lineId) {
    openLineModal(lineId);
}

async function deleteLine(lineId, username) {
    if (!confirm(`Tem certeza que deseja deletar a linha "${username}"?`)) {
        return;
    }
    
    try {
        await apiRequest('lines/delete.php', {
            method: 'POST',
            body: JSON.stringify({ id: lineId })
        });
        alert('Linha deletada com sucesso!');
        loadLinesData();
    } catch (error) {
        console.error('Erro ao deletar linha:', error);
        alert('Erro ao deletar linha');
    }
}

// ============================================
// LINHAS LIVE (CONEXÕES ATIVAS)
// ============================================

async function loadLinesLive() {
    const content = document.getElementById('content');
    
    content.innerHTML = `
        <div class="space-y-6">
            <div class="bg-white rounded-lg shadow p-4">
                <div class="flex items-center justify-between">
                    <div>
                        <h3 class="text-lg font-semibold">Conexões Ativas em Tempo Real</h3>
                        <p class="text-sm text-gray-500">Atualização automática a cada 10 segundos</p>
                    </div>
                    <button onclick="loadLinesLiveData()" class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                        <i class="fas fa-sync-alt mr-2"></i>Atualizar
                    </button>
                </div>
            </div>

            <div class="bg-white rounded-lg shadow overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Username</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stream</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Servidor</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">IP</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User Agent</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Início</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duração</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
                            </tr>
                        </thead>
                        <tbody id="linesLiveTableBody" class="bg-white divide-y divide-gray-200">
                            <tr><td colspan="8" class="px-6 py-4 text-center text-gray-500">Carregando...</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;

    await loadLinesLiveData();
    
    // Auto-refresh a cada 10 segundos
    setInterval(loadLinesLiveData, 10000);
}

async function loadLinesLiveData() {
    try {
        const data = await apiRequest('lines/live.php');
        
        const tbody = document.getElementById('linesLiveTableBody');
        
        if (data.connections && data.connections.length > 0) {
            tbody.innerHTML = data.connections.map(conn => {
                const duration = Math.floor((Date.now() / 1000) - conn.date_start);
                const hours = Math.floor(duration / 3600);
                const minutes = Math.floor((duration % 3600) / 60);
                const durationText = `${hours}h ${minutes}m`;
                
                return `
                    <tr class="hover:bg-gray-50">
                        <td class="px-6 py-4 text-sm font-medium">${conn.username || '-'}</td>
                        <td class="px-6 py-4 text-sm">${conn.stream_name || '-'}</td>
                        <td class="px-6 py-4 text-sm">${conn.server_name || '-'}</td>
                        <td class="px-6 py-4 text-sm">${conn.user_ip || '-'}</td>
                        <td class="px-6 py-4 text-sm truncate max-w-xs">${conn.user_agent || '-'}</td>
                        <td class="px-6 py-4 text-sm">${formatDate(conn.date_start)}</td>
                        <td class="px-6 py-4 text-sm">${durationText}</td>
                        <td class="px-6 py-4 text-sm">
                            <button onclick="killConnection(${conn.activity_id})" class="text-red-600 hover:text-red-800">
                                <i class="fas fa-times-circle"></i> Encerrar
                            </button>
                        </td>
                    </tr>
                `;
            }).join('');
        } else {
            tbody.innerHTML = '<tr><td colspan="8" class="px-6 py-4 text-center text-gray-500">Nenhuma conexão ativa</td></tr>';
        }
    } catch (error) {
        console.error('Erro ao carregar conexões ativas:', error);
    }
}

async function killConnection(activityId) {
    if (!confirm('Tem certeza que deseja encerrar esta conexão?')) {
        return;
    }
    
    try {
        await apiRequest('lines/kill-connection.php', {
            method: 'POST',
            body: JSON.stringify({ activity_id: activityId })
        });
        alert('Conexão encerrada com sucesso!');
        loadLinesLiveData();
    } catch (error) {
        console.error('Erro ao encerrar conexão:', error);
        alert('Erro ao encerrar conexão');
    }
}

// ============================================
// ATIVIDADES DAS LINHAS
// ============================================

async function loadLinesActivity() {
    const content = document.getElementById('content');
    
    content.innerHTML = `
        <div class="space-y-6">
            <div class="bg-white rounded-lg shadow p-4">
                <div class="flex items-center space-x-4">
                    <input type="text" id="searchActivity" placeholder="Buscar por username..." 
                        class="px-4 py-2 border rounded-lg w-64">
                    <input type="date" id="filterDateStart" class="px-4 py-2 border rounded-lg">
                    <input type="date" id="filterDateEnd" class="px-4 py-2 border rounded-lg">
                    <button onclick="loadLinesActivityData()" class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                        Filtrar
                    </button>
                </div>
            </div>

            <div class="bg-white rounded-lg shadow overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Username</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stream</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">IP</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">País</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ISP</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Início</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fim</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duração</th>
                            </tr>
                        </thead>
                        <tbody id="activityTableBody" class="bg-white divide-y divide-gray-200">
                            <tr><td colspan="8" class="px-6 py-4 text-center text-gray-500">Carregando...</td></tr>
                        </tbody>
                    </table>
                </div>
                
                <div id="activityPagination" class="px-6 py-4 border-t border-gray-200"></div>
            </div>
        </div>
    `;

    await loadLinesActivityData();
}

async function loadLinesActivityData(page = 1) {
    const search = document.getElementById('searchActivity')?.value || '';
    const dateStart = document.getElementById('filterDateStart')?.value || '';
    const dateEnd = document.getElementById('filterDateEnd')?.value || '';
    
    try {
        const data = await apiRequest(`lines/activity.php?page=${page}&search=${search}&date_start=${dateStart}&date_end=${dateEnd}`);
        
        const tbody = document.getElementById('activityTableBody');
        
        if (data.activities && data.activities.length > 0) {
            tbody.innerHTML = data.activities.map(activity => {
                const duration = activity.date_end > 0 ? activity.date_end - activity.date_start : 0;
                const hours = Math.floor(duration / 3600);
                const minutes = Math.floor((duration % 3600) / 60);
                const durationText = duration > 0 ? `${hours}h ${minutes}m` : 'Em andamento';
                
                return `
                    <tr class="hover:bg-gray-50">
                        <td class="px-6 py-4 text-sm font-medium">${activity.username || '-'}</td>
                        <td class="px-6 py-4 text-sm">${activity.stream_name || '-'}</td>
                        <td class="px-6 py-4 text-sm">${activity.user_ip || '-'}</td>
                        <td class="px-6 py-4 text-sm">${activity.geoip_country_code || '-'}</td>
                        <td class="px-6 py-4 text-sm">${activity.isp || '-'}</td>
                        <td class="px-6 py-4 text-sm">${formatDate(activity.date_start)}</td>
                        <td class="px-6 py-4 text-sm">${activity.date_end > 0 ? formatDate(activity.date_end) : '-'}</td>
                        <td class="px-6 py-4 text-sm">${durationText}</td>
                    </tr>
                `;
            }).join('');
        } else {
            tbody.innerHTML = '<tr><td colspan="8" class="px-6 py-4 text-center text-gray-500">Nenhuma atividade encontrada</td></tr>';
        }

        if (data.pagination) {
            renderPagination('activityPagination', data.pagination, loadLinesActivityData);
        }
    } catch (error) {
        console.error('Erro ao carregar atividades:', error);
    }
}

// ============================================
// LOGS DAS LINHAS
// ============================================

async function loadLinesLogs() {
    const content = document.getElementById('content');
    
    content.innerHTML = `
        <div class="space-y-6">
            <div class="bg-white rounded-lg shadow p-4">
                <input type="text" id="searchLogs" placeholder="Buscar por username..." 
                    class="px-4 py-2 border rounded-lg w-64">
            </div>

            <div class="bg-white rounded-lg shadow overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Username</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mensagem</th>
                            </tr>
                        </thead>
                        <tbody id="logsTableBody" class="bg-white divide-y divide-gray-200">
                            <tr><td colspan="4" class="px-6 py-4 text-center text-gray-500">Carregando...</td></tr>
                        </tbody>
                    </table>
                </div>
                
                <div id="logsPagination" class="px-6 py-4 border-t border-gray-200"></div>
            </div>
        </div>
    `;

    document.getElementById('searchLogs').addEventListener('input', debounce(() => loadLinesLogsData(), 500));
    await loadLinesLogsData();
}

async function loadLinesLogsData(page = 1) {
    const search = document.getElementById('searchLogs')?.value || '';
    
    try {
        const data = await apiRequest(`lines/logs.php?page=${page}&search=${search}`);
        
        const tbody = document.getElementById('logsTableBody');
        
        if (data.logs && data.logs.length > 0) {
            tbody.innerHTML = data.logs.map(log => `
                <tr class="hover:bg-gray-50">
                    <td class="px-6 py-4 text-sm">${formatDate(log.date)}</td>
                    <td class="px-6 py-4 text-sm font-medium">${log.username || '-'}</td>
                    <td class="px-6 py-4 text-sm">
                        <span class="px-2 py-1 text-xs rounded-full ${getLogTypeColor(log.type)}">
                            ${log.type_text}
                        </span>
                    </td>
                    <td class="px-6 py-4 text-sm">${log.message || '-'}</td>
                </tr>
            `).join('');
        } else {
            tbody.innerHTML = '<tr><td colspan="4" class="px-6 py-4 text-center text-gray-500">Nenhum log encontrado</td></tr>';
        }

        if (data.pagination) {
            renderPagination('logsPagination', data.pagination, loadLinesLogsData);
        }
    } catch (error) {
        console.error('Erro ao carregar logs:', error);
    }
}

function getLogTypeColor(type) {
    const colors = {
        'login': 'bg-green-100 text-green-800',
        'logout': 'bg-gray-100 text-gray-800',
        'error': 'bg-red-100 text-red-800',
        'warning': 'bg-yellow-100 text-yellow-800',
        'info': 'bg-blue-100 text-blue-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
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
