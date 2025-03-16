<script setup>
import { ref, nextTick, toRaw, onMounted } from 'vue';
import { useTournamentStore } from '../store/tournamentStore';
import { useToast } from "vue-toast-notification";
import { useRouter } from 'vue-router';

const tournamentStore = useTournamentStore();
const toast = useToast();
const router = useRouter();
const players = ref([]);
const isMobile = ref(window.innerWidth <= 768);

const nome = ref("");
const cognome = ref("");
const stackInitial = ref(tournamentStore.tournamentData.stackInitial);
const buyIn = ref(tournamentStore.tournamentData.buyIn);

// Aggiorna lo stato mobile quando la finestra viene ridimensionata
const updateWindowSize = () => {
  isMobile.value = window.innerWidth <= 768;
};

onMounted(() => {
  // Controlla se ci sono giocatori già esistenti nello store
  if (tournamentStore.tournamentData.players && tournamentStore.tournamentData.players.length > 0) {
    players.value = JSON.parse(JSON.stringify(tournamentStore.tournamentData.players));
  }
  
  // Aggiungi event listener per il resize
  window.addEventListener('resize', updateWindowSize);
});

//aggiunta giocatore
const addPlayer = () => {
  const nextPlayerId = players.value.length + 1;
  const newPlayer = {
    id: nextPlayerId,
    nome: nome.value,
    cognome: cognome.value,
    stack: stackInitial.value,
    spesa: buyIn.value,
  };

  players.value.push(newPlayer);
  tournamentStore.addPlayer(newPlayer);
  
  // Reset dei campi input
  nome.value = "";
  cognome.value = "";
  
  // Notifica
  toast.success("Player added!", {
    position: "top-right",
    duration: 1500,
    dismissible: true,
  });
};

//aggiornamento dello stack e della spesa totale
const updatePlayerStack = (playerId, type) => {
  let updatedStack = stackInitial.value;
  let updatedSpesaTotale = buyIn.value;

  if (type === 'addOn' && tournamentStore.tournamentData.addOn.enabled) {
    updatedStack += tournamentStore.tournamentData.addOn.addOnStack;
    updatedSpesaTotale += tournamentStore.tournamentData.addOn.costo;
    toast.success("Add-on calculation performed", {
      position: "top-right",
      duration: 3000,
      dismissible: true,
    });
  }
  else if (type === 'reBuy' && tournamentStore.tournamentData.reBuy.enabled) {
    updatedStack += tournamentStore.tournamentData.reBuy.reBuyStack;
    updatedSpesaTotale += tournamentStore.tournamentData.reBuy.costo;
    toast.success("Re-buy calculation performed", {
      position: "top-right",
      duration: 3000,
      dismissible: true,
    });
  }
  else if (type === 'reBuy&AddOn' && tournamentStore.tournamentData.reBuy.enabled && tournamentStore.tournamentData.addOn.enabled) {
    updatedStack += tournamentStore.tournamentData.reBuy.reBuyStack + tournamentStore.tournamentData.addOn.addOnStack;
    updatedSpesaTotale += (tournamentStore.tournamentData.reBuy.costo + tournamentStore.tournamentData.addOn.costo);
    toast.success("Add-on & Re-buy calculation performed", {
      position: "top-right",
      duration: 3000,
      dismissible: true,
    });
  }
  else {
    toast.error("Option not enabled in tournament settings", {
      position: "top-right",
      duration: 3000,
      dismissible: true,
    });
    return;
  }

  const player = players.value.find(p => p.id === playerId);
  if (player) {
    player.stack = updatedStack;
    player.spesa = updatedSpesaTotale;
  }
};

//eliminazione del singolo giocatore
const deletePlayer = (playerId) => {
  if (confirm("Are you sure you want to eliminate this player?")) {
    players.value = players.value.filter(player => player.id !== playerId);
    tournamentStore.deletePlayerFromTournament(playerId);
    toast.success("Player Removed!", {
      position: "top-right",
      duration: 3000,
      dismissible: true,
    });
  }
};

//salvataggio di tutti i giocatori
const savePlayers = () => {
  // Validazione: verifica che ci sia almeno un giocatore
  if (players.value.length === 0) {
    toast.error("Add at least one player to continue", {
      position: "bottom-right",
      duration: 3000,
      dismissible: true,
    });
    return;
  }
  
  tournamentStore.setPlayers(JSON.parse(JSON.stringify(players.value)));
  nextTick(() => {
    console.log("Giocatori nello store:", JSON.parse(JSON.stringify(toRaw(tournamentStore.tournamentData.players))));
  });
  
  router.push("/timer");
  toast.success("Players saved!", {
    position: "bottom-right",
    duration: 3000,
    dismissible: true,
  });
};
</script>

