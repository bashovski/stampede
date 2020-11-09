<template>
    <Container class="footer-container">
        <footer>
            <CtaBlock>
                <template v-slot:heading>
                    Documentation
                </template>
                <template v-slot:p>
                    It has never been any easier to start off building your own REST API with already integrated
                    user interface both written in Typescript, assuring easier codebase maintenance.
                </template>
                <template v-slot:button>
                    <RouterLink
                            class="button"
                            to="/docs"
                    >
                        Docs
                    </RouterLink>
                </template>
            </CtaBlock>
            <div class="summary">
                <div class="text">
                    <p>
                        Stampede simplifies and shortens the whole process of adding tons of boilerplate code by already providing it
                        while being secure, fast and reliable at the same time. The idea is too keep the users building new features
                        very fast and avoid time spent writing code they didn't aim to write before.
                    </p>
                    <p>
                        Using Stampede CLI and Stampede Boilerplate, you'll be able to create entirely new features in
                        less than 5 minutes. All code gets automatically pre-generated and prepared for customization.
                    </p>
                </div>
                <div class="synopsis">
                    <p>
                        Whenever you run into a bug, please open up an issue on GitHub.
                        If you do not understand some parts of Stampede or have suggestions,
                        please let us know by sending an email to: <a href="mailto:anurbasic01@outlook.com">anurbasic01@outlook.com</a>
                    </p>
                </div>
            </div>
            <div class="links">
                <a href="#">Official Tutorial</a>
                <a href="#">CLI</a>
                <a href="#">Docs</a>
                <a href="#">License</a>
            </div>
        </footer>
        <div class="footer-end">
            <img
                    src="../assets/logo-flat.svg"
                    alt="Stampede"
            >
        </div>
    </Container>
</template>

<script>
    export default {
        name: "Footer",
        components: {
            Container: () => import('@/components/Container'),
            CtaBlock: () => import('@/components/CtaBlock')
        }
    }
</script>

<style lang="scss" scoped>
    .container {
        background: #f5f5fa;
        display: flex;
        flex-direction: column;
        align-items: center;

        &.footer-container {
            margin-top: 210px;

            @media screen and (max-width: 992px) {
                margin: 210px 1em 0 1em;
            }
        }

        footer {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 7em 1em 3em 1em;

            .summary {
                display: flex;
                justify-content: space-between;
                padding: 3em 1.5em;
                line-height: 1.6em;

                @media screen and (max-width: 992px) {
                    flex-direction: column;

                    .text,
                    .synopsis {
                        width: 100%;
                    }
                }

                .text {
                    width: 48%;
                    @media screen and (max-width: 992px) {
                        width: 100%;
                    }
                }
                .synopsis {
                    width: 48%;

                    @media screen and (max-width: 992px) {
                        width: 100%;
                    }

                    a {
                        color: $color-limeade;
                        transition: 500ms;

                        &:hover {
                            opacity: 0.5;
                        }
                    }
                }
            }

            .links {
                margin: 2em 0;
                display: flex;
                justify-content: center;
                width: calc(100% - 4em);

                @media screen and (max-width: 992px) {
                    flex-direction: column;
                    text-align: center;
                    justify-content: center;
                }

                a {
                    text-decoration: none;
                    color: $color-limeade;
                    font-weight: 500;
                    &:not(:first-child) {
                        margin-left: 5em;
                        @media screen and (max-width: 992px) {
                            margin-left: 0;
                        }
                    }
                }
            }
        }

        .footer-end {

            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2em;
            width: calc(100% - 4em);
            background: #ffffff;

            img {
                width: 48px;
            }
        }
    }
</style>
