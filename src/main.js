import { createApp, defineAsyncComponent } from 'vue';
import App from './App.vue';
import BaseBadge from './components/ui/BaseBadge.vue';
import BaseButton from './components/ui/BaseButton.vue';
import BaseCard from './components/ui/BaseCard.vue';
import BaseSpinner from './components/ui/BaseSpinner.vue';
import router from './router';
import store from './store/index';

const BaseDialog = defineAsyncComponent(() =>
  import('./components/ui/BaseDialog.vue')
);

createApp(App)
  .component('BaseBadge', BaseBadge)
  .component('BaseButton', BaseButton)
  .component('BaseCard', BaseCard)
  .component('BaseSpinner', BaseSpinner)
  .component('BaseDialog', BaseDialog)
  .use(router)
  .use(store)
  .mount('#app');
