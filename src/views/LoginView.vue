<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { apiFetch } from '../services/api';

const router = useRouter();
const username = ref('');
const password = ref('');
const errorMessage = ref('');
const isLoading = ref(false);

const handleLogin = async () => {
    isLoading.value = true;
    errorMessage.value = '';

    try {
       
        const response = await apiFetch('/auth/login', {
            method: 'POST',
            body: JSON.stringify({
                username: username.value,
                password: password.value
            })
        });

        if (response.ok) {
            const data = await response.json();
            
           
            localStorage.setItem('employee_token', data.token);
            
           
            router.push('/dashboard');
        } else {
            errorMessage.value = 'Invalid username or password!';
        }
    } catch (error) {
        errorMessage.value = 'Failed to connect to the server. Is the C# backend running?';
        console.error(error);
    } finally {
        isLoading.value = false;
    }
};
</script>

<template>
  <div class="d-flex justify-content-center align-items-center vh-100 bg-light">
    <div class="card shadow-sm p-4" style="width: 400px; border-radius: 12px;">
      <h3 class="text-center fw-bold mb-4">WORKFORCE PORTAL</h3>
      
      <div v-if="errorMessage" class="alert alert-danger py-2 text-center text-sm">
        {{ errorMessage }}
      </div>

      <form @submit.prevent="handleLogin">
        <div class="mb-3">
          <label class="form-label text-muted small fw-bold text-uppercase">Username</label>
          <input type="text" class="form-control" v-model="username" required placeholder="admin">
        </div>
        
        <div class="mb-4">
          <label class="form-label text-muted small fw-bold text-uppercase">Password</label>
          <input type="password" class="form-control" v-model="password" required placeholder="password123">
        </div>

        <button type="submit" class="btn btn-dark w-100 fw-bold py-2" :disabled="isLoading">
          {{ isLoading ? 'Authenticating...' : 'SECURE LOGIN' }}
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.vh-100 { min-height: 100vh; }
.text-sm { font-size: 0.85rem; }
</style>