<script setup>
import { computed } from 'vue';
import { useTournamentStore } from "../store/tournamentStore";

const tournamentStore = useTournamentStore();

const players = computed(() => tournamentStore.tournamentData.players || []);
const tournamentData = computed(() => tournamentStore.tournamentData);

// Calcoliamo il montepremi per le posizioni
const prizePool = computed(() => {
    const totalBuyIn = players.value.reduce((sum, player) => sum + (player.spesa || 0), 0);
    return totalBuyIn;
});

//calcolo dei  premi per i primi 3 classificati (50%, 30%, 20%)
const firstPrize = computed(() => Math.round(prizePool.value * 0.5));
const secondPrize = computed(() => Math.round(prizePool.value * 0.3));
const thirdPrize = computed(() => Math.round(prizePool.value * 0.2));

// Formatta valori monetari
const formatCurrency = (value) => {
    return value ? `€${value}` : '---';
};
</script>

<template>
    <div class="container-state">
        <h4 class="section-title">Status</h4>

        <div class="status-info">
            <div class="status-row">
                <h5>Players</h5>
                <span>{{ players.length }}/{{ tournamentData.numberPlayers || players.length }}</span>
            </div>

            <div class="player-status-info">
                <div class="status-row">
                    <h5>Active Players</h5>
                    <span>{{ players.length }}</span>
                </div>
                <div class="status-row">
                    <h5>Eliminated Players</h5>
                    <span>{{ Math.max(0, (tournamentData.numberPlayers || players.length) - players.length) }}</span>
                </div>
            </div>

            <div class="prize-info">
                <h5 class="prize-title">Prize Distribution</h5>
                <div class="prize-row">
                    <p>1° Place</p>
                    <p>{{ formatCurrency(firstPrize) }}</p>
                </div>
                <div class="prize-row">
                    <p>2° Place</p>
                    <p>{{ formatCurrency(secondPrize) }}</p>
                </div>
                <div class="prize-row">
                    <p>3° Place</p>
                    <p>{{ formatCurrency(thirdPrize) }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.container-state {
    display: flex;
    flex-direction: column;
    width: 50%;
    color: white;
    background-color: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
    padding: 16px;
}

.section-title {
    font-size: 24px;
    color: #C9B037;
    margin-bottom: 16px;
    text-align: center;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    padding-bottom: 8px;
}

.status-info {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.status-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.status-row h5 {
    font-size: 16px;
    margin: 0;
    color: #f4f4f5;
}

.status-row span {
    font-size: 16px;
    color: #4CAF50;
    font-weight: bold;
}

.player-status-info {
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 4px;
    padding: 10px;
    margin-top: 4px;
}

.prize-info {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-top: 8px;
}

.prize-title {
    font-size: 16px;
    color: #C9B037;
    margin: 0 0 8px 0;
    padding-bottom: 4px;
    border-bottom: 1px dashed rgba(255, 255, 255, 0.1);
}

.prize-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 4px 0;
}

.prize-row p:first-child {
    font-weight: bold;
    color: #f4f4f5;
    margin: 0;
}

.prize-row p:last-child {
    color: #C9B037;
    font-weight: bold;
    margin: 0;
}
</style>