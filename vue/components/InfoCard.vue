<template>
    <div v-if="data" class="p-3 mb-1 border rounded">
        <div v-for="(val, key, idx) in data" v-bind:key="idx">
            <span class="font-weight-bold">{{ key }}:</span>
            <ul class="mb-0" v-if="Array.isArray(val)">
                <li v-for="(item, index) in val" v-bind:key="index" class="text-secondary ml-1">{{ item || '' }}</li>
            </ul>
            <span v-else class="text-secondary ml-1">{{ val || '' }}</span>
        </div>
        <b-button v-if="deleteButtonTitle" size="sm" variant="outline-danger" v-on:click="(event) => $emit('onDelete', event)" class="mt-2">
            {{ deleteButtonTitle }}
        </b-button>
    </div>
</template>

<script>
export default {
    name: 'InfoCard',
    props: ['data', 'deleteButtonTitle'],
};
</script>
