<template>
    <div class="fillcontain">
        <head-top></head-top>
        <div class="table_container">
            <el-table
                :data="tableData"
                @expand='expand'
                :expand-row-keys='expendRow'
                :row-key="row => row.index"
                style="width: 100%">
                <el-table-column type="expand">
                    <template slot-scope="props">
                        <el-form label-position="left" inline class="demo-table-expand">
                            <el-form-item label="订单id">
                                <span>{{ props.row.orderId }}</span>
                            </el-form-item>
                            <el-form-item label="贷款人电话">
                                <span>{{ props.row.phone }}</span>
                            </el-form-item>
                            <el-form-item label="贷款人">
                                <span>{{ props.row.userName }}</span>
                            </el-form-item>
                            <el-form-item label="贷款金额">
                                <span>{{ props.row.money }}</span>
                            </el-form-item>
                            <el-form-item label="月利率(%)">
                                <span>{{ props.row.percentMonthRate }}</span>
                            </el-form-item>
                            <el-form-item label="收款账户">
                                <span>{{ props.row.receiveAccount }}</span>
                            </el-form-item>
                            <el-form-item label="收款银行">
                                <span>{{ props.row.receiveBank }}</span>
                            </el-form-item>
                            <el-form-item label="还款月数">
                                <span>{{ props.row.monthNum }}</span>
                            </el-form-item>
                            <el-form-item label="每月还款">
                                <span>{{ props.row.termMoney }}</span>
                            </el-form-item>
                            <el-form-item label="申请时间">
                                <span>{{ props.row.createTime }}</span>
                            </el-form-item>
                            <el-form-item label="状态">
                                <span>{{ props.row.statusName }}</span>
                            </el-form-item>
                        </el-form>
                    </template>
                </el-table-column>
                <el-table-column
                    label="订单Id"
                    prop="orderId">
                </el-table-column>
                <el-table-column
                    label="贷款人"
                    prop="userName">
                </el-table-column>
                <el-table-column
                    label="贷款人电话"
                    prop="phone">
                </el-table-column>
                <el-table-column
                    label="贷款金额"
                    prop="money">
                </el-table-column>
                <el-table-column
                    label="每月还款金额"
                    prop="termMoney">
                </el-table-column>
                <el-table-column
                    label="还款月数"
                    prop="monthNum">
                </el-table-column>
                <el-table-column
                    label="状态"
                    prop="statusName">
                </el-table-column>
                <el-table-column
                    label="更新时间"
                    prop="updateTime">
                </el-table-column>
                <el-table-column label="操作" width="160">
                    <template slot-scope="scope">
                        <el-button
                            size="small"
                            @click="handleEdit(scope.row)">编辑</el-button>
                        <el-button
                            size="small"
                            type="danger"
                            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <div class="Pagination">
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-size="size"
                    layout="total, prev, pager, next"
                    :total="count">
                </el-pagination>
            </div>

            <el-dialog title="修改贷款状态" v-model="dialogFormVisible">
                <el-form :model="selectTable">
                    <el-form-item label="订单状态" label-width="100px">
                        <el-select v-model="selectValue" :placeholder="selectMenu.label" @change="handleSelect">
                            <el-option
                                v-for="item in loanStatusOps"
                                :key="item.index"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="updateFood">确 定</el-button>
                </div>
            </el-dialog>


        </div>
    </div>
</template>

