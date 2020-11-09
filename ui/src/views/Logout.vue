<template>
    <div class="stampede-logout">
        <div class="anim">
            <div v-for="i in 4" :key="i"></div>
        </div>
        <h3>
            Logging you out...
        </h3>
    </div>
</template>

<script>

    import AuthApi from '@/api/auth';
    import StorageSvc from '@/services/storage';

    export default {
        name: 'Logout',
        mounted() {
            this.logout();
        },
        methods: {
            async logout() {
                const { success, err } = await AuthApi.logout();

                if (!success || err)
                    return;

                await StorageSvc.clearUserData();
                await this.$router.replace('/');
            }
        }
    }
</script>

<style lang="scss" scoped>
    .stampede-logout {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: calc(100vh - (3em + 10px));

        .anim {
            display: inline-block;
            position: relative;
            width: 80px;
            height: 80px;

            div {
                box-sizing: border-box;
                display: block;
                position: absolute;
                width: 86px;
                height: 86px;
                margin-left: -5px;
                border-radius: 50%;
                animation: anim 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
                border-width: 8px;
                border-style: solid;
                border-color: #859A01 transparent transparent transparent;

                &:nth-child(1) {
                    animation-delay: -0.45s;
                }
                &:nth-child(2) {
                    animation-delay: -0.3s;
                }
                &:nth-child(3) {
                    animation-delay: -0.15s;
                }
            }
        }

        h3 {
            font-size: 22px;
            font-weight: normal;
        }
    }

    @keyframes anim {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }

</style>
