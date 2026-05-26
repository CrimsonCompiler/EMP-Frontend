<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { apiFetch } from '../services/api';
import { getToken } from '../services/auth';
import type { EmployeeCreateRequest } from '../types/Employee';

const router = useRouter();
const isAuthorized = ref(false);
const isLoading = ref(false);
const error = ref('');
const success = ref('');

const formData = ref<EmployeeCreateRequest>({
  name: '',
  department: '',
  role: '',
});

// Security: Check if user is authenticated and authorized
const checkAuthorization = () => {
  const token = getToken();
  if (!token) {
    router.push('/login');
    return;
  }
  isAuthorized.value = true;
};

onMounted(() => {
  checkAuthorization();
});

const validateForm = (): boolean => {
  if (!formData.value.name.trim()) {
    error.value = 'Employee name is required';
    return false;
  }
  if (!formData.value.department.trim()) {
    error.value = 'Department is required';
    return false;
  }
  if (!formData.value.role.trim()) {
    error.value = 'Role is required';
    return false;
  }
  if (formData.value.name.length < 2) {
    error.value = 'Name must be at least 2 characters';
    return false;
  }
  return true;
};

const handleSubmit = async () => {
  error.value = '';
  success.value = '';

  if (!validateForm()) {
    return;
  }

  isLoading.value = true;

  try {
    const response = await apiFetch('/employees', {
      method: 'POST',
      body: JSON.stringify(formData.value),
    });

    if (response.ok) {
      success.value = 'Employee added successfully!';
      formData.value = { name: '', department: '', role: '' };
      
      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } else if (response.status === 403) {
      error.value = 'You do not have permission to add employees';
    } else if (response.status === 401) {
      error.value = 'Your session has expired. Please login again.';
      router.push('/login');
    } else {
      const errorData = await response.json();
      error.value = errorData.message || 'Failed to add employee';
    }
  } catch (err) {
    error.value = 'Error communicating with server. Please try again.';
    console.error('Add employee error:', err);
  } finally {
    isLoading.value = false;
  }
};

const handleCancel = () => {
  router.push('/dashboard');
};
</script>

<template>
  <div class="add-employee-shell" v-if="isAuthorized">
    <div class="page-header">
      <div>
        <p class="eyebrow">Employee Management</p>
        <h1>Add New Employee</h1>
        <p class="subtitle">Create a new employee record with required information</p>
      </div>
      <button class="back-button" @click="handleCancel">
        ← Back to Dashboard
      </button>
    </div>

    <div class="form-container">
      <div class="form-card">
        <!-- Error Alert -->
        <div v-if="error" class="alert alert-error" role="alert">
          <div class="alert-icon">⚠️</div>
          <div class="alert-content">
            <strong>Error</strong>
            <p>{{ error }}</p>
          </div>
          <button class="alert-close" @click="error = ''">×</button>
        </div>

        <!-- Success Alert -->
        <div v-if="success" class="alert alert-success" role="alert">
          <div class="alert-icon">✓</div>
          <div class="alert-content">
            <strong>Success</strong>
            <p>{{ success }}</p>
          </div>
          <button class="alert-close" @click="success = ''">×</button>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleSubmit" class="employee-form">
          <!-- Name Field -->
          <div class="form-group">
            <label for="name" class="form-label">
              Employee Name
              <span class="required">*</span>
            </label>
            <input
              type="text"
              id="name"
              class="form-input"
              v-model="formData.name"
              placeholder="e.g., John Doe"
              :disabled="isLoading"
              maxlength="100"
              required
            />
            <p class="form-hint">Full name of the employee</p>
          </div>

          <!-- Department Field (Text Input) -->
          <div class="form-group">
            <label for="department" class="form-label">
              Department
              <span class="required">*</span>
            </label>
            <input
              type="text"
              id="department"
              class="form-input"
              v-model="formData.department"
              placeholder="e.g., IT, HR, Finance"
              :disabled="isLoading"
              maxlength="50"
              required
            />
            <p class="form-hint">Department or team name</p>
          </div>

          <!-- Role Field -->
          <div class="form-group">
            <label for="role" class="form-label">
              Role/Position
              <span class="required">*</span>
            </label>
            <input
              type="text"
              id="role"
              class="form-input"
              v-model="formData.role"
              placeholder="e.g., Senior Developer, Manager"
              :disabled="isLoading"
              maxlength="50"
              required
            />
            <p class="form-hint">Job title or position</p>
          </div>

          <!-- Form Actions -->
          <div class="form-actions">
            <button
              type="button"
              class="btn btn-secondary"
              @click="handleCancel"
              :disabled="isLoading"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="btn btn-primary"
              :disabled="isLoading"
            >
              <span v-if="!isLoading">Add Employee</span>
              <span v-else class="loading-state">
                <span class="spinner"></span>
                Adding...
              </span>
            </button>
          </div>
        </form>

        <!-- Security Note -->
        <div class="security-note">
          <p class="note-icon">🔒</p>
          <div>
            <strong>Secure & Protected</strong>
            <p>All employee data is encrypted in transit with JWT authentication tokens.</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Loading state while checking authorization -->
  <div v-else class="loading-container">
    <div class="spinner-large"></div>
    <p>Authenticating...</p>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

