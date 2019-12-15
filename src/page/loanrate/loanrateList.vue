<template>
  <div class="fillcontain">
    <head-top></head-top>
    <el-button type="primary" stlye="margin-left: 20px" @click="add">新增利率</el-button>
    <div class="table_container">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="month" label="月数"></el-table-column>
        <el-table-column prop="rate" label="利率（单位:BP）"></el-table-column>
        <!-- <el-table-column prop="create_time" label="添加日期"></el-table-column> -->
        <el-table-column label="操作" width="160">
          <template slot-scope="scope">
            <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
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
          :total="count"
        ></el-pagination>
      </div>
    </div>
    <el-dialog title="添加月利率" :visible.sync="dialogFormVisible">
      <el-form :model="form" ref="form" label-width="140px">
        <el-form-item label="月数" prop="month">
          <el-input v-model="form.month" type="number"></el-input>
        </el-form-item>
        <el-form-item label="月利率（单位：万）" prop="rate">
          <el-input v-model="form.rate" type="number"></el-input>
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
  getLoanRateList,
  getLoanRateCount,
  deleteLoanRate,
  saveLoanRate
} from "@/api/getData";
export default {
  data() {
    return {
      tableData: [],
      currentRow: null,
      offset: 0,
      limit: 20,
      count: 0,
      currentPage: 1,
      edit: false,
      dialogFormVisible: false,
      form: {
        month: null,
        rate: null
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
        const countData = await getLoanRateCount();
        if (countData.status == 1) {
          this.count = countData.data;
        } else {
          throw new Error("获取数据失败");
        }
        this.getLoanRate();
      } catch (err) {
        console.log("获取数据失败", err);
      }
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.offset = (val - 1) * this.limit;
      this.getLoanRate();
    },
    async getLoanRate() {
      try {
        const param = { split: false };
        const res = await getLoanRateList(param);
        if (res.status == 1) {
          this.tableData = [];
          res.data.forEach(item => {
            const tableItem = {
              month: item.month,
              rate: item.rate,
              id: item.id
            };
            this.tableData.push(tableItem);
          });
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
        month: null,
        rate: null,
        id: null
      };
    },
    //提交添加数据
    submitForm(form) {
      this.$refs[form].validate(async valid => {
        if (valid) {
          let result = await saveLoanRate(this.form);
          if (result.status == 1) {
            this.$message({
              type: "success",
              message: "添加成功"
            });
            this.initData();
            this.dialogFormVisible = false;
            this.adminForm = {
              month: null,
              rate: null
            };
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

    async handleDelete(index, row) {
      this.$confirm("此操作将删除月利率配置, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.doDelete(index, row);
      });
    },
    async doDelete(index, row) {
      try {
        const data = { id: row.id };
        const res = await deleteLoanRate(row.id);
        if (res.status == 1) {
          this.$message({
            type: "success",
            message: "删除成功"
          });
          this.initData();
        } else {
          throw new Error(res.message);
        }
      } catch (err) {
        this.$message({
          type: "error",
          message: err.message
        });
        console.log("删除失败");
      }
    },

    async handleEdit(index, row) {
      this.form.month = row.month;
      this.form.rate = row.rate;
      this.form.id = row.id;
      console.log(this.form);
      this.dialogFormVisible = true;
    }
  }
};
</script>

<style lang="less">
@import "../../style/mixin";
.table_container {
  padding: 20px;
}
</style>


