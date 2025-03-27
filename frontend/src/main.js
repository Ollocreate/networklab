import { createApp } from 'vue'
import App from './App.vue'
import router from './router';
import store from './store/index';
import VueKonva from 'vue-konva';

import { createVuetify } from 'vuetify';
import 'vuetify/styles';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

const vuetify = createVuetify({
    components,
    directives,
  });

const app = createApp(App);
app.use(router);
app.use(vuetify);
app.use(store);
app.use(VueKonva);

// Инициализируем store перед монтированием приложения
store.dispatch('initialize');

app.mount('#app');

