<template>
    <div class="m-3">
        <div class="d-flex justify-content-between align-items-center mb-3">
            <h2 class="mb-0 d-inline-block font-weight-bold">Games ({{ games.length }})</h2>
            <b-button variant="outline-success" href="/#/add-game" class="rounded-0">Add game</b-button>
        </div>
        <div v-for="(game, idx) in games" :key="idx" class="w-100 mb-3">
            <b-button v-b-toggle="`game-${idx}`" variant="light" class="w-100 d-flex justify-content-between align-items-center rounded-0 p-2">
                <h4 class="font-weight-bold mb-0">{{ game.nameInt }}</h4>
                <span class="text-secondary">
                    <span v-for="(category, idx) in game.categories" :key="idx" :class="idx === 0 ? '' : 'ml-1'">#{{ formatCategory(category) }}</span>
                </span>
            </b-button>
            <b-collapse :id="`game-${idx}`">
                <b-card class="p-3">
                    <div class="row">
                        <div class="col">
                            <p class="font-weight-bold mb-1">Metadata:</p>
                            <intv-metadata v-bind:item="game" class="mb-2"></intv-metadata>
                            <b-button size="sm" variant="outline-secondary" class="rounded-0" :href="`/#/edit-game/${game.gameId}`">Edit game</b-button>
                        </div>
                        <div v-if="game.ratings && game.ratings.length > 0" class="col">
                            <p class="font-weight-bold mb-1">Ratings ({{ game.ratings.length }}):</p>
                            <intv-metadata v-for="(item, idx) in game.ratings" v-bind:key="idx" v-bind:item="item" class="mb-1"></intv-metadata>
                        </div>
                        <div v-if="game.mediaAssets && game.mediaAssets.length > 0" class="col">
                            <p class="font-weight-bold mb-1">Media Assets ({{ game.mediaAssets.length }}):</p>
                            <intv-metadata v-for="(item, idx) in game.mediaAssets" v-bind:key="idx" v-bind:item="item" class="mb-1"></intv-metadata>
                        </div>
                        <div v-if="game.textAssets && game.textAssets.length > 0" class="col">
                            <p class="font-weight-bold mb-1">Text Assets ({{ game.textAssets.length }}):</p>
                            <intv-metadata v-for="(item, idx) in game.textAssets" v-bind:key="idx" v-bind:item="item" class="mb-1"></intv-metadata>
                        </div>
                    </div>
                </b-card>
            </b-collapse>
        </div>
        <b-modal id="MetadataModal" ref="MetadataModal" :title="metadataModalTitle">
            <intv-metadata :item="metadata"></intv-metadata>
            <template #modal-footer="{ ok }">
                <b-button variant="info" @click="ok()" class="rounded-0">OK</b-button>
            </template>
        </b-modal>
    </div>
</template>

<script>
import Backend from '../Backend';
import InfoCard from '../components/InfoCard.vue';
import IntvMetadata from '../components/IntvMetadata.vue';

export default {
    name: 'Games',
    components: { InfoCard, IntvMetadata },
    data() {
        return {
            games: [],
            metadataModalTitle: '',
            metadata: {},
        };
    },
    async mounted() {
        try {
            this.games = await Backend.getGames();
        } catch (err) {
            Backend.handleError(err);
        }
    },
    methods: {
        formatCategory(category) {
            return category.toLowerCase().replace(/ /g, '_');
        },
    },
};
</script>

<style>
@import url('./Games.css');
</style>
