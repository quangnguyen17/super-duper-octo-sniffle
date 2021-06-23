<template>
    <div class="center-container">
        <b-card class="centered-card shadow border-0 rounded">
            <div id="body" class="p-4">
                <h3 class="font-weight-bold text-danger">Oops! Something went wrong.</h3>
                <pre class="text-secondary mb-0 bg-light p-3 my-3 rounded">{{ displayError }}</pre>
                <b-button variant="light" class="text-green" v-on:click="reloadPage">Refresh Page</b-button>
                <b-button variant="light" class="mx-2 text-info" v-on:click="backToMoonbase">Moonbase</b-button>
                <b-button variant="light" class="text-warning" v-on:click="startOver">Start Over</b-button>
            </div>
        </b-card>
    </div>
</template>

<script>
import AuthUtil from "../AuthUtil";

export default {
    props: ["error"],
    components: {},
    data() {
        return {
            displayError: "",
        };
    },
    computed: {},
    async mounted() {
        if (this.error.response) {
            if (this.error.response.data) {
                this.displayError = this.error.response.data;
            } else {
                this.displayError = this.error.response;
            }
        } else {
            this.displayError = JSON.stringify(this.error, null, 2);
        }
    },
    methods: {
        reloadPage() {
            this.$router.go();
        },
        backToMoonbase() {
            this.$router.push("https://moonbase.intellivision.net");
        },
        startOver() {
            AuthUtil.clearCookie();
            this.$router.go();
        },
    },
};
</script>

<style lang="css">
.center-container {
    display: grid;
    place-items: center;
    width: 100%;
    height: calc(100vh - 66px);
}

.centered-card {
    max-width: 70%;
    max-height: 70%;
}

pre {
    overflow-x: auto;
    white-space: pre-wrap;
    white-space: -moz-pre-wrap;
    white-space: -pre-wrap;
    white-space: -o-pre-wrap;
    word-wrap: break-word;
}
</style>
