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
        errorMessage.value = 'Failed to connect to the server. Is the backend running?';
        console.error(error);
    } finally {
        isLoading.value = false;
    }
};
</script>

<template>
  <div class="login-shell">
    <div class="login-box">
      <div class="login-hero">
        <p class="eyebrow">Employee portal</p>
        <h1>Sign in to manage your team</h1>
        <p class="hero-copy">Keep employee records, edit access, and monitor status from one simple dashboard.</p>
      </div>

      <div class="login-panel">
        <div class="panel-header">
          <div>
            <p class="eyebrow">Welcome back</p>
            <h2>Admin login</h2>
          </div>
        </div>

        <div v-if="errorMessage" class="error-banner">{{ errorMessage }}</div>

        <form class="login-form" @submit.prevent="handleLogin">
          <label>
            Username
            <input type="text" v-model="username" placeholder="admin" required />
          </label>

          <label>
            Password
            <input type="password" v-model="password" placeholder="••••••••" required />
          </label>

          <button type="submit" class="submit-button" :disabled="isLoading">
            {{ isLoading ? 'Signing in...' : 'Sign in' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

.login-shell {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 2rem;
  background: radial-gradient(circle at top left, rgba(37, 99, 235, 0.18), transparent 28%),
              radial-gradient(circle at bottom right, rgba(59, 130, 246, 0.14), transparent 32%),
              #f8fbff;
  color: #0f172a;
  font-family: 'Inter', sans-serif;
}

.login-box {
  width: min(980px, 100%);
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  background: #ffffff;
  border-radius: 32px;
  padding: 2.5rem;
  box-shadow: 0 35px 90px rgba(15, 23, 42, 0.12);
}

.login-hero {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1.25rem;
}

.login-hero .eyebrow,
.panel-header .eyebrow {
  margin: 0;
  color: #475569;
  font-size: 0.82rem;
  text-transform: uppercase;
  letter-spacing: 0.18em;
}

.login-hero h1 {
  margin: 0;
  font-size: clamp(2.4rem, 2.8vw, 3rem);
  line-height: 1.05;
  font-weight: 700;
}

.hero-copy {
  margin: 0;
  color: #475569;
  max-width: 38rem;
  font-size: 1rem;
  line-height: 1.8;
}

.login-panel {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 2rem;
  background: #f8fafc;
  border-radius: 28px;
  border: 1px solid #e2e8f0;
}

.panel-header {
  margin-bottom: 1.5rem;
}

.panel-header h2 {
  margin: 0.35rem 0 0;
  font-size: 1.75rem;
  font-weight: 700;
}

.error-banner {
  margin-bottom: 1.25rem;
  padding: 1rem 1.15rem;
  border-radius: 18px;
  background: #fde8ea;
  color: #b91c1c;
  font-size: 0.95rem;
}

.login-form {
  display: grid;
  gap: 1.25rem;
}

.login-form label {
  display: grid;
  gap: 0.5rem;
  color: #334155;
  font-size: 0.95rem;
}

.login-form input {
  width: 100%;
  padding: 1rem 1.1rem;
  border-radius: 18px;
  border: 1px solid #d1d5db;
  background: #ffffff;
  color: #0f172a;
  font-size: 0.97rem;
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.login-form input:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.12);
}

.submit-button {
  width: 100%;
  border: none;
  border-radius: 18px;
  padding: 1rem 1.1rem;
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  color: #ffffff;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.submit-button:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 18px 30px rgba(37, 99, 235, 0.18);
}

.submit-button:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

@media (max-width: 900px) {
  .login-box {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .login-box {
    padding: 1.5rem;
  }

  .login-shell {
    padding: 1rem;
  }

  .login-panel {
    padding: 1.5rem;
  }
}
</style>