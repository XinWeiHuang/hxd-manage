<template>
    <div class="fillcontain">
        <head-top></head-top>
        <el-button type="primary" stlye="margin-left: 20px" @click="showForm('')">新增状态</el-button>
        <div class="table_container">
            <el-table :data="tableData" style="width: 100%">
                <el-table-column type="expand">
                    <template slot-scope="props">
                        <el-form label-position="left" inline class="demo-table-expand">
                            <el-form-item label="图标">
                                <span>
                                  <img v-image-preview width="200" height="100" :src="props.row.icon" alt="">
                                </span>
                            </el-form-item>
                            <el-form-item label="添加日期">
                                <span>{{ props.row.createTime }}</span>
                            </el-form-item>
                        </el-form>
                    </template>
                </el-table-column>
                <el-table-column prop="lable" label="状态" width="150"></el-table-column>
                <el-table-column prop="value" label="KEY" width="80"></el-table-column>
                <el-table-column prop="sortIndex" label="排序" width="80"></el-table-column>
                <el-table-column prop="sendMessageName" label="短信" width="80"></el-table-column>
                <el-table-column prop="tips" label="提示" width="400"></el-table-column>
                <el-table-column label="操作" min-width="160">
                    <template slot-scope="scope">
                        <el-button size="small" @click="showForm(scope.row)">编辑</el-button>
                        <el-button size="small"  v-if="scope.row.canDelete == 1" type="danger" @click="handleDelete(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-dialog title="状态管理" :visible.sync="dialogFormVisible">
            <el-form :model="formData" ref="formData" label-width="140px">
                <el-form-item label="状态" prop="lable">
                    <el-input v-model="formData.lable" :disabled="disabled"></el-input>
                </el-form-item>
                <el-form-item label="KEY" prop="value">
                    <el-input v-model="formData.value" type="number" :disabled="disabled"></el-input>
                </el-form-item>
                <el-form-item label="温馨提示" prop="tips">
                    <el-input v-model="formData.tips"></el-input>
                </el-form-item>
                <el-form-item label="是否发送短信" prop="sendMessgae">
                    <el-select v-model="formData.sendMessage" @change="handleSelect">
                        <el-option
                            v-for="item in sendMessageOps"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="排序" prop="sortIndex">
                    <el-input v-model="formData.sortIndex" type="number" :disabled="disabled"></el-input>
                </el-form-item>
                <el-form-item label="上传状态图标">
                    <el-upload
                        class="avatar-uploader"
                        :action= action
                        :show-file-list="false"
                        :on-success="handleUploadScucess"
                        :before-upload="beforeUpload">
                        <img v-if="formData.icon" width="200" height="100" :src="formData.icon" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item>
                    <el-button style="float:right;" type="primary" @click="submitForm('formData')">确定</el-button>
                    <el-button style="float:right;margin-right:15px" @click="closeForm">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
	import headTop from "../../components/headTop";
	import { baseUrl } from '../../config/env';
	import {
		getLoanStatus,
		deleteLoanStatus,
		saveLoanStatus,
		updateLoanStatus
	} from "@/api/getData";
	export default {
		data() {
			return {
				tableData: [],
				dialogFormVisible: false,
				formData: {
					value: null,
                    sortIndex: null,
                    tips: null,
					sendMessage: null,
                    icon: null
				},
                action: baseUrl + "/resource/upload",
				oper : '',
				sendMessageOps: [
                    {label:"是", value: 1},
					{label:"否", value: 0}
                ],
				disabled: false,
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
			showForm(data) {
				this.dialogFormVisible = true;
				this.resetForm(this.formData);
               // this.$refs.formData.resetField();
				this.oper ="add";
				if (data) {
					for (let key in data) {
						this.formData[key] = data[key];
                    }
					this.disabled = data.canDelete == 0;
					this.oper ="edit";
                }
			},
            closeForm() {
				this.dialogFormVisible = false;
				this.disabled = false;
            },
			resetForm (formData) {
                for (let key in formData) {
					formData[key] = null;
                }
            },
			handleSelect(value){
			},
			//提交添加数据
			submitForm(formData) {
				this.$refs[formData].validate(async valid => {
					if (valid) {
						var result;
						if (this.oper=="add") {
							result = await saveLoanStatus(this.formData);
                        } else {
							result = await updateLoanStatus(this.formData);
                        }
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

			handleUploadScucess(res, file) {
				if (res.status == 1) {
					this.formData.icon = res.data.fullPath;
				}else{
					this.$message.error('上传图片失败！');
				}
			},

			beforeUpload(file) {
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
