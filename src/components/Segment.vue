<template>
    <div class="segment" ref="component" :class="{ active }">
        <slot :active="active" :info="info" :progress="progress"></slot>
    </div>
</template>
<script setup>
import { inject, onMounted, ref, watch, computed } from 'vue'

const activeIndex = inject('active')
const carouselInfo = inject('info')
const carouselProgress = inject('progress')

const component = ref(null)
const active = ref(false)
const index = ref(-1)

const info = computed(() => carouselInfo.value[index.value])
const progress = computed(() => {
    if (carouselProgress.value <= info.value?.start && carouselProgress.value > info.value?.end) {
        return (info.value.start - carouselProgress.value) / (info.value.start - info.value.end)
    }
    return 0
})

function toggleActive() {
    active.value = index.value == activeIndex.value
}

onMounted(() => {
    index.value = [...component.value.parentNode.children].indexOf(component.value)
    toggleActive()
})

watch(activeIndex, toggleActive)
</script>
<style>
.segment {
    --segment-progress: v-bind(progress);
}
</style>