<template>
    <div class="fillcontain">
        <head-top></head-top>
        <div class="table_container">
            <el-table
                :data="tableData"
                highlight-current-row
                style="width: 100%">
                <el-table-column
                  type="index"
                  width="100">
                </el-table-column>
                <el-table-column
			      label="订单 ID"
			      prop="orderId">
			    </el-table-column>
                <el-table-column
                  property="username"
                  label="贷款人">
                </el-table-column>
                <el-table-column
                  property="money"
                  label="贷款金额">
                </el-table-column>
                <el-table-column
                  property="monthNum"
                  label="贷款月数">
                </el-table-column>
                <el-table-column
                  property="monthRate"
                  label="月利率">
                </el-table-column>
                <el-table-column
                  property="termMoney"
                  label="每月还款">
                </el-table-column>
                <el-table-column
                  property="receiveBank"
                  label="收款银行">
                </el-table-column>
                <el-table-column
                  property="receiveAccount"
                  label="收款账号">
                </el-table-column>
                 <el-table-column
                  property="createTime"
                  label="申请日期">
                </el-table-column>
			    <el-table-column
			      label="订单状态"
			      prop="status">
			    </el-table-column>
                <el-table-column label="操作" width="160">
                  <template slot-scope="scope">
                    <el-button size="small"
                      @click="handleEdit(scope.row)">通过
                    </el-button>
                    <el-button size="small"
                      type="danger"
                      @click="handleDelete(scope.$index, scope.row)">删除
                    </el-button>
                  </template>
                </el-table-column>

            </el-table>
            <div class="Pagination" style="text-align: left;margin-top: 10px;">
                <el-pagination
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :current-page="currentPage"
                  :page-size="20"
                  layout="total, prev, pager, next"
                  :total="count">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
    import headTop from '../../components/headTop'
    import {getLoanList, getLoanCount} from '@/api/getData'
    export default {
        data(){
            return {
                tableData: [],
                currentRow: null,
                offset: 0,
                limit: 20,
                count: 0,
                currentPage: 1,
            }
        },
    	components: {
    		headTop,
    	},
        created(){
            this.initData();
        },
        methods: {
            async initData(){
                try{
                    const countData = await getLoanCount();
                    console.log(countData,"00000000000000000")
                    if (countData.status == 1) {
                        this.count = countData.count;
                    }else{
                        throw new Error('获取数据失败');
                    }
                    this.getLoans();
                }catch(err){
                    console.log('获取数据失败', err);
                }
            },
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.offset = (val - 1)*this.limit;
                this.getUsers()
            },
            async getLoans(){
                const Users = await getLoanList({offset: this.offset, limit: this.limit});
                this.tableData = [];
                Users.forEach(item => {
                    const tableData = {};
                    console.log(item,"1111111111111111111")
                    tableData.username = item.username;
                    tableData.registe_time = item.registe_time;
                    tableData.city = item.city;
                    this.tableData.push(tableData);
                })
            }
        },
    }
</script>

<style lang="less">
	@import '../../style/mixin';
    .table_container{
        padding: 20px;
    }
</style>
