<template>
    <div class="fillcontain">
        <head-top></head-top>
        <el-button type="primary" stlye="margin-left: 20px" @click="showForm('', 'addStatus', 'dialogFormVisible', '', getIconOps)">新增状态</el-button>
        <el-button type="primary" stlye="margin-left: 20px" @click="showForm('', 'addIcon', 'iconFormVisible')">新增图标</el-button>
        <el-button type="primary" stlye="margin-left: 20px" @click="showForm('', 'viewIcon', 'viewIconVisible','', getIcons)">查看图标</el-button>
        <div class="table_container">
            <el-table :data="tableData" style="width: 100%">
                <el-table-column type="expand">
                    <template slot-scope="props">
                        <el-form label-position="left" inline class="demo-table-expand">
                            <el-form-item label="图标">
                                <span>
                                    <!--<img v-image-preview width="200" height="100" :src="props.row.icon" alt="">-->
                                  <i :class=props.row.icon />
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
                        <el-button size="small" @click="showForm(scope.row, 'edit', 'dialogFormVisible', 'formData')">编辑</el-button>
                        <el-button size="small"  v-if="scope.row.canDelete == 1" type="danger" @click="handleDelete(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-dialog title="图标-新增" :visible.sync="iconFormVisible" @close="closeForm('iconFormVisible', 'iconFormData')">
            <el-form :model="iconFormData" ref="iconFormData" label-width="140px">
                <el-form-item label="图标名称" prop="icon">
                    <el-input v-model="iconFormData.name"/>
                </el-form-item>
                <el-form-item label="图标class" prop="icon">
                    <el-input v-model="iconFormData.icon" v-on:change="handleSelect"/>
                    <i v-show="showIcon" :class="iconValue"/>
                </el-form-item>
                <el-form-item>
                    <el-button style="float:right;" type="primary" @click="submitForm('iconFormVisible', 'iconFormData')">确定</el-button>
                    <el-button style="float:right;margin-right:15px" @click="closeForm('iconFormVisible', 'iconFormData')">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>

        <el-dialog title="状态管理" :visible.sync="dialogFormVisible" @close="closeForm('dialogFormVisible', 'formData')">
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
                    <el-select v-model="formData.sendMessage">
                        <el-option
                            v-for="item in sendMessageOps"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="图标" prop="icon">
                    <el-select v-model="formData.icon" @change="handleSelect">
                        <el-option
                            v-for="item in iconOps"
                            :key="item.icon"
                            :label="item.label"
                            :value="item.icon">
                        </el-option>
                    </el-select>
                    <i v-show="showIcon" :class="iconValue"/>
                </el-form-item>
                <el-form-item label="排序" prop="sortIndex">
                    <el-input v-model="formData.sortIndex" type="number" :disabled="disabled"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button style="float:right;" type="primary" @click="submitForm('dialogFormVisible', 'formData')">确定</el-button>
                    <el-button style="float:right;margin-right:15px" @click="closeForm('dialogFormVisible', 'formData')">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>

        <el-dialog title="查看图标" :visible.sync="viewIconVisible" @close="closeForm('viewIconVisible')">
            <el-table :data="iconTableData" style="width: 100%">
                <el-table-column label="图标名称" prop="name"></el-table-column>
                <el-table-column label="图标class" prop="icon">
                    <template slot-scope="scope">
                        <div v-html='getIcon(scope.row)'></div>
                    </template>
                </el-table-column>
            </el-table>
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
		updateLoanStatus,
		getIconOps,
		addIcon,
		getIcons
	} from "@/api/getData";
	export default {
		data() {
			return {
				tableData: [],
                iconTableData: [],
				dialogFormVisible: false,
				iconFormVisible: false,
				viewIconVisible: false,
				formData: {
					value: null,
                    sortIndex: null,
                    tips: null,
					sendMessage: null,
                    icon: null
				},
				iconFormData: {
					id: '',
                    icon: '',
                    name: '',
				},
                action: baseUrl + "/resource/upload",
				oper : '',
				sendMessageOps: [
                    {label:"是", value: 1},
					{label:"否", value: 0}
                ],
				iconOps: [],
				disabled: false,
				showIcon: false,
                iconValue: '',
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
			showForm(row, oper, visible, form, callable) {
				this[visible] = true;
				this.oper = oper;
				if (row && form) {
                    for (let key in row) {
                    	this[form][key] = row[key];
                    }
                }
				if (row) {
					this.disabled = !row.canDelete == 1;
                }
				if (callable) {
					callable();
                }
			},
            closeForm(visible, form, callable) {
				this[visible] = false;
                for (let key in this[form]) {
                	this[form][key] = '';
                }
				if (callable) {
					callable();
                }
				this.showIcon = false;
				this.iconValue = '';
            },
			resetForm (formData) {
                for (let key in formData) {
					formData[key] = null;
                }
            },
			handleSelect(value){
                this.showIcon = true;
				this.iconValue = value;
			},
			getIcon (data) {
                return data.icon + "（<i class='" + data.icon + "'></i>)";
            },
			//提交添加数据
			submitForm(visible, formData) {
				this.$refs[formData].validate(async valid => {
					if (valid) {
						var result;
						if (this.oper=="addStatus") {
							result = await saveLoanStatus(this[formData]);
                        } else if (this.oper == 'edit'){
							result = await updateLoanStatus(this[formData]);
                        } else if (this.oper == 'addIcon'){
							result = await addIcon(this[formData]);
						}
						if (result.status == 1) {
							this.$message({
								type: "success",
								message: "添加成功"
							});
							this.getLoanStatus();
							this.closeForm(visible, formData)
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
			async getIconOps() {
                const res = await getIconOps();
                this.iconOps = res;
            },
			async getIcons() {
				const res = await getIcons();
				if (res.status == 1) {
					this.iconTableData = res.data;
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
