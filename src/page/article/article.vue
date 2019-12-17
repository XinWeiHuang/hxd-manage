<template>
    <div class="fillcontain">
        <head-top></head-top>
        <el-button type="primary" stlye="margin-left: 20px" @click="add">发布推文</el-button>
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
                            <el-form-item label="标题">
                                <span>{{ props.row.title }}</span>
                            </el-form-item>
                            <el-form-item label="类目">
                                <span>{{ props.row.itemName }}</span>
                            </el-form-item>
                            <el-form-item label="内容">
                                <span>{{ props.row.content }}</span>
                            </el-form-item>
                            <el-form-item label="创建时间">
                                <span>{{ props.row.createTime }}</span>
                            </el-form-item>
                            <el-form-item label="修改时间">
                                <span>{{ props.row.updateTime }}</span>
                            </el-form-item>
                        </el-form>
                    </template>
                </el-table-column>
                <el-table-column
                    label="类目"
                    width="70"
                    prop="itemName">
                </el-table-column>
                <el-table-column
                    label="标题"
                    width="70"
                    prop="title">
                </el-table-column>
                <el-table-column
                    label="内容"
                    prop="content">
                </el-table-column>
                <el-table-column
                    label="创建时间"
                    width="200"
                    prop="createTime">
                <el-table-column
                    label="更新时间"
                    width="200"
                    prop="updateTime">
                </el-table-column>
                <el-table-column label="操作" width="250">
                    <template slot-scope="scope">
                        <el-button
                            size="small"
                            @click="handleEdit(scope.row)">编辑</el-button>
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

            <el-dialog title="发布推文" v-model="dialogFormVisible">
                <el-form :model="articleForm">
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
                    <el-button type="primary" @click="updateArticle">确 定</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>
	import headTop from '@/components/headTop'
	import {getArticleCount, getArticleItemOps, getLoanStatusOps, updateArticle, getOperLogs, deleteArticle} from '@/api/getData'
	export default {
		data(){
			return {
				orderId: null,
				currentPage: 1,
				size: 10,
				count: 0,
				tableData: [],
				selectTable: {},
				dialogFormVisible: false,
				itemOps: [],
				selectMenu: {vaule:'',label: '请选择'},
				selectValue: null,
				expendRow: [],
                currentOpe: '',
				articleForm: {
					id: null,
                    title: null,
                    item: null,
                    content: null
                }
			}
		},
		created(){
			this.initData();
			this.initItemOps();
		},
		computed: {
		},
		components: {
			headTop,
		},
		methods: {
			async initItemOps() {
				const itemOps = await getArticleItemOps({page: this.currentPage, size: this.size});
                this.itemOps = itemOps;
            },
			async initData(){
				try{
					this.getArticles();
				}catch(err){
					console.log('获取数据失败', err);
				}
			},
			async getArticles() {
				const count = await getArticleCount({});
				if (count.status == 1) {
					this.count = count.data;
				}else{
					throw new Error('获取数据失败');
				}
				//TODO  分页查询
				const loanLists = await getLoanList({page: this.currentPage, size: this.size});
				this.tableData = loanLists.data;

			},
			openDialog() {
				this.dialogFormVisible = true;
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
				this.getArticles()
			},

			expand(row, status){
				if (status) {
					this.createFormData(row)
				}else{
					const index = this.expendRow.indexOf(row.index);
					this.expendRow.splice(index, 1)
				}
			},
            add () {
				this.openDialog();
                this.currentOpe = "add";
            },
			handleEdit(row) {
				this.openDialog();
				this.currentOpe = "add";
				this.articleForm = row
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
				const res = await deleteArticle(row.id)
				if (res.status == 1) {
					this.$message({
						type: 'success',
						message: '删除成功'
					});
					this.getArticles();
				} else {
					this.$message({
						type: 'error',
						message: res.message
					});
				}
            },
			async submitArticleForm(){
				this.dialogFormVisible = false;
				try{
					var res ;
					if (this.currentOpe == 'add') {
						res = await addArticle(this.articleForm);
                    } else {
						res = await updateArticle(this.articleForm)
                    }
					if (res.status == 1) {
						this.$message({
							type: 'success',
							message: '操作成功'
						});
						this.getArticles();
					}else{
						this.$message({
							type: 'error',
							message: res.message
						});
					}
                } catch (err){
					console.log('更新状态失败', err);
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
