<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useTournamentStore } from "../store/tournamentStore";
import { Chart, registerables } from 'chart.js';

// Registra i componenti necessari di Chart.js
Chart.register(...registerables);

const tournamentStore = useTournamentStore();
const stackChartRef = ref(null);
const stackChart = ref(null);

// Computed per accedere facilmente ai dati
const players = computed(() => tournamentStore.tournamentData.players || []);
const tournamentData = computed(() => tournamentStore.tournamentData);

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

// Crea e aggiorna il grafico quando i dati cambiano
const updateStackChart = () => {
    // Se il grafico esiste già, distruggilo prima di ricreare
    if (stackChart.value) {
        stackChart.value.destroy();
    }

    // Prepara i dati ordinati per stack decrescente
    const sortedPlayers = [...players.value]
        .sort((a, b) => (b.stack || 0) - (a.stack || 0))
        .map(player => ({
            name: player.nome ? `${player.nome.charAt(0)}. ${player.cognome}` : `Player ${player.id}`,
            stack: player.stack || 0
        }));

    // Crea il nuovo grafico solo se l'elemento canvas esiste
    if (stackChartRef.value) {
        const ctx = stackChartRef.value.getContext('2d');
        stackChart.value = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: sortedPlayers.map(player => player.name),
                datasets: [{
                    label: 'Player Stack',
                    data: sortedPlayers.map(player => player.stack),
                    backgroundColor: '#4ade80',
                    borderColor: '#22c55e',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: '#a1a1aa'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: '#a1a1aa',
                            maxRotation: 45,
                            minRotation: 45
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#fff',
                        bodyColor: '#fff',
                        callbacks: {
                            label: function (context) {
                                return `Stack: ${formatNumber(context.parsed.y)}`;
                            }
                        }
                    }
                }
            }
        });
    }
};

// Osserva i cambiamenti nei giocatori e aggiorna il grafico
watch(players, () => {
    updateStackChart();
}, { deep: true });

// Inizializza il grafico all'avvio
onMounted(() => {
    updateStackChart();
});
</script>

<template>
    <div class="container-statistics">
        <h4 class="section-title">Statistics</h4>

        <div class="chart-container">
            <canvas ref="stackChartRef" height="200"></canvas>
        </div>

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

.chart-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 200px;
    margin-bottom: 16px;
    position: relative;
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