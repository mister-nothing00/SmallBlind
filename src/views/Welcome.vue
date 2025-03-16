<template>
    <div class="container-intro">
        <h1>Easy Poker Manager</h1>
        <p>The web app that allows you to create a poker tournament by choosing and setting the modes completely
            manually</p>
        <router-link to="/start">
            <button class="next">
                Next
            </button>
        </router-link>
    </div>
</template>



<style scoped>


.container-intro {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 80vh;
}

.container-intro>h1 {
    font-size: 64px;
    font-weight: 700;
    letter-spacing: 2px;
    text-align: center;
}


.container-intro>p {
    color: #71717a;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 14px;
    text-align: center;
    letter-spacing: 2px;
    margin: 16px 0;
    width: 50%;
}

@media screen and (max-width: 425px){
   .container-intro> h1{
        font-size:32px;
    }
    .container-intro>p{
        font-size: 12px;
        width: 100%;
    }
}

@media screen and (max-width: 768px){
   .container-intro{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 80vh;
}
}

</style>