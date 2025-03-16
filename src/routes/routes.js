import { createRouter, createWebHistory } from "vue-router";
import Welcome from "../views/Welcome.vue";
import StartTourneament from "../views/StartTourneament.vue";
import Levels from "../views/Levels.vue";
import Players from "../views/Players.vue";

import Timer from "../views/Timer.vue";

const routes = [
  {
    path: "/",
    name: "Welcome",
    component: Welcome,
  },
  {
    path: "/start",
    name: "Start",
    component: StartTourneament,
  },
  {
    path: "/levels",
    name: "Levels",
    component: Levels,
  },
  {
    path: "/players",
    name: "Home",
    component: Players,
  },
  {
    path: "/timer",
    name: "Timer",
    component: Timer,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
