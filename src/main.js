import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import VueDirectiveImagePreviewer from 'vue-directive-image-previewer'
import 'vue-directive-image-previewer/dist/assets/style.css'

Vue.use(VueDirectiveImagePreviewer)

Vue.config.productionTip = false;

Vue.use(ElementUI);

router.beforeEach((to, from, next)=> {
    const { id } = store.state.adminInfo;
    if (!id && to.path != '/') {
        next({ path: '/' })
    } else {
        next()
    }
})

new Vue({
	el: '#app',
	router,
	store,
	template: '<App/>',
	components: { App }
})
