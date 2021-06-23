<template>
    <div :class="`${noBorder ? '' : 'border'} ${noPadding ? '' : 'p-2'}`">
        <div v-for="(val, key, idx) in item" :key="idx">
            <span v-if="typeof val === 'string' || typeof val === 'number'">
                <span class="font-weight-bold mr-1">{{ key }}:</span>
                <span v-if="key === 'releaseDate'" class="text-secondary">{{ new Date(item.releaseDate).toLocaleDateString() }}</span>
                <span v-else class="text-secondary">{{ val }}</span>
            </span>
        </div>
    </div>
</template>

<script>
export default {
    name: 'IntvMetadata',
    props: ['item', 'noBorder', 'noPadding'],
};
</script>
