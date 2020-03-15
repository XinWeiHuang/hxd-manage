import Vue from 'vue'
import Vuex from 'vuex'
import {getAdminInfo} from '@/api/getData'
import createPersistedState from "vuex-persistedstate"

Vue.use(Vuex)

const state = {
	adminInfo: {
		avatar: 'default.jpg'
	},
    userInfo: {

    }
}

const mutations = {
	saveAdminInfo(state, adminInfo){
		state.adminInfo = adminInfo;
	}
}

const actions = {
	async getAdminData({commit}){
		try{
			const res = await getAdminInfo()
			if (res.status == 1) {
				commit('saveAdminInfo', res.data);
			} else{
				throw new Error(res.type)
			}
		}catch(err){
			// console.log(err.message)
		}
	}
}

export default new Vuex.Store({
	state,
	actions,
	mutations,
    plugins: [createPersistedState({ storage: window.sessionStorage })]
})
