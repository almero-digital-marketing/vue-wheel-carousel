<template>
    <div class="root">
        <button @click="addSegments">Add</button> <button @click="goTo">Go To</button>
        <wheel v-model="active" ref="carousel">
            <segment v-for="(segment, index) of segments" v-slot="item" :key="index" :style="{
                width: segment.width + 'px',
                height: segment.height + 'px'
            }">
                {{ index }} <strong>{{item.active}} {{item.progress}}</strong> {{ item.info }}
            </segment>
        </wheel>
    </div>
</template>
<script setup>
import { ref } from 'vue'
const active = ref(3)
const segmentValues = Array.from(new Array(10), () => {
    return {
        width: 60 + Math.random() * 320,
        height: 240 + Math.random() * 320,
    }
})
const segments = ref(segmentValues)
const carousel = ref(null)

function addSegments() {
    segments.value.push(...segmentValues)
}

function goTo() {
    carousel.value.goTo(0, true)
}
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