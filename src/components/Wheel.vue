<template>
    <div class="wheel" ref="component">
        <carousel 
            :capture-scroll="captureScroll" 
            :center="true" 
            :center-first="true"
            :center-last="true"
            :overlay="true"
            :duration="duration"
            @progress="onProgress"
        >
            <template #overlay>
                <div class="view">
                    <div class="circle" ref="circle">
                        <slot></slot>
                    </div>
                </div>
            </template>
            <slide v-for="(item, index) in info" :key="index">
                <div class="item" :style="{
                    '--item-width': item.width,
                    '--item-height': item.height
                }"></div>
            </slide>
        </carousel>
    </div>
</template>
<script setup>
import { ref, toRefs, onMounted, watch, provide } from 'vue'
import 'vue-overflow-carousel/dist/style.css'
import { Carousel, Slide } from 'vue-overflow-carousel'
import { gsap } from 'gsap'

const emit = defineEmits(['update:modelValue'])
const props = defineProps({
    captureScroll: {
      type: Boolean,
      default: true,
    },
	duration: {
      type: Number,
      default: .2,
    },
    radius: {
        type: Number,
        default: 3000
    },
})

const { radius, duration } = toRefs(props)
const component = ref(null)
const circle = ref(null)
const info = ref([])
const minHeight = ref(0)

provide('info', info)

function onProgress(progress) {
    const minRotation = info.value[0].rotation
    const maxRotation = info.value[info.value.length - 1].rotation

    gsap.to(circle.value, { 
        ease: "power2",
        duration: duration.value,
        rotation: -1 * (maxRotation - minRotation) * progress,
        overwrite: true
    })
}

function updateLayout() {
    if (!component.value) return

    minHeight.value = 0
    const segments = component.value.getElementsByClassName('segment')
    let index = 0
    let rotation = 0
   
    for (const segment of segments) {
        const angle = 180 * segment.offsetWidth / (Math.PI * (radius.value - segment.offsetHeight))
        const halfAngle = angle / 2
        if (index == 0) {
            rotation -= halfAngle
        }
        rotation += halfAngle
        info.value[index] = {
            rotation,
            start: rotation - halfAngle,
            end: rotation + halfAngle,
            width: Math.sin(halfAngle * Math.PI / 180) * 2 * radius.value,
            height: segment.offsetHeight,
            translation: radius.value - Math.sqrt(Math.pow(radius.value, 2) - Math.pow(segment.offsetWidth / 2, 2))
        }
        segment.style.setProperty('--rotation', info.value[index].rotation + 'deg')
        segment.style.setProperty('--translation', info.value[index].translation + 'px')
        rotation += halfAngle

        const currentHeight = segment.offsetHeight + info.value[index].translation * 2
        if (currentHeight > minHeight.value) {
            minHeight.value = currentHeight
        }
        index++
    }
}

onMounted(updateLayout)
watch(radius, updateLayout)

</script>
<style lang="less" scoped>
.wheel {
    --radius: calc(v-bind(radius) * 1px);
    --diameter: calc(v-bind(radius) * 2px);

    .carousel {
        min-height: calc(v-bind(minHeight) * 1px);;
    }

    .view {
        width: 100%;
        height: 100%;
        overflow: hidden;
    }

    .circle {
        width: var(--diameter);
        height: var(--diameter);
        position: relative;

        left: 50%;
        transform: translateX(-50%);
        will-change: tranform;

        &::before {
            content: "";
            position: absolute;
            width: 100%;
            height: 100%;
            border-radius: 50%;
        }

        ::v-deep(.segment) {
            position: absolute;
            top: 0;
            left: calc(50%);
            transform-origin: center var(--radius);
            transform: translateX(-50%) rotate(var(--rotation)) translateY(var(--translation));
        }
    }

    .item {
        width: calc(var(--item-width) * 1px);
        height: calc(var(--item-height) * 1px);
    }
}
</style>