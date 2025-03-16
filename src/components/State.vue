<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useTournamentStore } from "../store/tournamentStore";
import { Chart, registerables } from 'chart.js';

// Registra i componenti necessari di Chart.js
Chart.register(...registerables);

const tournamentStore = useTournamentStore();
const playerChartRef = ref(null);
const playerChart = ref(null);

// Computed per accedere facilmente ai dati
const players = computed(() => tournamentStore.tournamentData.players || []);
const tournamentData = computed(() => tournamentStore.tournamentData);

// Calcoliamo il montepremi per le posizioni
const prizePool = computed(() => {
    const totalBuyIn = players.value.reduce((sum, player) => sum + (player.spesa || 0), 0);
    return totalBuyIn;
});

// Calcoliamo i premi per i primi 3 classificati (50%, 30%, 20%)
const firstPrize = computed(() => Math.round(prizePool.value * 0.5));
const secondPrize = computed(() => Math.round(prizePool.value * 0.3));
const thirdPrize = computed(() => Math.round(prizePool.value * 0.2));

// Formatta valori monetari
const formatCurrency = (value) => {
    return value ? `€${value}` : '---';
};

// Crea e aggiorna il grafico quando i dati cambiano
const updatePlayerChart = () => {
    // Se il grafico esiste già, distruggilo prima di ricreare
    if (playerChart.value) {
        playerChart.value.destroy();
    }
    
    const totalPlayers = tournamentData.value.numberPlayers || players.value.length;
    const activePlayers = players.value.length;
    const eliminatedPlayers = Math.max(0, totalPlayers - activePlayers);
    
    // Crea il nuovo grafico solo se l'elemento canvas esiste
    if (playerChartRef.value) {
        const ctx = playerChartRef.value.getContext('2d');
        playerChart.value = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Active Players', 'Eliminated Players'],
                datasets: [{
                    data: [activePlayers, eliminatedPlayers],
                    backgroundColor: ['#4CAF50', '#F44336'],
                    borderColor: ['#388E3C', '#D32F2F'],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: '#f4f4f5',
                            font: {
                                size: 12
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#fff',
                        bodyColor: '#fff',
                        titleFont: {
                            size: 14
                        },
                        bodyFont: {
                            size: 14
                        },
                        padding: 10
                    }
                },
            }
        });
    }
};

// Osserva i cambiamenti nei giocatori e aggiorna il grafico
watch(players, () => {
    updatePlayerChart();
}, { deep: true });

// Inizializza il grafico all'avvio
onMounted(() => {
    updatePlayerChart();
});
</script>

<template>
    <div class="container-state">
        <h4 class="section-title">Status</h4>
        
        <div class="chart-container">
            <canvas ref="playerChartRef" height="180"></canvas>
        </div>
        
        <div class="status-info">
            <div class="status-row">
                <h5>Players</h5>
                <span>{{ players.length }}/{{ tournamentData.numberPlayers || players.length }}</span>
            </div>
            
            <div class="prize-info">
                <div class="prize-row">
                    <p>1°</p>
                    <p>{{ formatCurrency(firstPrize) }}</p>
                </div>
                <div class="prize-row">
                    <p>2°</p>
                    <p>{{ formatCurrency(secondPrize) }}</p>
                </div>
                <div class="prize-row">
                    <p>3°</p>
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

.chart-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 180px;
    margin-bottom: 16px;
    position: relative;
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

.prize-info {
    display: flex;
    flex-direction: column;
    gap: 8px;
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