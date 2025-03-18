<script setup>
import { useTournamentStore } from "../store/tournamentStore";
import { ref, toRaw, nextTick, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "vue-toast-notification";

const tournamentStore = useTournamentStore();
const toast = useToast();
const router = useRouter();

const levels = ref([]);
const isMobile = ref(window.innerWidth <= 768);

// Aggiorna lo stato mobile quando la finestra viene ridimensionata a 768px
const updateWindowSize = () => {
  isMobile.value = window.innerWidth <= 768;
};

onMounted(() => {
  // Controlla se ci sono livelli già esistenti nello store
  if (tournamentStore.tournamentData.levels && tournamentStore.tournamentData.levels.length > 0) {
    levels.value = JSON.parse(JSON.stringify(tournamentStore.tournamentData.levels));
  }
  
  // Aggiungi event listener per il resize
  window.addEventListener('resize', updateWindowSize);
});

const addLevel = () => {
    const nextLevelId = levels.value.length + 1;
    const newLevel = {
        id: nextLevelId,
        smallBlind: null,
        bigBlind: null,
        ante: null,
        duration: null,
        breakTime: null,
    };
    levels.value.push(newLevel);
    tournamentStore.addLevelToTournament(newLevel);
    
   
    toast.success("Level added!", {
        position: "bottom-right",
        duration: 1500,
        dismissible: true,
    });
};

const deleteLevel = (levelId) => {
    if (confirm("Are you sure you want to delete this level?")) {
        levels.value = levels.value.filter(l => l.id !== levelId);
        tournamentStore.deleteLevelFromTournament(levelId);
    }
};

const saveLevels = () => {
    // Validazione: controlla che tutti i campi necessari siano compilati
    let hasEmptyFields = false;
    
    for (const level of levels.value) {
        if (!level.smallBlind || !level.bigBlind || !level.duration) {
            hasEmptyFields = true;
            break;
        }
    }
    
    if (hasEmptyFields) {
        toast.error("Please fill in all required fields (Small Blind, Big Blind, Duration)", {
            position: "bottom-right",
            duration: 3000,
            dismissible: true,
        });
        return;
    }
    
    tournamentStore.setLevels(JSON.parse(JSON.stringify(levels.value)));

    nextTick(() => {
        console.log(
            "Livelli nello store:",
            JSON.parse(JSON.stringify(toRaw(tournamentStore.tournamentData.levels)))
        );
    });
    
    router.push("/players");
    toast.success("Levels saved!", {
        position: "bottom-right",
        duration: 3000,
        dismissible: true,
    });
};
</script>

<template>
    <div class="container">
        <div class="header-levels">
            <h2>Level Structure</h2>
        </div>
        
        <form @submit.prevent="saveLevels">
            <!-- Vista Desktop -->
            <table v-if="!isMobile" class="levels-table">
                <thead>
                    <tr>
                        <th>Level</th>
                        <th>Small Blind</th>
                        <th>Big Blind</th>
                        <th>Ante</th>
                        <th>Duration (min)</th>
                        <th>Break (min)</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(level, index) in levels" :key="level.id">
                        <td>{{ index + 1 }}</td>
                        <td><input type="number" v-model.number="level.smallBlind" required /></td>
                        <td><input type="number" v-model.number="level.bigBlind" required /></td>
                        <td><input type="number" v-model.number="level.ante" /></td>
                        <td><input type="number" v-model.number="level.duration" required /></td>
                        <td><input type="number" v-model.number="level.breakTime" /></td>
                        <td>
                            <button type="button" @click="deleteLevel(level.id)" class="delete-level">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                    stroke-width="1.5" stroke="currentColor" class="size-6">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                </svg>
                                Elimina
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
            
            <!-- Vista Mobile - Card Layout -->
            <div v-else class="mobile-levels">
                <div v-for="(level, index) in levels" :key="level.id" class="level-card">
                    <div class="level-header">
                        <h3>Level {{ index + 1 }}</h3>
                        <button type="button" @click="deleteLevel(level.id)" class="delete-mobile">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                stroke-width="1.5" stroke="currentColor" class="size-6">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                            </svg>
                        </button>
                    </div>
                    
                    <div class="field-group">
                        <label>Small Blind</label>
                        <input type="number" v-model.number="level.smallBlind" required />
                    </div>
                    
                    <div class="field-group">
                        <label>Big Blind</label>
                        <input type="number" v-model.number="level.bigBlind" required />
                    </div>
                    
                    <div class="field-group">
                        <label>Ante</label>
                        <input type="number" v-model.number="level.ante" />
                    </div>
                    
                    <div class="field-group">
                        <label>Duration (min)</label>
                        <input type="number" v-model.number="level.duration" required />
                    </div>
                    
                    <div class="field-group">
                        <label>Break (min)</label>
                        <input type="number" v-model.number="level.breakTime" />
                    </div>
                </div>
            </div>

            <div class="levels-action">
                <button type="button" @click="addLevel" class="add-level">Add Level</button>
                <button type="submit" class="save-levels">Save Levels</button>
            </div>
        </form>

    </div>
</template>

<style scoped>
.container {
    display: block;
    width: 100%;
}

.header-levels {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
}

.header-levels > h2 {
    font-size: 40px;
    font-weight: 500;
    letter-spacing: 2px;
    color: #C9B037;
}

/* Stili della tabella per desktop */
table {
    width: 100%;
    margin-top: 20px;
    border-collapse: collapse;
}

th {
    background-color: #333;
    color: #fff;
}

th,
td,
tbody {
    color: #f4f4f5;
    border: 1px solid #444;
    padding: 10px;
    text-align: center;
}

.delete-level {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #B22222;
    border: none;
    border-radius: 16px;
    font-size: small;
    font-weight: 600;
    padding: 4px 8px;
    width: 100%;
}

.delete-level:hover {
    background-color: #A52A2A;
    transform: scale(0.9);
    transition: all 0.4s ease;
}

.delete-level > svg {
    width: 18px;
}

.levels-table input[type="number"] {
    border-radius: 2px;
    border: none;
    border-bottom: 0.5px solid #3A3A3A;
    background-color: transparent;
    color: #a1a1aa;
    width: 100%;
    padding: 4px 8px;
}

/* Layout Card per Mobile */
.mobile-levels {
    display: flex;
    flex-direction: column;
    gap: 20px;
    width: 100%;
    margin-top: 20px;
}

.level-card {
    background-color: rgba(51, 51, 51, 0.6);
    border-radius: 8px;
    padding: 15px;
    border: 1px solid #444;
}

.level-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    border-bottom: 1px solid #444;
    padding-bottom: 8px;
}

