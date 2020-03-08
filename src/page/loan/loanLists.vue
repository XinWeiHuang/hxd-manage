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
                            <el-form-item label="订单号">
                                <span>{{ props.row.id }}</span>
                            </el-form-item>
                            <el-form-item label="贷款人">
                                <span>{{ props.row.userName }}</span>
                            </el-form-item>
                            <el-form-item label="贷款人电话">
                                <span>{{ props.row.phone }}</span>
                            </el-form-item>
                            <el-form-item label="贷款金额">
                                <span>{{ props.row.money }}</span>
                            </el-form-item>
                            <el-form-item label="收款账户">
                                <span>{{ props.row.receiveAccount }}</span>
                            </el-form-item>
                            <el-form-item label="每月还款">
                                <span>{{ props.row.termMoney }}</span>
                            </el-form-item>
                            <el-form-item label="还款月数">
                                <span>{{ props.row.monthNum }}</span>
                            </el-form-item>
                            <el-form-item label="月利率(%)">
                                <span>{{ props.row.percentMonthRate }}</span>
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
                    width="70"
                    prop="id">
                </el-table-column>
                <el-table-column
                    label="贷款人"
                    prop="userName">
                </el-table-column>
                <el-table-column
                    label="贷款人电话"
                    width="130"
                    prop="phone">
                </el-table-column>
                <el-table-column
                    label="贷款金额(元)"
                    width="100"
                    prop="money">
                </el-table-column>
                <el-table-column
                    label="还款金额(元)"
                    prop="termMoney">
                </el-table-column>
                <el-table-column
                    label="还款月数"
                    prop="monthNum">
                </el-table-column>
                <el-table-column
                    label="状态"
                    width="100"
                    prop="statusName">
                </el-table-column>
                <el-table-column
                    label="更新时间"
                    width="200"
                    prop="updateTime">
                </el-table-column>
                <el-table-column label="操作" width="250">
                    <template slot-scope="scope">
                        <el-button
                            size="small"
                            @click="handleEdit(scope.row)">进度</el-button>
                        <el-button
                            size="small"
                            @click="handleSeeLogs(scope.row)">日志</el-button>
                        <el-button
                            size="small"
                            type="danger"
                            @click="handleDelete(scope.row)">删除</el-button>
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
                <el-form :model="editParam">
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
                    <el-form-item label="备注" label-width="100px">
                        <el-input type="textarea" autosize v-model="editParam.remark" width="180"/>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="updateLoanStatus">确 定</el-button>
                </div>
            </el-dialog>

            <el-dialog title="操作日志" v-model="dialogOperLogsVisible">
                <el-table
                    :data="logsDataTable"
                    :row-key="row => row.index"
                    style="width: 100%">
                    <el-table-column
                        label="修改人"
                        prop="userName">
                    </el-table-column>
                    <el-table-column
                        label="修改前状态"
                        prop="preStatusName">
                    </el-table-column>
                    <el-table-column
                        label="修改后状态"
                        prop="curStatusName">
                    </el-table-column>
                    <el-table-column
                        label="操作时间"
                        width="200"
                        prop="createTime">
                    </el-table-column>
                </el-table>
            </el-dialog>
        </div>
    </div>
</template>

<script>
	import headTop from '@/components/headTop'
	import {getLoanCount, getLoanList, getLoanStatusOps, updateLoan, getOperLogs, deleteLoan} from '@/api/getData'
	export default {
		data(){
			return {
				orderId: null,
				size: 10,
				count: 0,
				tableData: [],
                logsDataTable: [],
				currentPage: 1,
				selectTable: {},
				dialogFormVisible: false,
                dialogOperLogsVisible: false,
				loanStatusOps: [],
				selectMenu: {vaule:'',label: '请选择'},
				selectValue: null,
				expendRow: [],
                editParam : {
                    orderId:'',
                    status:'',
                    remark:''
                }
			}
		},
		created(){
			this.initData();
		},
		computed: {
		},
		components: {
			headTop,
		},
		methods: {
			async initData(){
				try{
					this.getLoanLists();
				}catch(err){
					console.log('获取数据失败', err);
				}
			},
			async getLoanLists() {
				const loanCount = await getLoanCount({});
				if (loanCount.status == 1) {
					this.count = loanCount.data;
				}else{
					throw new Error('获取数据失败');
				}
				const loanLists = await getLoanList({page: this.currentPage, size: this.size});
				this.tableData = loanLists.data;
			},
			tableRowClassName(row, index) {
				if (index === 1) {
					return 'info-row';
				} else if (index === 3) {
					return 'positive-row';
				}
				return '';
			},

			handleSizeChange(val) {
				console.log(`每页 ${val} 条`);
			},

			handleCurrentChange(val) {
				this.currentPage = val;
				this.getLoanLists()
			},

			expand(row, status){
				if (status) {
					this.createFormData(row)
				}else{
					const index = this.expendRow.indexOf(row.index);
					this.expendRow.splice(index, 1)
				}
			},

			handleEdit(row) {
				this.getLoanStatusOps(row);
				this.createFormData(row, 'edit')
				this.dialogFormVisible = true;
			},
			createFormData(row, type){
				this.selectTable = row
                this.editParam.orderId = row.id
				this.selectValue = row.status
                this.editParam.remark = ''
			},
			async getLoanStatusOps(row) {
				var ops = await getLoanStatusOps()
				var exits = false;
				ops.forEach(item=>{
					if (item.value == row.status) {
                        exits = true
						return
					}
				});
                if (!exits) {
					ops.push({label: row.statusName, value:  row.status, index: row.status})
                }
				this.loanStatusOps = ops
			},
			handleSelect(value){
				this.selectValue = value;
			},
            handleDelete(row) {
				var _this = this
				try{
                    this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
						_this.doDelete(row)
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消删除'
                        });
                    });
				} catch (err){
					console.log('s删除失败', err);
				}
            },
            async doDelete(row) {
				const res = await deleteLoan(row.id)
				if (res.status == 1) {
					this.$message({
						type: 'success',
						message: '删除成功'
					});
					this.getLoanLists();
				} else {
					this.$message({
						type: 'error',
						message: res.message
					});
				}
            },
			async handleSeeLogs(row) {
				try{
					const res = await getOperLogs(row.id);
					if (res.status == 1) {
						this.dialogOperLogsVisible = true
                        this.logsDataTable = res.data
					}else{
						throw new Error(res.message)
					}
				}catch(err){
					this.$message({
						type: 'error',
						message: err.message
					});
				}
			},
			async updateLoanStatus(){
				try{
					this.editParam.status = this.selectValue
					const res = await updateLoan(this.editParam)
					if (res.status == 1) {
						this.$message({
							type: 'success',
							message: '操作成功'
						});
						this.dialogFormVisible = false;
						this.getLoanLists();
					}else{
						this.$message({
							type: 'error',
							message: res.message
						});
					}
                } catch (err){
					console.log('操作失败', err);
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
