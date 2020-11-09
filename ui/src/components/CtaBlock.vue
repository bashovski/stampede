<template>
    <div class="cta-block">
        <div class="description">
            <h1>
                <slot name="heading"></slot>
            </h1>
            <p>
                <slot name="p"></slot>
            </p>
        </div>
        <div class="button-block">
            <slot name="button"></slot>
        </div>
    </div>
</template>

<script>
    export default {
        name: "CtaBlock"
    }
</script>

<style lang="scss" scoped>
    .cta-block {
        display: flex;
        padding: 2em 4em;
        justify-content: space-between;
        align-items: center;
        box-shadow: 0 0 30px 0 rgba(0, 0, 0, 0.2);
        background: #fff;
        width: 80%;
        margin-top: -210px;

        @media screen and (max-width: 992px) {
            width: calc(100% - 8em);
            flex-direction: column;
            margin-right: 0;
            text-align: center;
            margin-bottom: 2em;
        }

        .description {
            margin-right: 5em;
            @media screen and (max-width: 992px) {
                margin-right: 0;
                margin-bottom: 2em;
            }
        }
    }
</style>
