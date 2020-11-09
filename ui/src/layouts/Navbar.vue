<template>
    <nav>
        <RouterLink
                class="logo"
                to="/"
        >
            <img
                    src="../assets/logo-flat.svg"
                    alt="Stampede"
            >
        </RouterLink>
        <div class="items">
            <RouterLink
                v-for="(item, key) in navItems"
                :key="key"
                :to="item.url"
            >
                {{ item.label }}
            </RouterLink>
            <RouterLink
                    v-if="isLoggedIn && !isVerified"
                    to="/verify"
            >
                Verify Email
            </RouterLink>
        </div>
    </nav>
</template>

<script>

    import store from '@/store';
    import NavSvc from '@/services/navbar';

    export default {
        name: "Navbar",
        data() {
            return {
                items: NavSvc.items
            };
        },
        computed: {
            isLoggedIn() {
                return store.getters.getLoginStatus;
            },
            isVerified() {
                return store.getters.getEmailVerifiedStatus;
            },
            navItems() {
                const authDependantItems = this.isLoggedIn
                    ? this.items.filter(item => item.authRequired)
                    : this.items.filter(item => item.authRequired === false);

                return [...this.items.filter(item => item.authRequired === null), ...authDependantItems];
            }
        }
    }
</script>

<style lang="scss" scoped>
    nav {
        display: flex;
        justify-content: space-between;
        align-items: center;

        padding: 3rem 7.5% 10px 7.5%;

        .logo {
            height: 48px;
            transition: 500ms;

            &:hover {
                opacity: 0.7;
            }

            img {
                width: 48px;
                height: 48px;
            }
        }

        .items {
            a {

                color: $color-quincy;
                text-decoration: none;
                transition: 500ms;

                &:hover {
                    opacity: 0.5;
                }

                &:not(:first-child) {
                    margin-left: 2rem;
                }

                &.active {
                    color: $color-limeade;
                }
            }
        }
    }
</style>
