<template>
    <Container class="settings">
        <div class="profile-overview">
            <div class="avatar"></div>
            <div class="names">
                <h2>
                    John Doe
                </h2>
                <p>@johndoe</p>
            </div>
        </div>
        <section class="content">
            <div class="sidebar">
                <ul>
                    <li>
                        Account
                    </li>
                    <li>
                        Security
                    </li>
                </ul>
            </div>
            <div class="dashboard">
                <h1>
                    Account Settings
                </h1>
            </div>
        </section>
    </Container>
</template>

<script>
    import settings from '../services/settings';
    export default {
        name: "AccountSettings",
        components: {
            Container: () => import('@/components/Container')
        },
        data() {
            return {
                settings
            }
        }
    }
</script>

<style lang="scss" scoped>
    .container {
        &.settings {
            margin-top: 2em;
        }
        .profile-overview {
            display: flex;
            align-items: center;
            width: calc(100% - 6em);
            padding: 2em 3em;
            background: #f5f5fa;

            .avatar {
                background-image: linear-gradient($color-limeade, $color-gulf-blue);
                width: 64px;
                height: 64px;
                border-radius: 50%;
            }

            .names {
                margin-left: 0.75em;

                * {
                    margin: 0;
                }

                h2 {
                    font-weight: normal;
                }

                p {
                    color: #7c7c7c;
                }
            }
        }

        .content {

            display: flex;
            justify-content: space-between;
            width: 100%;
            margin-top: 2em;

            .sidebar,
            .dashboard {
                padding: 2em;
                background: #f5f5fa;
            }

            .sidebar {
                width: calc(25% - 2em);
            }

            .dashboard {
                width: calc(65% - 2em);
            }
        }
    }
</style>
