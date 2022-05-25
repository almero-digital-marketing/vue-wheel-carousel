import { createApp } from 'vue'
import App from './App.vue'
import WheelCarousel from './components/WheelCarousel.vue'
import Segment from './components/Segment.vue'

const app = createApp(App)
app.component('WheelCarousel', WheelCarousel)
app.component('Segment', Segment)
app.mount('#app')
