import { createApp } from 'vue'
import App from './App.vue'
import Segment from './components/Segment.vue'
import Wheel from './components/Wheel.vue'

const app = createApp(App)
app.component('Wheel', Wheel)
app.component('Segment', Segment)
app.mount('#app')
