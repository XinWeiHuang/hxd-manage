<template>
    <div class="fillcontain">
        <head-top></head-top>
        <el-button type="primary" stlye="margin-left: 20px" @click="add">新增类目</el-button>
        <div class="table_container">
            <el-table :data="tableData" style="width: 100%">
                <el-table-column prop="itemKey" label="类目KEY"></el-table-column>
                <el-table-column prop="itemValue" label="类目名称"></el-table-column>
                <el-table-column prop="createTime" label="创建时间"></el-table-column>
                <el-table-column prop="updateTime" label="更新时间"></el-table-column>
                <el-table-column label="操作" width="160">
                    <template slot-scope="scope">
                        <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
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
        </div>

        <el-dialog title="新增类目" :visible.sync="dialogFormVisible">
            <el-form :model="form" ref="form" label-width="140px">
                <el-form-item label="类目KEY" prop="value">
                    <el-input v-model="form.itemKey" type="number"></el-input>
                </el-form-item>
                <el-form-item label="类目名称" prop="lable">
                    <el-input v-model="form.itemValue"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button style="float:right;" type="primary" @click="submitForm('form')">确定</el-button>
                    <el-button style="float:right;margin-right:15px" @click="resetForm">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
	import headTop from "../../components/headTop";
	import {
		getArticleItems,
		deleteArticleItem,
		getItemCount,
		addArticleItem
	} from "@/api/getData";
	export default {
		data() {
			return {
				tableData: [],
				dialogFormVisible: false,
				form: {
					itemKey: null,
					itemValue: null
				},
				size: 10,
				count: 0,
				currentPage: 1,
				rules: {
					month: [
						//{ required: true, message: '请输入密码称', trigger: 'blur' },
					],
					rate: [
						// { required: true, message: '请输入联系电话' },
						// { type: 'number', message: '电话号码必须是数字' }
					]
				}
			};
		},
		components: {
			headTop
		},
		created() {
			this.initData();
		},
		methods: {
			async initData() {
				try {
					this.getArticleItems();
				} catch (err) {
					console.log("获取数据失败", err);
				}
			},
			async getArticleItems() {
				try {
					const itemCount = await getItemCount();
					if (itemCount.status == 1) {
						this.count = itemCount.data;
					}else{
						throw new Error('获取数据失败');
					}
					const res = await getArticleItems({page: this.currentPage, size: this.size});
					if (res.status == 1) {
						this.tableData = res.data;
					} else {
						throw new Error(res.message);
					}
				} catch (err) {
					console.log("获取数据失败", err);
				}
			},
			add() {
				this.dialogFormVisible = true;
				this.resetForm()
			},
			async resetForm() {
				this.form = {
					itemKey: null,
					itemValue: null
				};
			},
			//提交添加数据
			submitForm(form) {
				this.$refs[form].validate(async valid => {
					if (valid) {
						let result = await addArticleItem(this.form);
						if (result.status == 1) {
							this.$message({
								type: "success",
								message: "添加成功"
							});
							this.getArticleItems();
							this.dialogFormVisible = false;
						} else {
							this.$message({
								type: "error",
								message: result.message
							});
						}
					} else {
						this.$notify.error({
							title: "错误",
							message: "请检查输入是否正确",
							offset: 100
						});
						return false;
					}
				});
			},

			handleDelete(row) {
				var _this = this
				try{
					this.$confirm('删除类目将会同时删除类目下的推文, 是否继续?', '提示', {
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

			handleSizeChange(val) {
				console.log(`每页 ${val} 条`);
			},

			handleCurrentChange(val) {
				this.currentPage = val;
				this.getArticleItems()
			},

			async doDelete(row) {
				debugger
				const res = await deleteArticleItem(row.id)
				if (res.status == 1) {
					this.$message({
						type: 'success',
						message: '删除成功'
					});
					this.getArticleItems();
				} else {
					this.$message({
						type: 'error',
						message: res.message
					});
				}
			},
		}
	};
</script>

<style lang="less">
    @import "../../style/mixin";
    .table_container {
        padding: 20px;
    }
</style>
