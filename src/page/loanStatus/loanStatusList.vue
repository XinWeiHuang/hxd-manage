<template>
    <div class="fillcontain">
        <head-top></head-top>
        <el-button type="primary" stlye="margin-left: 20px" @click="add">新增状态</el-button>
        <div class="table_container">
            <el-table :data="tableData" style="width: 100%">
                <el-table-column prop="lable" label="状态" width="150"></el-table-column>
                <el-table-column prop="value" label="KEY" width="80"></el-table-column>
                <el-table-column prop="sortIndex" label="排序" width="80"></el-table-column>
                <el-table-column prop="tips" label="温馨提示" width="400"></el-table-column>
                <el-table-column prop="createTime" label="添加日期" width="200"></el-table-column>
                <el-table-column label="操作" width="160">
                    <template slot-scope="scope" v-if="scope.row.changeable">
                        <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-dialog title="新增状态" :visible.sync="dialogFormVisible">
            <el-form :model="form" ref="form" label-width="140px">
                <el-form-item label="状态" prop="lable">
                    <el-input v-model="form.lable"></el-input>
                </el-form-item>
                <el-form-item label="KEY" prop="value">
                    <el-input v-model="form.value" type="number"></el-input>
                </el-form-item>
                <el-form-item label="温馨提示" prop="tips">
                    <el-input v-model="form.tips"></el-input>
                </el-form-item>
                <el-form-item label="排序" prop="sortIndex">
                    <el-input v-model="form.sortIndex" type="number"></el-input>
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
		getLoanStatus,
		deleteLoanStatus,
		saveLoanStatus
	} from "@/api/getData";
	export default {
		data() {
			return {
				tableData: [],
				dialogFormVisible: false,
				form: {
					findLabelValueDim: null,
					value: null,
                    sortIndex: null,
                    tips: null
				},
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
					this.getLoanStatus();
				} catch (err) {
					console.log("获取数据失败", err);
				}
			},
			async getLoanStatus() {
				try {
					const res = await getLoanStatus();
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
			},
			async resetForm() {
				this.dialogFormVisible = false;
				this.form = {
					label: null,
					value: null,
					sortIndex: null,
                    tips: null
				};
			},
			//提交添加数据
			submitForm(form) {
				this.$refs[form].validate(async valid => {
					if (valid) {
						let result = await saveLoanStatus(this.form);
						if (result.status == 1) {
							this.$message({
								type: "success",
								message: "添加成功"
							});
							this.getLoanStatus();
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
				debugger
				const res = await deleteLoanStatus(row.id)
				if (res.status == 1) {
					this.$message({
						type: 'success',
						message: '删除成功'
					});
					this.getLoanStatus();
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
