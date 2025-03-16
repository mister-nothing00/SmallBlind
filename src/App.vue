<script setup>
import Navbar from "./components/Navbar.vue";

</script>

<template>
  <!--View Page-->
  <header>
    <Navbar/>
  </header>
  <main>
    <router-view />
    
  </main>


</template>
