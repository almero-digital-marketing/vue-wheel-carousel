<template>
    <div class="wheel-carousel" ref="component" @mousewheel="wheel">
        <Draggable 
            name="wheel" 
            class="wheel" 
            type="rotation" 
            v-model="progress" 
            :bounds="bounds" 
            :snap="snapPoints"
        >
            <div class="circle">
                <slot :active="modelValue" :progress="progress"></slot>
            </div>
        </Draggable>
    </div>
</template>
<script setup>
import { ref, toRefs, onMounted, watch, provide } from 'vue'
import { Draggable } from 'vue-gsap-draggable'

const emit = defineEmits(['update:modelValue'])
const props = defineProps({
    radius: {
        type: Number,
        default: 3000
    },
    captureScroll: {
      type: Boolean,
      default: true,
    },
    modelValue: {
      type: Number,
      default: 0,
    },
    snap: {
        type: Boolean,
        default: true
    }
})

const { radius, modelValue, captureScroll, snap } = toRefs(props)
const component = ref(null)
const progress = ref(1)
const info = ref([])
const bounds = ref({
    minRotation: 0,
    maxRotation: 360
})
const snapPoints = ref(null)
const minHeight = ref(0)
provide('active', modelValue)
provide('info', info)
provide('progress', progress)

function init() {
    console.log('Init wheel segment')
    const segments = component.value.getElementsByClassName('segment')
    let rotation = 0
    let index = 0
    minHeight.value = 0
    for (const segment of segments) {
        const segmentAngle = 180 * segment.offsetWidth / (Math.PI * (radius.value - segment.offsetHeight))
        rotation += segmentAngle / 2
        if (index != 0) {
            segment.style.setProperty('--rotation', rotation + 'deg')
            if (index == segments.length - 1) {
                bounds.value.minRotation = 360 - rotation
            }
            rotation += segmentAngle / 2
            info.value[index] = {
                startAngle: (rotation - segmentAngle),
                endAngle: rotation
            }
        } else {
            segment.style.setProperty('--rotation', 0 + 'deg')
            info.value[index] = {
                startAngle: -segmentAngle / 2,
                endAngle: segmentAngle / 2
            }
        }
        info.value[index].centerAngle = info.value[index].startAngle + (info.value[index].endAngle - info.value[index].startAngle) / 2
        const translation = radius.value - Math.sqrt(Math.pow(radius.value, 2) - Math.pow(segment.offsetWidth / 2, 2))
        segment.style.setProperty('--translation', translation + 'px')
        const currentHeight = segment.offsetHeight + translation * 2
        if (currentHeight > minHeight.value) {
            minHeight.value = currentHeight
        }
        index++
    }
    let sliderAngle = bounds.value.maxRotation - bounds.value.minRotation
 
    for (let index = 0; index < info.value.length; index++) {
        info.value[index].start = 1 - info.value[index].startAngle / sliderAngle
        info.value[index].end = 1 - info.value[index].endAngle / sliderAngle
        info.value[index].center = 1 - info.value[index].centerAngle / sliderAngle
    }
    if (snap.value) {
        snapPoints.value = info.value.map(i => 360 - i.centerAngle)
    }
}

function getActive() {
    for (let index = 0; index < info.value.length; index++) {
        const {start, end} = info.value[index]
        if (progress.value < start && progress.value >= end) {
            return index
            break;
        }
    }
    if (progress.value < 1) return info.value.length - 1
    return 0
}

function goTo(index) {
    if (info.value[index]) {
        progress.value = info.value[index].center
    }
}

onMounted(() => {
    init()
    goTo(modelValue.value)
})
watch(radius, init)
watch(progress, () => {
    let active = getActive()
    if (modelValue.value != active) {
        emit("update:modelValue", active)
    }
})
watch(modelValue, () => {
    let active = getActive()
    if (modelValue.value < 0) {
        emit("update:modelValue", 0)
    } else if (modelValue.value > info.value.length - 1){
        emit("update:modelValue", info.value.length - 1)
    } else if(modelValue.value != active) {
        goTo(modelValue.value)
    }
})

function wheel(e) {
    if (!captureScroll.value) return
    const p = 2 * Math.PI * radius.value
    let value = progress.value - e.deltaY / (p * (bounds.value.maxRotation - bounds.value.minRotation) / 180)
    const lastInfo = info.value[info.value.length - 1]
    if (value > 1) {
        value = 1
    } else if (value < lastInfo.center) {
        value = lastInfo.center
    } else {
        value = value
        e.preventDefault()
    }
    progress.value = value
}

</script>
<style lang="less" scoped>
* {
    box-sizing: border-box;
}
.wheel-carousel {
    --radius: calc(v-bind(radius) * 1px);
    --diameter: calc(v-bind(radius) * 2px);

    min-height: calc(v-bind(minHeight) * 1px);
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: relative;
    .wheel {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        width: var(--diameter);
        height: var(--diameter);
        border-radius: 50%;
    }
    .circle {
        width: var(--diameter);
        height: var(--diameter);
        position: relative;
        ::v-deep(.segment) {
            position: absolute;
            top: 0;
            left: calc(50%);
            transform-origin: center var(--radius);
            transform: translateX(-50%) rotate(var(--rotation)) translateY(var(--translation));
        }
    }
}
</style>