<script setup>
import { useTournamentStore } from "../store/tournamentStore";

const tournamentStore = useTournamentStore();

const props = defineProps({
  currentLevel: Object,
  countdown: Number,
  formatTime: Function,
  isBreakTime: Boolean
});
</script>

<template>
  <div class="container" v-if="currentLevel">
    <div class="container-timer">
      <span>{{ formatTime(countdown) }}</span>
    </div>
    
    <div class="blind-container">
      <div class="blind-item">
        <h3>SM</h3>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
        </svg>
        <span>{{ currentLevel.smallBlind }}</span>
      </div>
      
      <div class="blind-item">
        <h3>BB</h3>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
        </svg>
        <span>{{ currentLevel.bigBlind }}</span>
      </div>
      
      <div class="blind-item">
        <h3>Ante</h3>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
        </svg>
        <span>{{ currentLevel.ante }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: auto;
  color: white;
  margin: 20px auto;
}

.container-timer {
  text-align: center;
  width: 100%;
  margin-bottom: 20px;
}

.container-timer > span {
  font-size: 240px;
  letter-spacing: 4px;
  font-weight: bold;
  width: 100%;
}

@media screen and (max-width:424px){
  .container-timer > span{
    font-size: 140px;
  }
}

.blind-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin: 20px auto;
}

.blind-item {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 33%;
}

.blind-item > h3 {
  border-bottom: 1px dashed #27272a;
  font-family: 'Montserrat', sans-serif;
  font-weight: 600;
  font-size: 16px;
  letter-spacing: 2px;
  color:#71717a;
  padding-bottom: 2px;
  margin-bottom: 8px;
}

.blind-item > svg {
  width: 16px;
  margin: 4px 0;
  color:#52525b;
}

.blind-item > span {
  color: #f4f4f5;
  font-size: 32px;
  margin: 4px 0px;
}
</style>