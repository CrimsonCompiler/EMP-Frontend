<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const handleLogout = () => {
    // ১. টোকেন মুছে ফেলা
    localStorage.removeItem('employee_token');
    
    // ২. লগিন পেইজে পাঠিয়ে দেওয়া
    router.push('/login');
};
</script>

<template>
  <div class="container mt-5 text-center">
    <h2 class="fw-bold mb-4">Welcome to the Secure Dashboard!</h2>
    <div class="alert alert-success d-inline-block px-5">
      Authentication Successful. You have a valid JWT token.
    </div>
    
    <div class="mt-4">
      <button class="btn btn-danger px-4 py-2 fw-bold" @click="handleLogout">
        LOGOUT
      </button>
    </div>
  </div>
</template>