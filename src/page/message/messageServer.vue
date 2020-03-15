<template>
    <div class="fillcontain">
        <head-top></head-top>
        <div class="table_container">
            <el-table
                :data="tableData"
                style="width: 100%">
                <el-table-column
                    label="服务地址"
                    prop="server"
                    width="350">
                </el-table-column>
                <el-table-column
                    label="企业ID"
                    width="120"
                    prop="uid">
                </el-table-column>
                <el-table-column
                    label="账户"
                    width="200"
                    prop="account">
                </el-table-column>
                <el-table-column
                    label="其它参数"
                    width="300"
                    prop="otherParam">
                </el-table-column>
                <el-table-column
                    label="服务域"
                    width="120"
                    prop="workTypeName">
                </el-table-column>
                <el-table-column
                    label="是否生效"
                    width="120"
                    prop="isWorkName">
                </el-table-column>
                <el-table-column label="操作" width="160">
                    <template slot-scope="scope">
                        <el-button size="small" @click="showForm(scope.row, 'edit', 'dialogFormVisible', 'formData')">编辑</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-dialog title="修改短信" v-model="dialogFormVisible" @close="closeForm('dialogFormVisible', 'formData')">
            <el-form :model="formData">
                <el-form-item label="服务地址" label-width="100px">
                    <el-input type="input" v-model="formData.server" width="180"/>
                </el-form-item>
                <el-form-item label="企业ID" label-width="100px">
                    <el-input type="uid" v-model="formData.uid" width="180"/>
                </el-form-item>
                <el-form-item label="账户" label-width="100px">
                    <el-input type="input" v-model="formData.account" width="180"/>
                </el-form-item>
                <el-form-item label="密码" label-width="100px">
                    <el-input type="password" v-model="formData.password" width="180"/>
                </el-form-item>
                <el-form-item label="其它参数" label-width="100px">
                    <el-input type="textarea" autosize v-model="formData.otherParam" width="180"/>
                </el-form-item>
                <el-form-item label="服务域" label-width="100px">
                    <el-select v-model="formData.workType">
                        <el-option
                            v-for="item in workTypeOps"
                            :key="item.index"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="是否生效" prop="isWork">
                    <el-radio v-model="formData.isWork" :label= 1>开启</el-radio>
                    <el-radio v-model="formData.isWork" :label= 0>关闭</el-radio>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="closeForm('dialogFormVisible', 'formData')">取 消</el-button>
                <el-button type="primary" @click="submitForm('dialogFormVisible', 'formData')">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
	import headTop from '@/components/headTop'
	import {getMessageServers,getWorkTypeOps,updateMessageServer} from '@/api/getData'
	export default {
		data(){
			return {
				tableData:[],
				dialogFormVisible: false,
				formData:{
					id:'',
					server:'',
                    uid:'',
					account:'',
					password:'',
					otherParam:'',
					isWork:'',
					workType:''
                },
                oper:'',
				workTypeOps:[],
            }
		},
		created(){
			this.getTableData();
			this.getWorkTypeOps();
		},
		computed: {
		},
		components: {
			headTop,
		},
		methods: {
			async getTableData() {
                const res = await getMessageServers();
                if(res.status == 1) {
                    this.tableData = res.data
                }
            },
			async getWorkTypeOps() {
				const res = await getWorkTypeOps();
				this.workTypeOps = res;
			},
			showForm(row, oper, visibleName, formName) {//scope.row, 'edit', 'dialogFormVisible', 'formData'
                for (let key in row) {
					this[formName][key] = row[key];
                }
                this.oper = oper;
                this[visibleName] = true;
            },
			closeForm(visibleName, formName) {//scope.row, 'edit', 'dialogFormVisible', 'formData'
				for (let key in this[formName]) {
					this[formName][key] = '';
				}
				this[visibleName] = false;
			},
            async submitForm(visibleName, formName) {
				var result;
				if (this.oper=="edit") {
					result = await updateMessageServer(this[formName]);
				}
				if (result.status == 1) {
					this.$message({
						type: "success",
						message: "修改"
					});
					this.getTableData()
					this.closeForm(visibleName, formName)
				} else {
					this.$message({
						type: "error",
						message: result.message
					});
				}
            }
		},
	}
</script>

<style lang="less">
    @import "../../style/mixin";
    .table_container {
        padding: 20px;
    }
</style>
