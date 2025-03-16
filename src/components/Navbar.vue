<script setup>
import { ref } from 'vue';

const isMenuOpen = ref(false);

const toggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value;

    // Prevenire lo scroll quando il menu è aperto su mobile
    if (isMenuOpen.value) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
};
</script>

<template>
    <nav>
        <!-- Hamburger Menu Button  -->
        <div class="hamburger-menu" @click="toggleMenu">
            <div class="hamburger" :class="{ 'active': isMenuOpen }">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>

        <!-- Overlay scuro quando il menu è aperto su mobile -->
        <div class="menu-overlay" v-if="isMenuOpen" @click="toggleMenu"></div>

        <!-- Menu Items -->
        <ul :class="{ 'active': isMenuOpen }">
            <router-link to="/" class="link" @click="isMenuOpen = false">
                <li>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                        stroke="currentColor" class="size-6">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                    </svg>
                    Home
                </li>
            </router-link>
            <router-link to="/start" class="link" @click="isMenuOpen = false">
                <li>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                        stroke="currentColor" class="size-6">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                    Tourneament
                </li>
            </router-link>
            <router-link to="/levels" class="link" @click="isMenuOpen = false">
                <li>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                        stroke="currentColor" class="size-6">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                    Levels
                </li>
            </router-link>
            <router-link to="/players" class="link" @click="isMenuOpen = false">
                <li>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                        stroke="currentColor" class="size-6">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
                    </svg>
                    Players
                </li>
            </router-link>
            <router-link to="/timer" class="link" @click="isMenuOpen = false">
                <li>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                        stroke="currentColor" class="size-6">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                    Timer
                </li>
            </router-link>








        </ul>
    </nav>
</template>

<style scoped>
nav {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 100%;
    position: relative;
}

ul {
    display: flex;
    flex-direction: row;
    align-items: center;
    list-style-type: none;
    transition: all 0.3s ease;
    margin: 0;
    padding: 0;
}

li {
    border-radius: 8px;
    display: flex;
    align-items: center;
    gap: 0 8px;
    background: transparent;
    padding: 4px 8px;
    color: #EAEAEA;
    font-weight: 600;
    letter-spacing: 1.4px;
    text-decoration: none;
}

li>svg {
    color: #FFD700;
    width: 24px;
}

li:hover {
    text-decoration: none !important;
    background-color: rgba(255, 255, 255, 0.1);
    transition: background-color 0.3s ease;
}

.router-link-active,
.router-link-exact-active {
    text-decoration: none !important;
    color: inherit;
}

.link {
    text-decoration: none !important;
    color: inherit;
    margin: 0 5px;
}

/* Overlay */
.menu-overlay {
    display: none;
}

/* Hamburger menu button styles */
.hamburger-menu {
    display: none;
    cursor: pointer;
    z-index: 1001;
    position: absolute;
    right: 20px;
    top: 10px;
}

.hamburger {
    width: 30px;
    height: 20px;
    position: relative;
}

.hamburger span {
    display: block;
    position: absolute;
    height: 3px;
    width: 100%;
    background: #EAEAEA;
    border-radius: 3px;
    opacity: 1;
    left: 0;
    transform: rotate(0deg);
    transition: .25s ease-in-out;
}

.hamburger span:nth-child(1) {
    top: 0px;
}

.hamburger span:nth-child(2) {
    top: 8px;
}

.hamburger span:nth-child(3) {
    top: 16px;
}

/* Hamburger animation to X */
.hamburger.active span:nth-child(1) {
    top: 8px;
    transform: rotate(45deg);
}

.hamburger.active span:nth-child(2) {
    opacity: 0;
}

.hamburger.active span:nth-child(3) {
    top: 8px;
    transform: rotate(-45deg);
}

/* Responsive styles */
@media screen and (max-width: 425px) {
    .hamburger-menu {
        display: block;
    }

    nav {
        padding: 10px 0;
        justify-content: flex-end;
    }

    .menu-overlay {
        display: block;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100vh;
        background-color: rgba(0, 0, 0, 0.7);
        z-index: 999;
    }

    ul {
        position: fixed;
        top: 0;
        right: -80%;
        flex-direction: column;
        width: 80%;
        height: 100vh;
        background-color: #1c1c1c;
        padding-top: 60px;
        z-index: 1000;
        transition: right 0.3s ease;
        box-shadow: -5px 0 15px rgba(0, 0, 0, 0.3);
    }

    ul.active {
        right: 0;
    }

    .link {
        width: 100%;
        margin: 5px 0;
    }

    li {
        width: 100%;
        padding: 12px 20px;
        border-radius: 0;
        justify-content: flex-start;
    }
}
</style>