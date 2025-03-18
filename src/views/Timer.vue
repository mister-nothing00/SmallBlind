<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from "vue";
import { useTournamentStore } from "../store/tournamentStore";
import { useRouter } from "vue-router";
import { useToast } from "vue-toast-notification";

//Components
import ProgressOne from "../components/ProgressOne.vue";
import ProgressTwo from "../components/ProgressTwo.vue";
import State from "../components/State.vue";
import Statistics from "../components/Statistics.vue";

// Responsive state
const isMobile = ref(window.innerWidth <= 768);
const isTablet = ref(window.innerWidth > 768 && window.innerWidth <= 1024);

//Store
const tournamentStore = useTournamentStore();
const router = useRouter();
const toast = useToast();
const levels = ref(tournamentStore.tournamentData.levels || []);

// Formatta i secondi in formato mm:ss
const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

// Computed per ottenere il livello corrente
const currentLevel = computed(() => {
    if (levels.value.length === 0) return null;
    return levels.value[tournamentStore.timerState.currentLevelIndex];
});

// Computed per il titolo del timer
const timerTitle = computed(() => {
    return tournamentStore.timerState.isBreakTime ? "Break Time" : "Level Time";
});

// Aggiorna lo stato responsive quando la finestra viene ridimensionata
const updateWindowSize = () => {
    isMobile.value = window.innerWidth <= 768;
    isTablet.value = window.innerWidth > 768 && window.innerWidth <= 1024;
};

onMounted(() => {

    tournamentStore.initializeTimer();


    window.addEventListener('resize', updateWindowSize);
});

// Cleanup all'unmount
onBeforeUnmount(() => {


    window.removeEventListener('resize', updateWindowSize);
});

// Funzione per avviare il timer
const startTimer = () => {
    tournamentStore.startTimer();
};

// Funzione per mettere in pausa il timer
const pauseTimer = () => {
    tournamentStore.pauseTimer();
};

// Funzione per fermare il timer
const stopTimer = () => {
    tournamentStore.stopTimer();
};

// Gestisce cosa succede quando si preme il pulsante "Next"
const handleTimerEnd = () => {
    tournamentStore.handleTimerEnd(toast, router);
};

const deleteTournament = () => {
    if (confirm("Are you sure you want to delete this tournament?")) {
        tournamentStore.stopTimer();
        tournamentStore.resetTimerState();
        tournamentStore.resetTournamentData();
        router.push('/');
    }
};
</script>

<template>
    <div class="timer-container">
        <hr />
        <ProgressOne :currentLevel="currentLevel" :totalTime="tournamentStore.timerState.totalTime"
            :isBreakTime="tournamentStore.timerState.isBreakTime" />
        <ProgressTwo :currentLevel="currentLevel" :countdown="tournamentStore.timerState.countdown"
            :formatTime="formatTime" :isBreakTime="tournamentStore.timerState.isBreakTime" />

        <div class="timer-info" v-if="tournamentStore.timerState.isBreakTime">
            <div class="break-indicator">BREAK TIME</div>
        </div>

        <div class="button-action">
            <button type="button" @click="startTimer"
                :disabled="tournamentStore.timerState.isRunning && !tournamentStore.timerState.isPaused"
                class="btn-start">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                    stroke="currentColor" class="btn-icon">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
                </svg>
                Start
            </button>
            <button type="button" @click="pauseTimer"
                :disabled="!tournamentStore.timerState.isRunning || tournamentStore.timerState.isPaused"
                class="btn-pause">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                    stroke="currentColor" class="btn-icon">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
                </svg>
                Pause
            </button>
            <button type="button" @click="handleTimerEnd" class="btn-next">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                    stroke="currentColor" class="btn-icon">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="M3 8.689c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 0 1 0 1.954l-7.108 4.061A1.125 1.125 0 0 1 3 16.811V8.69ZM12.75 8.689c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 0 1 0 1.954l-7.108 4.061a1.125 1.125 0 0 1-1.683-.977V8.69Z" />
                </svg>
                Next
            </button>
            <button type="button" @click="deleteTournament" class="btn-delete">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                    stroke="currentColor" class="btn-icon">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
                Delete
            </button>
        </div>
        <hr />

        <div class="container-statistic" :class="{ 'mobile': isMobile }">
            <State />
            <Statistics />
        </div>
    </div>
</template>

<style lang="css" scoped>
.timer-container {
    width: 100%;
}

hr {
    color: #18181b;
    opacity: 0.1;
    margin: 0px;
}

.button-action {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 24px;
    width: 60%;
    margin: 40px auto;
}

.button-action>button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    border: 1px solid #fafafa;
    background-color: #1C1C1C;
    border-radius: 8px;
    font-size: medium;
    color: #fafafa;
    padding: 8px 16px;
    width: 120px;
    transition: all 0.3s ease;
}

.btn-icon {
    width: 20px;
    height: 20px;
}

.btn-start {
    border-color: #4ade80;
    color: #4ade80;
}

.btn-start:hover:not(:disabled) {
    background-color: #4ade80;
    color: #1C1C1C;
}

.btn-pause {
    border-color: #facc15;
    color: #facc15;
}

.btn-pause:hover:not(:disabled) {
    background-color: #facc15;
    color: #1C1C1C;
}

.btn-next {
    border-color: #3b82f6;
    color: #3b82f6;
}

.btn-next:hover:not(:disabled) {
    background-color: #3b82f6;
    color: #1C1C1C;
}

.btn-delete {
    border-color: #ef4444;
    color: #ef4444;
}

.btn-delete:hover:not(:disabled) {
    background-color: #ef4444;
    color: #1C1C1C;
}

.button-action>button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    color: #71717a;
    border-color: #71717a;
}

.timer-info {
    display: flex;
    justify-content: center;
    margin-top: 20px;
}

.break-indicator {
    background-color: #2563eb;
    color: white;
    padding: 8px 16px;
    border-radius: 4px;
    font-weight: bold;
    letter-spacing: 1px;
    animation: pulse 2s infinite;
}

@keyframes pulse {
    0% {
        opacity: 1;
    }

    50% {
        opacity: 0.6;
    }

    100% {
        opacity: 1;
    }
}

.container-statistic {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: stretch;
    gap: 40px;
    width: 100%;
    margin-top: 30px;
}

/* Tablet Responsive */
@media screen and (max-width: 1024px) {
    .button-action {
        width: 80%;
        gap: 16px;
    }

    .button-action>button {
        width: auto;
        flex: 1;
        font-size: 14px;
    }

    .container-statistic {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        gap: 20px;
        width: 100%;
    }
}

/* Mobile Responsive */
@media screen and (max-width: 768px) {
    .button-action {
        width: 100%;
        flex-wrap: wrap;
        gap: 12px;
    }

    .button-action>button {
        flex-basis: calc(50% - 12px);
        padding: 10px;
    }

    .container-statistic.mobile {
        flex-direction: column;
        gap: 30px;
    }

    .container-statistic.mobile>* {
        width: 100% !important;
    }
}

/* Small Mobile Responsive */
@media screen and (max-width: 425px) {
    .button-action {
        margin: 20px auto;
    }

    .button-action>button {
        font-size: 12px;
        padding: 8px;
    }

    .btn-icon {
        width: 16px;
        height: 16px;
    }
}
</style>