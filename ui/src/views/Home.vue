<template>
    <Container>
        <div class="stampede-home">
            <img
                    src="../assets/logo.svg"
                    alt="Stampede"
            >
            <h1>
                Hello, Friend.
            </h1>
            <p>
                🎉 Seems like you've got everything running. Shall we get started?
            </p>
            <RouterLink
                    class="button"
                    to="/help"
            >
                GET STARTED
            </RouterLink>
        </div>
    </Container>
</template>

<script>
    export default {
        name: 'Home',
        components: {
            Container: () => import('@/components/Container')
        }
    }
</script>

<style lang="scss" scoped>

    .container {
        justify-content: center;
        min-height: calc(100vh - (3rem + 10px + 48px));
    }

    .stampede-home {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        h1 {
            margin-bottom: 0;
        }
    }
</style>
