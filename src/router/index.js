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
const systemConfig = r => require.ensure([], () => r(require('@/page/systemConfig/systemConfig')), 'systemConfig');
const articleItems = r => require.ensure([], () => r(require('@/page/articleItem/articleItem')), 'systemConfig');
const articles = r => require.ensure([], () => r(require('@/page/article/article')), 'systemConfig');

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
            { path: '/systemConfig', component: systemConfig, meta: ['数据管理', '贷款配置'] },
            { path: '/loanLists', component: loanLists, meta: ['数据管理', '订单列表'] },
            { path: '/adminList', component: adminList, meta: ['数据管理', '管理员列表'] },
            { path: '/articleItem', component: articleItems, meta: ['数据管理', '推文类目'] },
            { path: '/article', component: articles, meta: ['数据管理', '推文管理'] },
        ]
	}
]

export default new Router({
	routes,
	strict: process.env.NODE_ENV !== 'production'
})
