import { defineStore } from "pinia";
import { v4 as uuidv4 } from "uuid";

export const useTournamentStore = defineStore("tournament", {
  state: () => ({
    tournaments: [],
    tournamentData: {
      id: null,
      title: "",
      numberPlayers: null,
      buyIn: null,
      stackInitial: null,
      players: [],
      reBuy: {
        enabled: false,
        costo: null,
        reBuyStack: null,
      },
      addOn: {
        enabled: false,
        costo: null,
        addOnStack: null,
      },
      levels: [],
    },
    timerState: {
      isRunning: false,
      isPaused: false,
      currentLevelIndex: 0,
      totalTime: 0,
      isBreakTime: false,
      countdown: 0,
      globalIntervalId: null,
      audioInitialized: false,
      levelChangeSound: null,
      breakStartSound: null,
      tournamentEndSound: null,
    },
  }),

  actions: {
    setTournamentData(data) {
      this.tournamentData = { ...this.tournamentData, ...data };
    },

    addTournament(newTournament) {
      this.tournaments.push({ ...newTournament });
    },

    resetTournamentData() {
      this.tournamentData = {
        id: uuidv4(),
        title: "",
        buyIn: null,
        stackInitial: null,
        players: [
          {
            id: uuidv4(),
            nome: "",
            cognome: "",
            stackInitial: null,
            reBuy: { enabled: false, costo: null, reBuyStack: null },
            addOn: { enabled: false, costo: null, addOnStack: null },
          },
        ],
        reBuy: { enabled: false, costo: null, reBuyStack: null },
        addOn: { enabled: false, costo: null, addOnStack: null },
        levels: [],
      };

      this.resetTimerState();
    },

    clearTournaments() {
      this.tournaments = [];
    },

    //Levels

    addLevelToTournament(level) {
      this.tournamentData.levels.push(level);
    },

    setLevels(levels) {
      this.tournamentData.levels = levels;
    },

    deleteLevelFromTournament(levelId) {
      this.tournamentData.levels = this.tournamentData.levels.filter(
        (level) => level.id !== levelId
      );
    },

    //Players
    addPlayer(player) {
      // Contatori per rebuy e addon
      const newPlayer = {
        ...player,
        reBuyCount: 0,
        addOnCount: 0,
      };
      this.tournamentData.players.push(newPlayer);
    },

    setPlayers(players) {
      // Contatori per ogni giocatore
      const playersWithCounts = players.map((player) => ({
        ...player,
        reBuyCount: player.reBuyCount || 0,
        addOnCount: player.addOnCount || 0,
      }));
      this.tournamentData.players = playersWithCounts;
    },

    deletePlayerFromTournament(playerId) {
      this.tournamentData.players = this.tournamentData.players.filter(
        (player) => player.id !== playerId
      );
    },

    // Aggiungere un rebuy a un giocatore
    addReBuyToPlayer(playerId) {
      const player = this.tournamentData.players.find((p) => p.id === playerId);
      if (player && this.tournamentData.reBuy.enabled) {
        player.reBuyCount = (player.reBuyCount || 0) + 1;
        player.stack =
          this.tournamentData.stackInitial +
          player.reBuyCount * this.tournamentData.reBuy.reBuyStack +
          (player.addOnCount || 0) * this.tournamentData.addOn.addOnStack;
        player.spesa =
          this.tournamentData.buyIn +
          player.reBuyCount * this.tournamentData.reBuy.costo +
          (player.addOnCount || 0) * this.tournamentData.addOn.costo;
        return true;
      }
      return false;
    },

    // Aggiungere un addon a un giocatore
    addAddOnToPlayer(playerId) {
      const player = this.tournamentData.players.find((p) => p.id === playerId);
      if (player && this.tournamentData.addOn.enabled) {
        player.addOnCount = (player.addOnCount || 0) + 1;
        player.stack =
          this.tournamentData.stackInitial +
          (player.reBuyCount || 0) * this.tournamentData.reBuy.reBuyStack +
          player.addOnCount * this.tournamentData.addOn.addOnStack;
        player.spesa =
          this.tournamentData.buyIn +
          (player.reBuyCount || 0) * this.tournamentData.reBuy.costo +
          player.addOnCount * this.tournamentData.addOn.costo;
        return true;
      }
      return false;
    },

    // Timer actions
    initializeTimer() {
      if (
        this.tournamentData.levels &&
        this.tournamentData.levels.length > 0 &&
        this.timerState.countdown === 0
      ) {
        this.timerState.countdown = this.tournamentData.levels[0].duration * 60;
      }

      // Inizializza l'audio solo se non è già stato fatto
      if (!this.timerState.audioInitialized) {
        this.initializeAudio();
      }
    },

    initializeAudio() {
      // Suono per il cambio di livello
      this.timerState.levelChangeSound = new Audio();
      this.timerState.levelChangeSound.src = " /sound/level-change.mp3";
      this.timerState.levelChangeSound.preload = "auto";

      // Suono per l'inizio del break
      this.timerState.breakStartSound = new Audio();
      this.timerState.breakStartSound.src = "/sound/pause-alert.mp3";
      this.timerState.breakStartSound.preload = "auto";

      // Suono per la fine del torneo
      this.timerState.tournamentEndSound = new Audio();
      this.timerState.tournamentEndSound.src = "/sound/level-change.mp3";
      this.timerState.tournamentEndSound.preload = "auto";

      this.timerState.audioInitialized = true;
    },

    playSound(soundType) {
      let sound = null;

      switch (soundType) {
        case "levelChange":
          sound = this.timerState.levelChangeSound;
          break;
        case "breakStart":
          sound = this.timerState.breakStartSound;
          break;
        case "tournamentEnd":
          sound = this.timerState.tournamentEndSound;
          break;
      }

      if (sound && sound.readyState >= 2) {
        sound.currentTime = 0;
        sound.play().catch((error) => {
          console.error("Errore durante la riproduzione dell'audio:", error);
        });
      }
    },

    startTimer() {
      if (!this.timerState.isRunning || this.timerState.isPaused) {
        this.timerState.isRunning = true;
        this.timerState.isPaused = false;

        // Se non c'è già un intervallo globale, ne creiamo uno
        if (!this.timerState.globalIntervalId) {
          this.createGlobalInterval();
        }
      }
    },

    pauseTimer() {
      if (this.timerState.isRunning && !this.timerState.isPaused) {
        this.timerState.isPaused = true;
      }
    },

    stopTimer() {
      this.timerState.isRunning = false;
      this.timerState.isPaused = false;
      this.clearGlobalInterval();
    },

    // Crea un intervallo globale per aggiornare il timer
    createGlobalInterval() {
      // Cancella qualsiasi intervallo esistente 
      this.clearGlobalInterval();

      // Crea un nuovo intervallo che aggiorna il timer ogni secondo
      this.timerState.globalIntervalId = setInterval(() => {
        if (this.timerState.isRunning && !this.timerState.isPaused) {
          // Aggiorniamo il tempo trascorso e il countdown
          this.timerState.totalTime++;

          if (this.timerState.countdown > 0) {
            this.timerState.countdown--;
          } else {
            // Timer finito, gestisci la logica successiva
            this.handleTimerEnd();
          }
        }
      }, 1000);
    },

    // Pulisce l'intervallo globale
    clearGlobalInterval() {
      if (this.timerState.globalIntervalId !== null) {
        clearInterval(this.timerState.globalIntervalId);
        this.timerState.globalIntervalId = null;
      }
    },

    // Gestisce cosa succede quando il timer arriva a zero
    handleTimerEnd(toast, router) {
      this.stopTimer();

      if (this.timerState.isBreakTime) {
        this.goToNextLevel(toast, router);
      } else if (
        this.tournamentData.levels[this.timerState.currentLevelIndex] &&
        this.tournamentData.levels[this.timerState.currentLevelIndex]
          .breakTime > 0
      ) {
        this.startBreakTime(toast);
      } else {
        this.goToNextLevel(toast, router);
      }
    },

    startBreakTime(toast) {
      this.timerState.isBreakTime = true;
      this.timerState.countdown =
        this.tournamentData.levels[this.timerState.currentLevelIndex]
          .breakTime * 60;

      this.playSound("breakStart");

      if (toast) {
        toast.info(
          `Break time: ${
            this.tournamentData.levels[this.timerState.currentLevelIndex]
              .breakTime
          } minutes`,
          {
            position: "top-right",
            duration: 3000,
            dismissible: true,
          }
        );
      }

      this.startTimer();
    },

    goToNextLevel(toast, router) {
      this.timerState.isBreakTime = false;

      if (
        this.timerState.currentLevelIndex <
        this.tournamentData.levels.length - 1
      ) {
        this.timerState.currentLevelIndex++;
        this.timerState.countdown =
          this.tournamentData.levels[this.timerState.currentLevelIndex]
            .duration * 60;

        this.playSound("levelChange");

        if (toast) {
          toast.success(
            `Level ${
              this.tournamentData.levels[this.timerState.currentLevelIndex].id
            } started`,
            {
              position: "top-right",
              duration: 3000,
              dismissible: true,
            }
          );
        }

        this.startTimer();
      } else {
        this.timerState.isRunning = false;

        this.playSound("tournamentEnd");

        if (toast) {
          toast.success("Tournament completed", {
            position: "top-right",
            duration: 3000,
            dismissible: true,
          });
        }
      }
    },

    // Resetta lo stato del timer
    resetTimerState() {
      this.timerState.isRunning = false;
      this.timerState.isPaused = false;
      this.timerState.currentLevelIndex = 0;
      this.timerState.totalTime = 0;
      this.timerState.isBreakTime = false;
      this.timerState.countdown = 0;
      this.clearGlobalInterval();
    },
  },
});
