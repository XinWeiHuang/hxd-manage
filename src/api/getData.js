import fetch from '@/config/fetch'

/**
 * 获取贷款数量
 */
export const getLoanCount = () => fetch('/loan/count/');
/**
 * 获取贷款列表
 */
export const getLoanList = data => fetch('/loan/list/', data)
/**
 * 删除贷款记录
 * @param data
 */
export const deleteLoan = loanId => fetch('/loan/' + loanId, {}, "DELETE")
/**
 * 修改订单状态
 * @param data
 */
export const updateLoan = data => fetch('/loan/' + data.orderId, data, 'POST')
/**
 * 查询订单操作日志
 * @param data
 */
export const getOperLogs = loanId => fetch('/loan/logs/' + loanId)

/**
 * 获取订单状态
 */
export const getLoanStatus = () => fetch('/loanStatus')

/**
 * 获取订单状态下拉框
 */
export const getLoanStatusOps = () => fetch('/system/auditStatusOps/')
/**
 * 删除订单状态
 * @param data
 */
export const deleteLoanStatus = data => fetch('/loanStatus/' + data, {}, 'DELETE')
/**
 * 保存订单状态
 * @param data
 */
export const saveLoanStatus = data => fetch('/loanStatus/', data, 'POST')
/**
 * 保存订单状态
 * @param data
 */
export const updateLoanStatus = data => fetch('/loanStatus/' + data.id, data, 'POST')
/**
 * 登陆
 */
export const login = data => fetch('/admin', data, 'POST');

/**
 * 退出
 */

export const signout = () => fetch('/admin/signout', {}, 'POST');

/**
 * 获取用户信息
 */

export const getAdminInfo = () => fetch('/admin');
/**
 * 查询管理员列表
 */

export const getAdminList = data => fetch('/admin/findPage',data);

/**
 * 查询管理员数量
 */
export const getAdminCount = data => fetch('/admin/count',data);

/**
 * 删除管理员
 * @param {管理员id} date
 */
export const deleteAdmin = date => fetch('/admin/delete/'+ date, {}, 'DELETE');

/**
 * 增加管理员
 * @param {*} data
 */
export const addAdmin = data => fetch('/admin/add', data, 'POST');

/**
 * 获取用户钱包
 * @param {*} data
 */
export const getUserWallet = data => fetch('/wallet/findByUserId', data);

/**
 * 修改余额
 * @param {*} data
 */
export const saveWallet = data => fetch('/wallet/save', data, 'POST');

/**
 * 查询提现记录
 * @param {*} data
 */
export const getUserWalletDraw = data => fetch('/walletDraw/findByUserId', data);

/**
 * 查询贷款配置
 */

export const getSystemConfig = data => fetch('/system/find',data);

/**
 * 保存贷款配置
 * @param {*} data
 */
export const saveSystemConfig = data => fetch('/system/save', data, 'POST');
/*===========================推文类目=======================================*/
/**
 * 新增文章类目
 * @param data
 */
export const addArticleItem = data => fetch('/articleItem', data, 'POST');
/**
 *删除文章类目
 */
export const deleteArticleItem = id => fetch('/articleItem/' + id, {}, 'DELETE');
/**
 *修改文章类目
 * @param data
 */
//export const updateArticleItem = data => fetch('/articleItem/' + data.id, data, 'PUT');
/**
 * 查询文章类目
 * @param data
 */
export const getArticleItems = data => fetch('/articleItem/', data, 'GET');
/**
 * 获取文章类目下拉框
 */
export const getArticleItemOps = () => fetch('/articleItem/getDropDown');
/**
 * 获取文章类目数量
 */
export const getItemCount = data => fetch('/articleItem/count', data);
/*===========================推文接口===================================*/
/**
 *新增推文
 * @param data
 */
export const addArticle = data => fetch('/article/', data, "POST");
/**
 * 删除推文
 * @param id
 */
export const deleteArticle = id => fetch('/article/'+id, {}, "DELETE");
/**
 *修改推文
 * @param data
 */
export const updateArticle = data => fetch('/article/'+data.id, data, "POST");
/**
 *查询推文
 * @param data
 */
export const getArticles = data => fetch('/article/', data, "GET");
/**
 *查询推文
 * @param data
 */
export const getArticleCount = data => fetch('/article/count', data, "GET");

/**
 * 查询网站信息配置
 */

export const getWebInfo = data => fetch('/webInfo/find',data);

/**
 * 保存网站信息配置
 * @param {*} data
 */
export const saveWebInfo = data => fetch('/webInfo/save', data, 'POST');

/**
 * 修改用户密码
 * @param {*} data
 */
export const resetPassword = data => fetch('/user/resetPassword', data, 'POST');
/**
 * 修改用户提现密码
 * @param {*} data
 */
export const resetPayPassword = data => fetch('/user/resetPayPassword', data, 'POST');
/**
 * 修改银行卡
 * @param {*} data
 */
export const updateBankCard = data => fetch('/user/bankCard/' + data.id, data, 'POST');
/**
 * 升级VIP TODO
 * @param {*} data
 */
export const updateUserVip = data => fetch('/user/vip/' + data.id, data, 'POST');
/**
 * 新增VIP
 * @param {*} data
 */
export const addVipLevel = data => fetch('/vip', data, 'POST');
/**V
 * 删除VIP等级
 * @param {*} data
 */
export const deleteVipLevel = id => fetch('/vip/' + id, {}, 'DELETE');
/**
 * 获取vip数据
 * @param {*} data
 */
export const getVipLevels = data => fetch('/vip', data, 'GET');
/**
 * 获取vip数据
 * @param {*} data
 */
export const getVipOps = data => fetch('/system/vipLevel', data, 'GET');
/**
 * 获取Icon下拉框
 * @param {*} data
 */
export const getIconOps = () => fetch('/system/icons', {}, 'GET');
/**
 * 新增icon
 * @param {*} data
 */
export const addIcon = data => fetch('/icon', data, 'POST');
/**
 * 获取图标
 * @param {*} data
 */
export const getIcons = () => fetch('/icon', {}, 'GET');

/**
 * 查询短信服务商
 * @param {*} data
 */
export const getMessageServers = () => fetch('/messageServer', {}, 'GET');
/**
 * 获取工作域下拉框
 * @param {*} data
 */
export const getWorkTypeOps = () => fetch('/system/workType', {}, 'GET');
/**
 * 修改等新服务商
 * @param {*} data
 */
export const updateMessageServer = data => fetch('/messageServer/' + data.id, data, 'POST');