* {
  font-family: 'Inter', sans-serif;
}

.add-employee-shell {
  min-height: 100vh;
  padding: 2rem;
  background: linear-gradient(135deg, #eef6fb 0%, #e0eef8 100%);
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 2rem;
  margin-bottom: 2rem;
}

.eyebrow {
  margin: 0 0 0.35rem;
  color: #6b7280;
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.22em;
}

.page-header h1 {
  margin: 0 0 0.5rem;
  font-size: 2.2rem;
  font-weight: 700;
  color: #12263f;
}

.subtitle {
  margin: 0;
  color: #667085;
  font-size: 1rem;
}

.back-button {
  padding: 0.75rem 1.25rem;
  background: #ffffff;
  border: 1px solid #e5e9f2;
  border-radius: 12px;
  color: #12263f;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.08);
}

.back-button:hover {
  background: #f8f9fb;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.12);
}

.form-container {
  max-width: 600px;
}

.form-card {
  background: #ffffff;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 20px 50px rgba(15, 23, 42, 0.1);
  border: 1px solid #e5e9f2;
}

.alert {
  padding: 1rem 1.25rem;
  border-radius: 12px;
  margin-bottom: 1.5rem;
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.alert-icon {
  font-size: 1.25rem;
  flex-shrink: 0;
}

.alert-content {
  flex: 1;
}

.alert-content strong {
  display: block;
  margin-bottom: 0.25rem;
}

.alert-content p {
  margin: 0;
  font-size: 0.95rem;
}

.alert-error {
  background: #fef2f2;
  color: #7f1d1d;
  border: 1px solid #fecaca;
}

.alert-success {
  background: #f0fdf4;
  color: #166534;
  border: 1px solid #bbf7d0;
}

.alert-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: inherit;
  cursor: pointer;
  padding: 0;
  flex-shrink: 0;
  opacity: 0.7;
  transition: opacity 0.2s;
}

.alert-close:hover {
  opacity: 1;
}

.employee-form {
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1.75rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  color: #12263f;
  font-weight: 600;
  font-size: 0.95rem;
}

.required {
  color: #ef4444;
  margin-left: 0.25rem;
}

.form-input {
  width: 100%;
  padding: 0.85rem 1rem;
  border: 1px solid #e5e9f2;
  border-radius: 10px;
  font-size: 0.95rem;
  color: #12263f;
  transition: all 0.2s ease;
  background: #ffffff;
}

.form-input:focus {
  outline: none;
  border-color: #1d4ed8;
  box-shadow: 0 0 0 3px rgba(29, 78, 216, 0.1);
  background: #ffffff;
}

.form-input:disabled {
  background: #f8f9fb;
  color: #9ca3af;
  cursor: not-allowed;
}

.form-hint {
  margin: 0.35rem 0 0;
  font-size: 0.85rem;
  color: #9ca3af;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e9f2;
}

.btn {
  padding: 0.85rem 1.75rem;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-primary {
  background: linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%);
  color: #ffffff;
  box-shadow: 0 8px 16px rgba(29, 78, 216, 0.3);
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 12px 24px rgba(29, 78, 216, 0.4);
}

.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-secondary {
  background: #f3f4f6;
  color: #12263f;
  border: 1px solid #e5e9f2;
}

.btn-secondary:hover:not(:disabled) {
  background: #e5e7eb;
  transform: translateY(-2px);
}

.btn-secondary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.loading-state {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.spinner {
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #ffffff;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.security-note {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  padding: 1rem;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border: 1px solid #bae6fd;
  border-radius: 10px;
  margin-top: 1rem;
}

.note-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.security-note strong {
  display: block;
  color: #0369a1;
  margin-bottom: 0.25rem;
}

.security-note p {
  margin: 0;
  color: #0c4a6e;
  font-size: 0.9rem;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #eef6fb 0%, #e0eef8 100%);
}

.spinner-large {
  width: 50px;
  height: 50px;
  border: 3px solid rgba(29, 78, 216, 0.2);
  border-top-color: #1d4ed8;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 1rem;
}

.loading-container p {
  color: #667085;
  font-weight: 500;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
  }

  .form-card {
    padding: 1.5rem;
  }

  .form-actions {
    flex-direction: column-reverse;
  }

  .btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