<template>
  <div class="container">
    <div class="header-players">
      <h2>Struttura giocatori</h2>
    </div>

    <!-- Form per aggiungere giocatore -->
    <div class="add-player-form">
      <h3>Aggiungi Giocatore</h3>
      <div class="form-row">
        <div class="form-group">
          <label>Nome</label>
          <input type="text" v-model="nome" placeholder="Nome" />
        </div>
        <div class="form-group">
          <label>Cognome</label>
          <input type="text" v-model="cognome" placeholder="Cognome" />
        </div>
        <button @click="addPlayer" class="add-button">Aggiungi</button>
      </div>
    </div>

    <!-- Vista Desktop -->
    <table v-if="!isMobile">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nome</th>
          <th>Cognome</th>
          <th>Stack</th>
          <th>Spesa</th>
          <th>Azioni</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(player, index) in players" :key="player.id">
          <td>{{ index + 1 }}</td>
          <td><input type="text" v-model="player.nome" placeholder="Nome" /></td>
          <td><input type="text" v-model="player.cognome" placeholder="Cognome" /></td>
          <td>{{ player.stack || stackInitial || 0 }}</td>
          <td>{{ player.spesa || buyIn || 0 }}</td>
          <td>
            <div class="actions-player">
              <button class="addOn" @click="updatePlayerStack(player.id, 'addOn')">Add-On</button>
              <button class="reBuy" @click="updatePlayerStack(player.id, 'reBuy')">Re-buy</button>
              <button class="reBuy-addOn" @click="updatePlayerStack(player.id, 'reBuy&AddOn')">Add-On & Re-Buy</button>
              <button class="delete" @click="deletePlayer(player.id)">Rimuovi</button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Vista Mobile -->
    <div v-else class="mobile-players">
      <div v-if="players.length === 0" class="no-players">
        <p>Nessun giocatore aggiunto. Aggiungi il primo giocatore usando il form sopra.</p>
      </div>
      
      <div v-else v-for="(player, index) in players" :key="player.id" class="player-card">
        <div class="player-header">
          <h3>Giocatore {{ index + 1 }}</h3>
          <button @click="deletePlayer(player.id)" class="delete-mobile">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
            </svg>
          </button>
        </div>
        
        <div class="player-info">
          <div class="field-group">
            <label>Nome</label>
            <input type="text" v-model="player.nome" placeholder="Nome" />
          </div>
          
          <div class="field-group">
            <label>Cognome</label>
            <input type="text" v-model="player.cognome" placeholder="Cognome" />
          </div>
          
          <div class="field-group readonly">
            <label>Stack</label>
            <span>{{ player.stack || stackInitial || 0 }}</span>
          </div>
          
          <div class="field-group readonly">
            <label>Spesa</label>
            <span>{{ player.spesa || buyIn || 0 }}</span>
          </div>
        </div>
        
        <div class="player-actions">
          <button class="addOn" @click="updatePlayerStack(player.id, 'addOn')">Add-On</button>
          <button class="reBuy" @click="updatePlayerStack(player.id, 'reBuy')">Re-buy</button>
          <button class="reBuy-addOn" @click="updatePlayerStack(player.id, 'reBuy&AddOn')">Add-On & Re-Buy</button>
        </div>
      </div>
    </div>

    <div class="action-container">
      <button @click="savePlayers" class="start-tournament">Start tournament / Continue</button>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: block;
  width: 100%;
}