.level-header h3 {
    font-size: 18px;
    color: #C9B037;
    margin: 0;
}

.delete-mobile {
    background-color: #B22222;
    border: none;
    border-radius: 50%;
    width: 36px;
    height: 36px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0;
}

.delete-mobile svg {
    width: 20px;
    color: white;
}

.field-group {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
}

.field-group label {
    flex: 1;
    color: #f4f4f5;
    font-size: 14px;
}

.field-group input {
    flex: 1;
    border-radius: 4px;
    border: 1px solid #3A3A3A;
    background-color: transparent;
    color: #a1a1aa;
    padding: 8px;
}

/* Pulsanti di azione */
.levels-action {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 32px;
    width: 100%;
    margin: 24px auto;
}

.add-level {
    border: none;
    border-radius: 24px;
    background-color: #4ade80;
    color: black;
    padding: 6px 12px;
}

.add-level:hover {
    background-color: #22c55e;
    transform: scale(0.9);
    transition: all 0.4s ease;
}

.save-levels {
    border: none;
    border-radius: 24px;
    background-color: #eab308;
    color: #121212;
    padding: 6px 12px;
}

.save-levels:hover {
    background-color: #facc15;
    transform: scale(0.9);
    transition: all 0.4s ease;
}

/* Responsive per dimensioni intermedie */
@media screen and (max-width: 1024px) {
    .header-levels > h2 {
        font-size: 32px;
    }
    
    th, td {
        padding: 8px 5px;
        font-size: 14px;
    }
    
    .levels-action {
        gap: 16px;
    }
}

/* Responsive per tablet */
@media screen and (max-width: 768px) {
    .header-levels > h2 {
        font-size: 28px;
    }
    
    .levels-action {
        flex-direction: column;
        gap: 12px;
    }
    
    .add-level, .save-levels {
        width: 80%;
        padding: 10px;
    }
}

/* Responsive per mobile piccoli */
@media screen and (max-width: 425px) {
    .header-levels > h2 {
        font-size: 24px;
    }
    
    .field-group {
        flex-direction: column;
        align-items: flex-start;
    }
    
    .field-group label {
        margin-bottom: 4px;
    }
    
    .field-group input {
        width: 100%;
    }
}
</style>