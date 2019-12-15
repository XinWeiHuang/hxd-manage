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
 * 查询订单操作日志
 * @param data
 */
export const getOperLogs = loanId => fetch('/loan/logs/' + loanId)
/**
 * 删除贷款记录
 * @param data
 */
export const deleteLoan = loanId => fetch('/loan/' + loanId, {}, "DELETE")
/**
 * 需要订单状态
 * @param data
 */
export const updateLoanStatus = data => fetch('/loan/' + data.orderId, data, 'POST')

/*-------------------------订单状态接口------------------------------*/
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
 *
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
 * api请求量
 */

export const apiCount = date => fetch('/statis/api/' + date + '/count');

/**
 * 所有api请求量
 */

export const apiAllCount = () => fetch('/statis/api/count');


/**
 * 所有api请求信息
 */

export const apiAllRecord = () => fetch('/statis/api/all');

/**
 * 用户注册量
 */

export const userCount = date => fetch('/statis/user/' + date + '/count');

/**
 * 某一天订单数量
 */

export const orderCount = date => fetch('/statis/order/' + date + '/count');


/**
 * 某一天管理员注册量
 */

export const adminDayCount = date => fetch('/statis/admin/' + date + '/count');

/**
 * 管理员列表
 */

export const adminList = data => fetch('/admin/all', data);

/**
 * 管理员数量
 */

export const adminCount = () => fetch('/admin/count');

/**
 * 获取定位城市
 */

export const cityGuess = () => fetch('/v1/cities', {
	type: 'guess'
});

/**
 * 添加商铺
 */

export const addShop = data => fetch('/shopping/addShop', data, 'POST');

/**
 * 获取搜索地址
 */

export const searchplace = (cityid, value) => fetch('/v1/pois', {
	type: 'search',
	city_id: cityid,
	keyword: value
});

/**
 * 获取当前店铺食品种类
 */

export const getCategory = restaurant_id => fetch('/shopping/getcategory/' + restaurant_id);

/**
 * 添加食品种类
 */

export const addCategory = data => fetch('/shopping/addcategory', data, 'POST');


/**
 * 添加食品
 */

export const addFood = data => fetch('/shopping/addfood', data, 'POST');


/**
 * category 种类列表
 */

export const foodCategory = (latitude, longitude) => fetch('/shopping/v2/restaurant/category');

/**
 * 获取餐馆列表
 */

export const getResturants = data => fetch('/shopping/restaurants', data);

/**
 * 获取餐馆详细信息
 */

export const getResturantDetail = restaurant_id => fetch('/shopping/restaurant/' + restaurant_id);

/**
 * 获取餐馆数量
 */

export const getResturantsCount = () => fetch('/shopping/restaurants/count');

/**
 * 更新餐馆信息
 */

export const updateResturant = data => fetch('/shopping/updateshop', data, 'POST');

/**
 * 删除餐馆
 */

export const deleteResturant = restaurant_id => fetch('/shopping/restaurant/' + restaurant_id, {}, 'DELETE');

/**
 * 获取食品列表
 */

export const getFoods = data => fetch('/shopping/v2/foods', data);

/**
 * 获取食品数量
 */

export const getFoodsCount = data => fetch('/shopping/v2/foods/count', data);


/**
 * 获取menu列表
 */

export const getMenu = data => fetch('/shopping/v2/menu', data);

/**
 * 获取menu详情
 */

export const getMenuById = category_id => fetch('/shopping/v2/menu/' + category_id);

/**
 * 更新食品信息
 */

export const updateFood = data => fetch('/shopping/v2/updatefood', data, 'POST');

/**
 * 删除食品
 */

export const deleteFood = food_id => fetch('/shopping/v2/food/' + food_id, {}, 'DELETE');

/**
 * 获取用户列表
 */

export const getUserList = data => fetch('/v1/users/list', data);

/**
 * 获取用户数量
 */

export const getUserCount = data => fetch('/v1/users/count', data);

/**
 * 获取订单列表
 */

export const getOrderList = data => fetch('/bos/orders', data);

/**
 * 获取订单数量
 */

export const getOrderCount = data => fetch('/bos/orders/count', data);

/**
 * 获取用户信息
 */

export const getUserInfo = user_id => fetch('/v1/user/' + user_id);

/**
 * 获取地址信息
 */

export const getAddressById = address_id => fetch('/v1/addresse/' + address_id);

/**
 * 获取用户分布信息
 */

export const getUserCity = () => fetch('/v1/user/city/count');

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



