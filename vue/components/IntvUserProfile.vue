<template>
    <div class="parent">
        <img :src="user.picture" class="profile-image" />
        <div class="details">
            <h6 class="title">{{ user.firstName }} {{ user.lastName }}</h6>
            <span class="email">{{ user.email }}</span>
        </div>
    </div>
</template>

<script>
export default {
    name: 'IntvUserProfile',
    props: ['user'],
};
</script>

<style>
.parent {
    margin: 0;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: start;
}

.profile-image {
    width: 50px;
    height: 50px;
    border-radius: 25px;
    overflow: hidden;
    background-color: rgb(245, 245, 245);
}

.details {
    padding: auto;
    margin-left: 12px;
}

.title {
    margin: 0;
}

.email {
    color: gray;
}
</style>
