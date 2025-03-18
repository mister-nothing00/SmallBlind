<script setup>
import { computed } from 'vue';
import { useTournamentStore } from "../store/tournamentStore";

const tournamentStore = useTournamentStore();

// Computed per accedere facilmente ai dati
const players = computed(() => tournamentStore.tournamentData.players || []);

// Calcolo dello stack medio
const avgStack = computed(() => {
    if (players.value.length === 0) return 0;
    const totalStack = players.value.reduce((sum, player) => sum + (player.stack || 0), 0);
    return Math.round(totalStack / players.value.length);
});

// Calcolo del totale di chips in gioco
const totalChips = computed(() => {
    return players.value.reduce((sum, player) => sum + (player.stack || 0), 0);
});

// Calcolo del montepremi totale
const totalPrize = computed(() => {
    return players.value.reduce((sum, player) => sum + (player.spesa || 0), 0);
});

// Formatta i numeri con separatore delle migliaia
const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
</script>

<template>
    <div class="container-statistics">
        <h4 class="section-title">Statistics</h4>

        <div class="stats-info">
            <div class="stats-row">
                <p>Avg stack</p>
                <p>{{ formatNumber(avgStack) }}</p>
            </div>
            <div class="stats-row">
                <p>Total chips</p>
                <p>{{ formatNumber(totalChips) }}</p>
            </div>
            <div class="stats-row">
                <p>Total prize</p>
                <p>€{{ formatNumber(totalPrize) }}</p>
            </div>
        </div>
    </div>
</template>

<style scoped>
.container-statistics {
    display: flex;
    flex-direction: column;
    width: 50%;
    color: white;
    background-color: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
    padding: 16px;
}

@media screen and (max-width:768px) {
    .container-statistics {
        width: 100%;
    }
}

.section-title {
    font-size: 24px;
    color: #4ade80;
    margin-bottom: 16px;
    text-align: center;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    padding-bottom: 8px;
}

.stats-info {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.stats-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 4px 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.stats-row p:first-child {
    font-weight: 500;
    color: #a1a1aa;
    margin: 0;
}

.stats-row p:last-child {
    color: #f4f4f5;
    font-weight: bold;
    margin: 0;
}
</style>
