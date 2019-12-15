import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const home = r => require.ensure([], () => r(require('@/page/home')), 'home');
const manage = r => require.ensure([], () => r(require('@/page/manage')), 'manage');
const login = r => require.ensure([], () => r(require('@/page/login')), 'login');
const loanLists = r => require.ensure([], () => r(require('@/page/loan/loanLists')), 'loanLists');
const loanStatusList = r => require.ensure([], () => r(require('@/page/loanStatus/loanStatusList')), 'loanStatusList');
const userList = r => require.ensure([], () => r(require('@/page/user/userList')), 'userList');
const adminList = r => require.ensure([], () => r(require('@/page/admin/adminList')), 'adminList');
const loanrateList = r => require.ensure([], () => r(require('@/page/loanrate/loanrateList')), 'loanrateList');

const routes = [
	{ path: '/', component: login },
	{
		path: '/manage',
		component: manage,
		name: '',
		children: [
		    { path: '', component: home, meta: []},
            { path: '/loanStatusList', component: loanStatusList, meta: ['数据管理', '利率表状态管理']},
            { path: '/userList', component: userList, meta: ['数据管理', '用户列表'] },
            { path: '/loanrateList', component: loanrateList, meta: ['数据管理', '利率管理'] },
            { path: '/loanLists', component: loanLists, meta: ['数据管理', '订单列表'] },
            { path: '/adminList', component: adminList, meta: ['数据管理', '管理员列表'] }
        ]
	}
]

export default new Router({
	routes,
	strict: process.env.NODE_ENV !== 'production'
})
