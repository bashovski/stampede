<template>
    <div id="app">
        <Navbar/>
        <router-view/>
        <Footer/>
    </div>
</template>

<script>
    import Auth from "@/auth";
    export default {
        name: 'App',
        components: {
            Navbar: () => import('@/layouts/Navbar'),
            Footer: () => import('@/layouts/Footer')
        },
        mounted() {
            Auth.authenticate();
        }
    }
</script>

<style lang="scss">
    body {
        margin: 0;
    }

    * {
        font-family: Montserrat, serif;
    }
</style>
