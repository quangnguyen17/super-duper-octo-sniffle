<template>
    <b-card class="p-3">
        <h3 class="mb-0">{{ user.firstName }} {{ user.lastName }}</h3>
        <p class="text-secondary">{{ user.email }}</p>
        <!-- roles -->
        <div contenteditable>
            <span class="mr-1">Roles:</span>
            <b-badge v-for="(role, index) in user.roles" v-bind:key="index" variant="light" class="mr-1 mb-1">
                <h6 class="mb-0">{{ role }}</h6>
            </b-badge>
        </div>
        <!-- actions -->
        <div>
            <span class="mr-1">Actions:</span>
            <b-badge v-for="(action, index) in user.actions" v-bind:key="index" variant="light" class="mr-1 mb-1">
                <h6 class="mb-0">{{ action }}</h6>
            </b-badge>
        </div>
        <hr />
        <b-button variant="outline-danger" v-on:click="removeUserHandler">Remove user</b-button>
    </b-card>
</template>

<script>
export default {
    name: "UserCard",
    props: {
        user: { type: Object },
        removeUser: { type: Promise },
    },
    components: {},
    data() {
        return {};
    },
    computed: {},
    async mounted() {},
    methods: {
        async removeUserHandler() {
            await this.removeUser();
        },
    },
};
</script>

<style lang="css"></style>
