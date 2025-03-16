<script setup>
import { ref, toRaw, watch } from 'vue';
import { useTournamentStore } from '../store/tournamentStore';
import { v4 as uuidv4 } from "uuid";
import { useToast } from 'vue-toast-notification';
import { useRouter } from 'vue-router';

// Store
const tournamentStore = useTournamentStore();
const toast = useToast();
const router = useRouter();


// Variables
const tournamentName = ref("");
const numberPlayers = ref(null)
const buyIn = ref(null);
const stackInitial = ref(null);
const hasReBuy = ref(false);
const reBuyCosto = ref(null);
const reBuyStack = ref(null);
const hasAddOn = ref(false);
const addOnCosto = ref(null);
const addOnStack = ref(null);

watch([tournamentName, buyIn, numberPlayers, stackInitial, hasReBuy, reBuyCosto, reBuyStack, hasAddOn, addOnCosto, addOnStack], () => {
    tournamentStore.setTournamentData({
        title: tournamentName.value,
        numberPlayers: numberPlayers.value,
        buyIn: buyIn.value,
        stackInitial: stackInitial.value,
        reBuy: {
            enabled: hasReBuy.value,
            costo: reBuyCosto.value,
            reBuyStack: reBuyStack.value,
        },
        addOn: {
            enabled: hasAddOn.value,
            costo: addOnCosto.value,
            addOnStack: addOnStack.value,
        },
    });
});

const updateReBuyEnabled = () => {
    tournamentStore.setTournamentData({
        reBuy: {
            enabled: hasReBuy.value,
            costo: reBuyCosto.value,
            reBuyStack: reBuyStack.value,
        },
    });
};


const updateAddOnEnabled = () => {
    tournamentStore.setTournamentData({
        addOn: {
            enabled: hasAddOn.value,
            costo: reBuyCosto.value,
            addOnStack: addOnStack.value,
        },
    });
};


const handleSubmit = () => {

    const newTournament = {
        id: uuidv4(),
        title: tournamentName.value,
        numberPlayers: numberPlayers.value,
        buyIn: buyIn.value,
        players: [],
        stackInitial: stackInitial.value,
        reBuy: {
            enabled: hasReBuy.value,
            costo: reBuyCosto.value,
            reBuyStack: reBuyStack.value,
        },
        addOn: {
            enabled: hasAddOn.value,
            costo: addOnCosto.value,
            addOnStack: addOnStack.value,
        },
    };

    tournamentStore.addTournament(newTournament);
    toast.success("Tournament created!", {
        position: "top-right",
        duration: 3000,
        dismissible: true,
    });
    router.push("/levels")

};


</script>