.header-players {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.header-players>h2 {
  font-size: 40px;
  font-weight: 500;
  letter-spacing: 2px;
  color: #C9B037;
}

/* Form per aggiungere giocatore */
.add-player-form {
  background-color: rgba(51, 51, 51, 0.6);
  border-radius: 8px;
  padding: 15px;
  margin: 20px 0;
  border: 1px solid #444;
}

.add-player-form h3 {
  color: #4ade80;
  font-size: 18px;
  margin-bottom: 15px;
  border-bottom: 1px dashed rgba(255, 255, 255, 0.1);
  padding-bottom: 8px;
}

.form-row {
  display: flex;
  gap: 15px;
  align-items: flex-end;
}

.form-group {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.form-group label {
  color: #f4f4f5;
  font-size: 14px;
}

.form-group input {
  border-radius: 4px;
  border: 1px solid #3A3A3A;
  background-color: transparent;
  color: #a1a1aa;
  padding: 8px;
  width: 100%;
}

.add-button {
  background-color: #4ade80;
  color: #121212;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  font-weight: 600;
  cursor: pointer;
  align-self: flex-end;
}

.add-button:hover {
  background-color: #22c55e;
  transform: scale(0.95);
  transition: all 0.3s ease;
}

/* Tabella Desktop */
table {
  width: 100%;
  margin-top: 20px;
  border-collapse: collapse;
}

th {
  background-color: #333;
  color: #fff;
}

th, td, tbody {
  color: #f4f4f5;
  border: 1px solid #444;
  padding: 10px;
  text-align: center;
}

td>input {
  border-radius: 2px;
  border: none;
  border-bottom: 0.5px solid #3A3A3A;
  background-color: transparent;
  color: #a1a1aa;
  width: 100%;
  padding: 4px 8px;
}

.actions-player {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  width: 100%;
}

.actions-player>button {
  border: 0.5px solid #e4e4e7;
  border-radius: 2px;
  background-color: transparent;
  color: #32CD32;
  font-weight: 500;
  font-size: small;
  padding: 4px 8px;
  cursor: pointer;
}

.actions-player>button:hover {
  border: none;
  border-radius: 4px;
  background-color: #32CD32;
  font-weight: 600;
  color: #3A3A3A;
  transition: all 0.3s ease;
}

/* Layout Mobile */
.mobile-players {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 20px;
}

.no-players {
  background-color: rgba(51, 51, 51, 0.6);
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  color: #a1a1aa;
  border: 1px dashed #444;
}

.player-card {
  background-color: rgba(51, 51, 51, 0.6);
  border-radius: 8px;
  padding: 15px;
  border: 1px solid #444;
}

.player-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  border-bottom: 1px solid #444;
  padding-bottom: 8px;
}

.player-header h3 {
  font-size: 18px;
  color: #C9B037;
  margin: 0;
}

.delete-mobile {
  background-color: #E63946;
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
  cursor: pointer;
}

.delete-mobile svg {
  width: 20px;
  color: white;
}

.player-info {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 15px;
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.field-group label {
  color: #a1a1aa;
  font-size: 14px;
}

.field-group.readonly span {
  background-color: rgba(0, 0, 0, 0.2);
  border: 1px solid #3A3A3A;
  border-radius: 4px;
  padding: 8px;
  color: #f4f4f5;
}

.player-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
  margin-top: 15px;
  border-top: 1px dashed rgba(255, 255, 255, 0.1);
  padding-top: 12px;
}

.player-actions button {
  flex: 1;
  min-width: 100px;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #32CD32;
  background-color: transparent;
  color: #32CD32;
  font-weight: 500;
  cursor: pointer;
}

.player-actions button:hover {
  background-color: #32CD32;
  color: #121212;
  transform: scale(0.95);
  transition: all 0.3s ease;
}

.action-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  width: 100%;
  margin-top: 30px;
}

.start-tournament {
  border: none;
  border-radius: 24px;
  background-color: #eab308;
  color: #121212;
  font-weight: 600;
  font-size: 16px;
  padding: 10px 24px;
  cursor: pointer;
}

.start-tournament:hover {
  background-color: #facc15;
  transform: scale(0.95);
  transition: all 0.3s ease;
}

.delete {
  border: none !important;
  background-color: #E63946 !important;
  font-weight: 600 !important;
  color: #f4f4f5 !important;
}

.delete:hover {
  background-color: #c82333 !important;
  color: #f4f4f5 !important;
}

.reBuy-addOn {
  max-width: 130px;
}

/* Responsive */
@media screen and (max-width: 1024px) {
  .header-players > h2 {
    font-size: 32px;
  }
  
  .form-row {
    gap: 10px;
  }
  
  th, td {
    padding: 8px 5px;
    font-size: 14px;
  }
  
  .actions-player {
    gap: 5px;
  }
  
  .actions-player > button {
    font-size: 12px;
    padding: 3px 6px;
  }
}

@media screen and (max-width: 768px) {
  .header-players > h2 {
    font-size: 28px;
  }
  
  .form-row {
    flex-direction: column;
    gap: 15px;
  }
  
  .add-button {
    width: 100%;
  }
  
  .player-info {
    grid-template-columns: 1fr;
  }
  
  .player-actions {
    flex-direction: column;
  }
  
  .player-actions button {
    width: 100%;
  }
  
  .start-tournament {
    width: 100%;
    padding: 12px;
  }
}

@media screen and (max-width: 425px) {
  .header-players > h2 {
    font-size: 24px;
  }
  
  .add-player-form {
    padding: 10px;
  }
  
  .add-player-form h3 {
    font-size: 16px;
  }
  
  .player-card {
    padding: 10px;
  }
  
  .player-header h3 {
    font-size: 16px;
  }
}
</style>