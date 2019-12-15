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
export const updateLoanStatus = data => fetch('/loan/' + data.orderId, data, 'POST')
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
 * 查询月利率
 */

export const getLoanRateList = data => fetch('/loanRate/find',data);

/**
 * 查询月利率数量
 */
export const getLoanRateCount = () => fetch('/loanRate/count');

/**
 * 删除月利率
 * @param {id} date
 */
export const deleteLoanRate = date => fetch('/loanRate/delete/'+ date, {}, 'DELETE');

/**
 * 增加月利率
 * @param {*} data
 */
export const saveLoanRate = data => fetch('/loanRate/save', data, 'POST');

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
