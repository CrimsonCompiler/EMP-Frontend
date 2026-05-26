<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { apiFetch } from '../services/api';

const router = useRouter();

interface Employee {
  id: number;
  name: string;
  role: string;
  department: string;
  site?: string;
  salary?: number;
  status?: string;
  photo?: string;
}

const employees = ref<Employee[]>([]);
const showModal = ref(false);
const editEmployee = ref<Employee | null>(null);
const isAdmin = ref(true);

const handleLogout = () => {
  localStorage.removeItem('employee_token');
  router.push('/login');
};

const handleAddEmployee = () => {
  router.push('/add-employee');
};

const fetchEmployees = async (): Promise<void> => {
  try {
    const response = await apiFetch('/employees');
    if (response.ok) {
      const data = await response.json();
      employees.value = data.map((emp: any) => ({
        id: emp.id,
        name: emp.name,
        role: emp.role,
        department: emp.department,
        site: emp.site || 'Stockholm',
        salary: emp.salary ?? 0,
        status: emp.status || 'Invited',
        photo: emp.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(emp.name)}&background=2563eb&color=ffffff&rounded=true`,
      }));
    }
  } catch (error) {
    console.error('Fetch error:', error);
  }
};

const openEdit = (employee: Employee) => {
  editEmployee.value = { ...employee };
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  editEmployee.value = null;
};

const saveEmployee = async () => {
  if (!editEmployee.value) return;

  try {
    await apiFetch(`/employees/${editEmployee.value.id}`, {
      method: 'PUT',
      body: JSON.stringify(editEmployee.value),
    });
  } catch (error) {
    console.error('Update error:', error);
  }

  const index = employees.value.findIndex((item) => item.id === editEmployee.value?.id);
  if (index > -1) {
    employees.value[index] = { ...editEmployee.value };
  }

  closeModal();
};

const deleteEmployee = async (id: number) => {
  if (!confirm('Delete this employee?')) return;

  try {
    await apiFetch(`/employees/${id}`, {
      method: 'DELETE',
    });
  } catch (error) {
    console.error('Delete error:', error);
  }

  employees.value = employees.value.filter((emp) => emp.id !== id);
};

onMounted(() => {
  fetchEmployees();
});
</script>

<template>
  <div class="dashboard-shell">
    <div class="dashboard-topbar">
      <div>
        <p class="eyebrow">Employee management</p>
        <h1>Team directory</h1>
      </div>
      <div class="topbar-actions">
        <button class="add-employee-button" @click="handleAddEmployee">+ Add Employee</button>
        <button class="logout-button" @click="handleLogout">Logout</button>
      </div>
    </div>

    <div class="metrics-row">
      <div class="metric-card">
        <p>Total employees</p>
        <h2>{{ employees.length }}</h2>
      </div>
      <div class="metric-card">
        <p>Employed</p>
        <h2>{{ employees.filter((item) => item.status?.toLowerCase() === 'employed').length }}</h2>
      </div>
    </div>

    <section class="table-panel">
      <div class="panel-header">
        <div>
          <h2>Employee list</h2>
          <p class="panel-copy">Edit or delete records. Admin users can update employee details.</p>
        </div>
      </div>

      <div class="table-wrap">
        <table class="employee-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th>Department</th>
              <th class="actions-cell">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="emp in employees" :key="emp.id">
              <td class="employee-cell">
                <img :src="emp.photo" alt="Employee avatar" class="avatar" />
                <div>
                  <strong>{{ emp.name }}</strong>
                </div>
              </td>
              <td>{{ emp.role }}</td>
              <td>{{ emp.department }}</td>
              <td class="actions-cell">
                <button class="action-link" v-if="isAdmin" @click="openEdit(emp)">Edit</button>
                <button class="action-link delete" @click="deleteEmployee(emp.id)">Delete</button>
              </td>
            </tr>
            <tr v-if="employees.length === 0">
              <td colspan="4" class="empty-state">No employees available.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <div v-if="showModal" class="modal-backdrop" @click.self="closeModal">
      <div class="modal-panel">
        <div class="modal-header">
          <div>
            <p class="modal-eyebrow">Admin editing</p>
            <h2>Update employee</h2>
          </div>
          <button class="close-button" @click="closeModal" aria-label="Close modal">×</button>
        </div>

        <form class="modal-form" v-if="editEmployee" @submit.prevent="saveEmployee">
          <div class="field-grid">
            <label>
              Name
              <input v-model="editEmployee.name" type="text" required />
            </label>
            <label>
              Role
              <input v-model="editEmployee.role" type="text" required />
            </label>
            <label>
              Department
              <input v-model="editEmployee.department" type="text" required />
            </label>
          </div>

          <div class="modal-actions">
            <button type="button" class="secondary-button" @click="closeModal">Cancel</button>
            <button type="submit" class="primary-button">Save changes</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

.dashboard-shell {
  min-height: 100vh;
  padding: 2rem;
  background: #eef6fb;
  color: #12263f;
  font-family: 'Inter', sans-serif;
}

.dashboard-topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.75rem;
}

.eyebrow {
  margin: 0 0 0.35rem;
  color: #6b7280;
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.22em;
}

.dashboard-topbar h1 {
  margin: 0;
  font-size: clamp(2rem, 2.5vw, 2.6rem);
  font-weight: 700;
}

.topbar-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.search-input {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: min(440px, 100%);
  padding: 0.9rem 1rem;
  border-radius: 18px;
  background: #ffffff;
  border: 1px solid #dbe4ef;
  box-shadow: 0 12px 24px rgba(15, 23, 42, 0.06);
}

.search-input svg {
  width: 1rem;
  height: 1rem;
  color: #667085;
}

.search-input input {
  border: none;
  outline: none;
  width: 100%;
  font-size: 0.95rem;
  color: #0f172a;
  background: transparent;
}

.logout-button {
  border: none;
  background: #1d4ed8;
  color: #ffffff;
  padding: 0.95rem 1.4rem;
  border-radius: 16px;
  cursor: pointer;
  font-weight: 600;
  box-shadow: 0 14px 30px rgba(29, 78, 216, 0.2);
  transition: transform 0.2s ease, background 0.2s ease;
}

.logout-button:hover {
  transform: translateY(-1px);
  background: #1e40af;
}

.add-employee-button {
  border: none;
  background: #10b981;
  color: #ffffff;
  padding: 0.95rem 1.4rem;
  border-radius: 16px;
  cursor: pointer;
  font-weight: 600;
  box-shadow: 0 14px 30px rgba(16, 185, 129, 0.2);
  transition: transform 0.2s ease, background 0.2s ease;
}

.add-employee-button:hover {
  transform: translateY(-1px);
  background: #059669;
}

.metrics-row {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
  margin-bottom: 1.75rem;
}

.metric-card {
  padding: 1.5rem 1.4rem;
  border-radius: 28px;
  background: linear-gradient(135deg, rgba(255,255,255,0.95), #ffffff);
  border: 1px solid #e5e9f2;
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.06);
}

.metric-card p {
  margin: 0;
  color: #667085;
  font-size: 0.95rem;
}

.metric-card h2 {
  margin: 0.85rem 0 0;
  font-size: 2rem;
  font-weight: 700;
}

.table-panel {
  background: #ffffff;
  border-radius: 32px;
  padding: 1.75rem;
  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.08);
  border: 1px solid #e6ebf3;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.panel-header h2 {
  margin: 0;
  font-size: 1.6rem;
  font-weight: 700;
}

.panel-copy {
  margin: 0.55rem 0 0;
  color: #475569;
  font-size: 0.96rem;
}

.table-wrap {
  overflow-x: auto;
}

.employee-table {
  width: 100%;
  min-width: 840px;
  border-collapse: collapse;
}

.employee-table th,
.employee-table td {
  padding: 1rem 1rem;
  text-align: left;
}

.employee-table thead th {
  color: #475569;
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  border-bottom: 1px solid #e9eff8;
}

.employee-table tbody tr {
  transition: background 0.2s ease;
}

.employee-table tbody tr:hover {
  background: #f8fafc;
}

.checkbox-cell {
  width: 44px;
}

.employee-cell {
  display: flex;
  align-items: center;
  gap: 0.9rem;
}

.avatar {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  object-fit: cover;
}

.employee-cell strong {
  display: block;
  font-size: 0.98rem;
}

.employee-cell p {
  margin: 0.35rem 0 0;
  color: #64748b;
  font-size: 0.88rem;
}

.status-chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.55rem 0.9rem;
  border-radius: 999px;
  font-size: 0.82rem;
  font-weight: 600;
}

.status-chip.status-default {
  color: #475569;
  background: rgba(148, 163, 184, 0.16);
}

.status-chip.status-invited {
  color: #2563eb;
  background: rgba(37, 99, 235, 0.12);
}

.status-chip.status-hired {
  color: #16a34a;
  background: rgba(22, 163, 74, 0.12);
}

.status-chip.status-employed {
  color: #0f766e;
  background: rgba(15, 118, 110, 0.12);
}

.status-chip.status-absent {
  color: #c2410c;
  background: rgba(252, 211, 77, 0.2);
}

.actions-cell {
  min-width: 150px;
}

.action-link {
  border: none;
  background: transparent;
  color: #2563eb;
  cursor: pointer;
  font-weight: 600;
  padding: 0;
}

.action-link.delete {
  color: #dc2626;
  margin-left: 0.75rem;
}

.empty-state {
  padding: 3rem 0;
  color: #64748b;
  text-align: center;
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  display: grid;
  place-items: center;
  background: rgba(15, 23, 42, 0.38);
  z-index: 20;
  padding: 1rem;
}

.modal-panel {
  width: min(660px, 100%);
  border-radius: 28px;
  background: #ffffff;
  box-shadow: 0 30px 80px rgba(15, 23, 42, 0.18);
  padding: 1.75rem;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.modal-eyebrow {
  margin: 0 0 0.35rem;
  color: #6b7280;
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.18em;
}

.modal-panel h2 {
  margin: 0;
  font-size: 1.45rem;
}

.close-button {
  border: none;
  background: #f1f5f9;
  width: 40px;
  height: 40px;
  border-radius: 14px;
  font-size: 1.35rem;
  color: #334155;
  cursor: pointer;
}

.modal-form {
  margin-top: 1.5rem;
}

.field-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.field-grid label {
  display: grid;
  gap: 0.5rem;
  color: #334155;
  font-size: 0.92rem;
}

.field-grid input,
.field-grid select {
  width: 100%;
  border: 1px solid #cbd5e1;
  border-radius: 16px;
  padding: 0.95rem 1rem;
  font-size: 0.95rem;
  color: #0f172a;
  background: #f8fafc;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.9rem;
  margin-top: 1.5rem;
}

.primary-button,
.secondary-button {
  border: none;
  border-radius: 16px;
  padding: 0.95rem 1.4rem;
  font-weight: 600;
  cursor: pointer;
}

.primary-button {
  color: #ffffff;
  background: #1d4ed8;
}

.secondary-button {
  color: #475569;
  background: #f8fafc;
}

@media (max-width: 1024px) {
  .metrics-row {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .field-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 780px) {
  .dashboard-topbar,
  .panel-header,
  .modal-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .dashboard-topbar {
    align-items: flex-start;
  }

  .search-input,
  .logout-button {
    width: 100%;
  }
}

@media (max-width: 640px) {
  .metrics-row {
    grid-template-columns: 1fr;
  }

  .employee-table {
    min-width: 620px;
  }
}
</style>