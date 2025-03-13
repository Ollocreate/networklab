import { createApp } from 'vue'
import App from './App.vue'
import router from './router';
import store from "./store";
import material from './store/material';

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
app.use(material);

app.mount('#app');