<script>
	import headTop from '@/components/headTop'
	import {getLoanCount, getLoanList, getLoanStatusOps} from '@/api/getData'
	export default {
		data(){
			return {
				restaurant_id: null,
				city: {},
				size: 5,
				count: 0,
				tableData: [],
				currentPage: 1,
				selectTable: {},
				dialogFormVisible: false,
				loanStatusOps: [],
				selectMenu: {},
				selectValue: null,
				specsForm: {
					specs: '',
					packing_fee: 0,
					price: 20,
				},
				specsFormrules: {
					specs: [
						{ required: true, message: '请输入规格', trigger: 'blur' },
					],
				},
				specsFormVisible: false,
				expendRow: [],
			}
		},
		created(){
			this.initData();
		},
		computed: {
			specs: function (){
				let specs = [];
				if (this.selectTable.specfoods) {
					this.selectTable.specfoods.forEach(item => {
						specs.push({
							specs: item.specs_name,
							packing_fee: item.packing_fee,
							price: item.price,
						})
					})
				}
				return specs
			}
		},
		components: {
			headTop,
		},
		methods: {
			async initData(){
				try{
					const loanCount = await getLoanCount({});
					if (loanCount.status == 1) {
						this.count = loanCount.data;
					}else{
						throw new Error('获取数据失败');
					}
					this.getLoanLists();
					this.getLoanStatusOps();
				}catch(err){
					console.log('获取数据失败', err);
				}
			},
			async getLoanLists() {
				const loanLists = await getLoanList({page: this.currentPage, size: this.size});
				this.tableData = loanLists.data;
			},
			async getLoanStatusOps() {
		        this.loanStatusOps = await getLoanStatusOps();
	        },

			tableRowClassName(row, index) {
				if (index === 1) {
					return 'info-row';
				} else if (index === 3) {
					return 'positive-row';
				}
				return '';
			},

			addspecs(){
				this.specs.push({...this.specsForm});
				this.specsForm.specs = '';
				this.specsForm.packing_fee = 0;
				this.specsForm.price = 20;
				this.specsFormVisible = false;
			},

			deleteSpecs(index) {
				this.specs.splice(index, 1);
			},

			handleSizeChange(val) {
				console.log(`每页 ${val} 条`);
			},

			handleCurrentChange(val) {
				debugger
				this.currentPage = val;
				this.getLoanLists()
			},
			expand(row, status){
				if (status) {
					this.getSelectItemData(row)
				}else{
					const index = this.expendRow.indexOf(row.index);
					this.expendRow.splice(index, 1)
				}
			},
			handleEdit(row) {
				this.getSelectItemData(row, 'edit')
				this.dialogFormVisible = true;
			},
			async getSelectItemData(row, type){
				const restaurant = await getResturantDetail(row.restaurant_id);
				const category = await getMenuById(row.category_id)
				this.selectTable = {...row, ...{restaurant_name: restaurant.name, restaurant_address: restaurant.address, category_name: category.name}};

				this.selectMenu = {label: category.name, value: row.category_id}
				this.tableData.splice(row.index, 1, {...this.selectTable});
				this.$nextTick(() => {
					this.expendRow.push(row.index);
				})
				if (type == 'edit' && this.restaurant_id != row.restaurant_id) {
					this.getMenu();
				}
			},
			handleSelect(value){
				this.selectValue = value;
				loanStatusOps.forEach(item=>{
                    if (item.value == value) {
						this.selectMenu = item
                        return
                    }
                });
			},
			async handleDelete(index, row) {
				try{
					const res = await deleteFood(row.item_id);
					if (res.status == 1) {
						this.$message({
							type: 'success',
							message: '删除食品成功'
						});
						this.tableData.splice(index, 1);
					}else{
						throw new Error(res.message)
					}
				}catch(err){
					this.$message({
						type: 'error',
						message: err.message
					});
					console.log('删除食品失败')
				}
			},
			handleServiceAvatarScucess(res, file) {
				if (res.status == 1) {
					this.selectTable.image_path = res.image_path;
				}else{
					this.$message.error('上传图片失败！');
				}
			},
			beforeAvatarUpload(file) {
				const isRightType = (file.type === 'image/jpeg') || (file.type === 'image/png');
				const isLt2M = file.size / 1024 / 1024 < 2;

				if (!isRightType) {
					this.$message.error('上传头像图片只能是 JPG 格式!');
				}
				if (!isLt2M) {
					this.$message.error('上传头像图片大小不能超过 2MB!');
				}
				return isRightType && isLt2M;
			},
			async updateFood(){
				this.dialogFormVisible = false;
				try{
					const subData = {new_category_id: this.selectMenu.value, specs: this.specs};
					const postData = {...this.selectTable, ...subData};
					const res = await updateFood(postData)
					if (res.status == 1) {
						this.$message({
							type: 'success',
							message: '更新食品信息成功'
						});
						this.getLoanLists();
					}else{
						this.$message({
							type: 'error',
							message: res.message
						});
					}
				}catch(err){
					console.log('更新餐馆信息失败', err);
				}
			},
		},
	}
</script>

<style lang="less">
    @import '../../style/mixin';
    .demo-table-expand {
        font-size: 0;
    }
    .demo-table-expand label {
        width: 90px;
        color: #99a9bf;
    }
    .demo-table-expand .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        width: 50%;
    }
    .table_container{
        padding: 20px;
    }
    .Pagination{
        display: flex;
        justify-content: flex-start;
        margin-top: 8px;
    }
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
        border-color: #20a0ff;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 120px;
        height: 120px;
        line-height: 120px;
        text-align: center;
    }
    .avatar {
        width: 120px;
        height: 120px;
        display: block;
    }
</style>