<template>
    <div class="container">
        <div class="header">
            <h2>Tournament</h2>
        </div>

        <div class="container-info">
            <!-- Data tourneament -->
            <div class="container-data">
                <h3>Tournament Data</h3>
                <div>
                    <div class="form-group">
                        <span>Title</span>
                        <p>{{ tournamentStore.tournamentData.title }}</p>
                    </div>
                    <div class="form-group">
                        <span>N. Starting Players</span>
                        <p>{{ tournamentStore.tournamentData.numberPlayers }}</p>
                    </div>
                    <div class="form-group">
                        <span>Buy-in (€)</span>
                        <p>{{ tournamentStore.tournamentData.buyIn }}</p>
                    </div>
                    <div class="form-group">
                        <span>Initial Stack</span>
                        <p>{{ tournamentStore.tournamentData.stackInitial }}</p>
                    </div>

                    <!-- Re-buy -->
                    <div class="form-group">
                        <span>Rebuy</span>
                        <p>{{ tournamentStore.tournamentData.reBuy.enabled ? 'Enabled' : 'Disabled' }}</p>
                    </div>
                    <div class="form-group" v-if="tournamentStore.tournamentData.reBuy.enabled">
                        <span>Cost ($)</span>
                        <p>{{ tournamentStore.tournamentData.reBuy.costo }}</p>
                    </div>
                    <div class="form-group" v-if="tournamentStore.tournamentData.reBuy.enabled">
                        <span>Rebuy Stack</span>
                        <p>{{ tournamentStore.tournamentData.reBuy.reBuyStack }}</p>
                    </div>

                    <!-- Add-on -->
                    <div class="form-group">
                        <span>Add-on</span>
                        <p>{{ tournamentStore.tournamentData.addOn.enabled ? 'Enabled' : 'Disabled' }}</p>
                    </div>
                    <div class="form-group" v-if="tournamentStore.tournamentData.addOn.enabled">
                        <span>Cost ($)</span>
                        <p>{{ tournamentStore.tournamentData.addOn.costo }}</p>
                    </div>
                    <div class="form-group" v-if="tournamentStore.tournamentData.addOn.enabled">
                        <span>Add-on Stack</span>
                        <p>{{ tournamentStore.tournamentData.addOn.addOnStack }}</p>
                    </div>
                </div>
            </div>


            <div class="container-set">
                <!--Set data for tourneament-->
                <form @submit.prevent="handleSubmit">
                    <div class="form-group">
                        <label for="tournamentName">Title</label>
                        <input id="tournamentName" v-model="tournamentName" type="text" required />
                    </div>
                    <div class="form-group">
                        <label for="players">N. Starting Players</label>
                        <input id="players" v-model.number="numberPlayers" type="number" required min="1" />
                    </div>
                    <div class="form-group">
                        <label for="buyIn">Buy-in (€)</label>
                        <input id="buyIn" v-model.number="buyIn" type="number" required />
                    </div>
                    <div class="form-group">
                        <label for="stackInitial">Initial Stack</label>
                        <input id="stackInitial" v-model.number="stackInitial" type="number" required />
                    </div>

                    <!-- Checkbox per Rebuy -->
                    <div class="form-group">
                        <label for="reBuy">Re-buy</label>
                        <input id="reBuyCheckbox" v-model="hasReBuy" type="checkbox" @change="updateReBuyEnabled" />
                    </div>
                    <div class="form-group" v-show="hasReBuy">
                        <label for="reBuyCosto">Cost ($)</label>
                        <input id="reBuyCosto" v-model.number="reBuyCosto" type="number" min="0" />
                    </div>
                    <div class="form-group" v-show="hasReBuy">
                        <label for="reBuyStack">Stack Rebuy</label>
                        <input id="reBuyStack" v-model.number="reBuyStack" type="number" min="0" />
                    </div>

                    <!-- Checkbox per Add-on -->
                    <div class="form-group">
                        <label for="addOn">Add-on</label>
                        <input id="addOnCheckbox" v-model="hasAddOn" type="checkbox" @change="updateAddOnEnabled" />
                    </div>
                    <div class="form-group" v-show="hasAddOn">
                        <label for="addOnCosto">Cost ($)</label>
                        <input id="addOnCosto" v-model.number="addOnCosto" type="number" />
                    </div>
                    <div class="form-group" v-show="hasAddOn">
                        <label for="addOnStack">Stack Add-on</label>
                        <input id="addOnStack" v-model.number="addOnStack" type="number" />
                    </div>

                    <button type="submit">Create Tournament</button>
                </form>
            </div>
        </div>
    </div>
</template>


<style scoped>
.container {
    border: 0.5px solid #A52A2A;
    border-radius: 8px;
    display: block;
    padding: 16px;
    width: 100%;

}


.header h2 {
    font-size: 40px;
    text-align: center;
    letter-spacing: 2px;
    width: 100%;
}

.container-info {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 24px 8px;
    width: 100%;
}


/*Visualizzazione dati torneo in container-data* */


.container-data {

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    gap: 12px 0;
    width: 40%;
    padding: 16px;
    background: transparent;
    border-radius: 8px;
}

.container-data>h3 {
    color: #e0c749;
    font-size: 24px;
    font-weight: 500;
    letter-spacing: 2px;

}

.container-data>div>.form-group>span,
label {
    font-weight: 600;
    font-size: small;
    color: #fafafa;
}

.container-data>div>.form-group>p {
    font-size: smaller;
    font-weight: 400;
    color: #a1a1aa;
}


/* Form impostazioni torneo */
.container-set {
    background: #1B1C20;
    border-radius: 4px;
    box-shadow: rgba(255, 255, 255, 0.2) 4px 4px 8px;
    display: flex;
    flex-direction: column;
    margin-top: 32px;
    width: 60%;
    padding: 16px;
}

/* Stile per label e input */
.form-group {
    display: grid;
    grid-template-columns: 100px 1fr;
    align-items: center;
    gap: 12px;
    margin-bottom: 12px;
}


input {
    border: 1px solid #fafafa;
    border-radius: 4px;
    background-color: transparent;
    width: 100%;
    padding: 8px;
    color: #a1a1aa;

}

/* Stile bottoni */
form>button {
    background: #E63946;
    border-radius: 5px;
    border: none;
    color: #121212;
    display: flex;
    justify-self: flex-start;
    font-size: small;
    font-weight: 700;
    text-align: center;
    padding: 8px 12px;
    cursor: pointer;
    margin: 24px 0px 16px 0px;
}

button:hover {
    background: #B22222;
    font-weight: 700;
}

@media screen and (max-width:425px) {
    .container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100%;
        margin: auto;
    }

    .container-data {
        display: none;
    }

    .container-set {
        width: 100%;
    }
}
</style>