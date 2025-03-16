<!--
Questo componente rigurda il controllo e il settaggio in maniera dinamica del 
break time, livello e durata trascorsa dall'inizio del torneo 
(che si calcolerà dopo il passaggio del primo livello)
-->

<script setup>
import { useTournamentStore } from "../store/tournamentStore";

const tournamentStore = useTournamentStore();

const props = defineProps({
    currentLevel: Object,
    totalTime: Number,
    isBreakTime: Boolean
});

// Formatta i secondi in formato mm:ss
const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};
</script>

<template>
    <div class="container" v-if="currentLevel">
        <div class="container-header">
            <h3>Time to Break</h3>
            <span>{{ currentLevel.breakTime || 0 }}</span>
        </div>
        
        <div class="container-header">
            <h3>Level</h3>
            <span>{{ currentLevel.id || 1 }}</span>
        </div>
        
        <div class="container-header">
            <h3>Total Time</h3>
            <span>{{ formatTime(totalTime) }}</span>
        </div>
    </div>
</template>

<style lang="css" scoped>
.container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 0 16px;
    width: 100%;
    height: 0;
    margin: 40px auto;
}

.container>div {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.container>div>h3 {
    border-bottom: 1px dashed #27272a;
    font-family: 'Montserrat', sans-serif;
    font-size: 16px;
    letter-spacing: 2px;
    color: #a1a1aa;
    padding-bottom: 2px;
}

.container>div>span {
    color: #f4f4f5;
    font-size: 24px;
    margin: 4px 0px;
    
}
</style>