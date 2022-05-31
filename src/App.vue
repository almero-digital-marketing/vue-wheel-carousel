<template>
    <div class="root">
        <wheel v-model="active">
            <segment v-slot="segment">0 <strong>{{segment.active}} {{segment.progress}}</strong> {{ segment.info }}</segment>
            <segment v-slot="segment">1 <strong>{{segment.active}} {{segment.progress}}</strong> {{ segment.info }}</segment>
            <segment v-slot="segment">2 <strong>{{segment.active}} {{segment.progress}}</strong> {{ segment.info }}</segment>
            <segment v-slot="segment">3 <strong>{{segment.active}} {{segment.progress}}</strong> {{ segment.info }}</segment>
            <segment v-slot="segment">4 <strong>{{segment.active}} {{segment.progress}}</strong> {{ segment.info }}</segment>
            <segment v-slot="segment">5 <strong>{{segment.active}} {{segment.progress}}</strong> {{ segment.info }}</segment>
            <segment v-slot="segment">6 <strong>{{segment.active}} {{segment.progress}}</strong> {{ segment.info }}</segment>
            <segment v-slot="segment">7 <strong>{{segment.active}} {{segment.progress}}</strong> {{ segment.info }}</segment>
            <segment v-slot="segment">8 <strong>{{segment.active}} {{segment.progress}}</strong> {{ segment.info }}</segment>
            <segment v-slot="segment">9 <strong>{{segment.active}} {{segment.progress}}</strong> {{ segment.info }}</segment>
        </wheel>
    </div>
</template>
<script setup>
import { ref } from 'vue'
const active = ref(3)
</script>
<style lang="less">
* {
    box-shadow: border-box;
}
body {
    min-height: 300vh;
}
.root {
    width: 50vw;
    margin-left: 25vw;
    margin-top: 10vh;
}
.wheel-carousel {
    border: 1px solid red;
}
.circle {
    border: 1px solid green;
}
.circle::before {
    border: 1px solid green;
}
.wheel {
    border: 1px solid blue;
}
.slide .item {
    box-shadow: 0 0 0 1px darkgrey;
    // border: 1px solid lightgrey;
}
.segment {
    width: 240px;
    height: 480px;
    background-color: rgba(0,0,0,.1);

    &:nth-child(2) {
        width: 320px;
        height: 540px;
    }
    &:nth-child(3) {
        height: 240px;
    }
    &:nth-child(4) {
        width: 120px;
    }
    &.active {
        background-color: orange;
    }
}
.info {
    position: absolute;
    top: 100px;
    left: 50%;
    transform: translateX(-50%);
}
</style>