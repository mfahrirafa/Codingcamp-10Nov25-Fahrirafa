// ========================================
// KONSTANTA & STATE
// ========================================
const STORAGE_KEY = 'daftarTodo';
let todos = [];
let filterAktif = 'all';

// ========================================
// ELEMEN DOM
// ========================================
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const dateInput = document.getElementById('date-input');
const todoList = document.getElementById('todo-list');
const noTaskMessage = document.getElementById('no-task-message');
const filterBtns = document.querySelectorAll('.filter-btn');
const deleteAllBtn = document.getElementById('delete-all-btn');

// ========================================
// INISIALISASI
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    muatTodos();
    setupEventListeners();
    renderTodos();
});

// ========================================
// EVENT LISTENERS
// ========================================
function setupEventListeners() {
    // Submit form
    todoForm.addEventListener('submit', handleTambahTodo);
    
    // Tombol filter
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterAktif = this.dataset.filter;
            
            // Update tombol aktif
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            renderTodos();
        });
    });
    
    // Tombol hapus semua
    deleteAllBtn.addEventListener('click', handleHapusSemua);
}

// ========================================
// VALIDASI
// ========================================
function validasiForm(task, tanggal) {
    const errors = [];
    
    if (!task || !task.trim()) {
        errors.push('Nama tugas harus diisi!');
    }
    
    if (task.trim().length > 100) {
        errors.push('Nama tugas terlalu panjang (maksimal 100 karakter)');
    }
    
    if (!tanggal) {
        errors.push('Tanggal harus dipilih!');
    }
    
    if (errors.length > 0) {
        alert('Mohon perbaiki error berikut:\n\n' + errors.join('\n'));
        return false;
    }
    
    return true;
}

// ========================================
// TAMBAH TODO
// ========================================
function handleTambahTodo(e) {
    e.preventDefault();
    
    const task = todoInput.value;
    const tanggal = dateInput.value;
    
    // Validasi
    if (!validasiForm(task, tanggal)) {
        return;
    }
    
    // Buat todo baru
    const todoBaru = {
        id: generateId(),
        task: task.trim(),
        tanggal: tanggal,
        status: 'pending',
        dibuatPada: new Date().toISOString()
    };
    
    // Tambah ke array
    todos.push(todoBaru);
    
    // Simpan dan render
    simpanTodos();
    renderTodos();
    
    // Reset form
    todoForm.reset();
    todoInput.focus();
}

// ========================================
// HAPUS TODO
// ========================================
function hapusTodo(id) {
    if (confirm('Apakah kamu yakin ingin menghapus tugas ini?')) {
        todos = todos.filter(todo => todo.id !== id);
        simpanTodos();
        renderTodos();
    }
}

// ========================================
// HAPUS SEMUA
// ========================================
function handleHapusSemua() {
    if (todos.length === 0) {
        alert('Tidak ada tugas untuk dihapus!');
        return;
    }
    
    if (confirm('Apakah kamu yakin ingin menghapus SEMUA tugas?')) {
        todos = [];
        simpanTodos();
        renderTodos();
    }
}

// ========================================
// FILTER TODOS
// ========================================
function getTodosFiltered() {
    switch(filterAktif) {
        case 'active':
            return todos.filter(todo => todo.status === 'pending');
        case 'completed':
            return todos.filter(todo => todo.status === 'completed');
        case 'all':
        default:
            return todos;
    }
}

// ========================================
// RENDER TODOS
// ========================================
function renderTodos() {
    const todosFiltered = getTodosFiltered();
    
    // Kosongkan list
    todoList.innerHTML = '';
    
    // Tampilkan/sembunyikan pesan kosong
    if (todosFiltered.length === 0) {
        noTaskMessage.classList.remove('hidden');
        document.getElementById('todo-table').style.display = 'none';
        return;
    } else {
        noTaskMessage.classList.add('hidden');
        document.getElementById('todo-table').style.display = 'table';
    }
    
    // Render setiap todo
    todosFiltered.forEach(todo => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${todo.task}</td>
            <td>${formatTanggal(todo.tanggal)}</td>
            <td>
                <span class="status-badge status-${todo.status}">
                    ${todo.status === 'pending' ? 'Menunggu' : 'Selesai'}
                </span>
            </td>
            <td>
                <button class="delete-btn" onclick="hapusTodo('${todo.id}')">
                    Hapus
                </button>
            </td>
        `;
        todoList.appendChild(tr);
    });
}

// ========================================
// FUNGSI PENYIMPANAN
// ========================================
function simpanTodos() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    } catch (error) {
        console.error('Gagal menyimpan todos:', error);
        alert('Gagal menyimpan tugas!');
    }
}

function muatTodos() {
    try {
        const tersimpan = localStorage.getItem(STORAGE_KEY);
        todos = tersimpan ? JSON.parse(tersimpan) : [];
    } catch (error) {
        console.error('Gagal memuat todos:', error);
        todos = [];
    }
}

// ========================================
// FUNGSI UTILITY
// ========================================
function generateId() {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

function formatTanggal(tanggalString) {
    const tanggal = new Date(tanggalString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return tanggal.toLocaleDateString('id-ID', options);
}