<template>
  <div class="fillcontain">
    <head-top></head-top>
    <el-button type="primary" stlye="margin-left: 20px" @click="add">添加</el-button>
    <div class="table_container">
      <el-table :data="data" style="width: 100%">
        <el-table-column prop="phone" label="手机号"></el-table-column>
        <el-table-column prop="role" label="角色"></el-table-column>
        <el-table-column label="操作" width="160">
          <template slot-scope="scope">
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

    <el-dialog title="添加管理员" :visible.sync="dialogFormVisible">
      <el-form :model="adminForm" :rules="rules" ref="adminForm" label-width="140px">
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="adminForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="adminForm.password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button style="float:right;" type="primary" @click="submitForm('adminForm')">确定</el-button>
          <el-button style="float:right;margin-right:15px" @click="resetForm">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import headTop from "../../components/headTop";
import {
  getAdminList,
  getAdminCount,
  deleteAdmin,
  addAdmin
} from "@/api/getData";
export default {
  data() {
    return {
      data: [],
      currentRow: null,
      offset: 0,
      limit: 20,
      count: 0,
      currentPage: 1,
      rules: {
        password: [
          //{ required: true, message: '请输入密码称', trigger: 'blur' },
        ],
        phone: [
          // { required: true, message: '请输入联系电话' },
          // { type: 'number', message: '电话号码必须是数字' }
        ]
      },
      dialogFormVisible: false,
      adminForm: {
        password: "",
        phone: ""
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
      //初始化数据
    async initData() {
      try {
        const countData = await getAdminCount();
        if (countData.status == 1) {
          this.count = countData.data;
        } else {
          throw new Error("获取数据失败");
        }
        this.getAdmin();
      } catch (err) {
        console.log("获取数据失败", err);
      }
    },
    // 查询数据列表
    async getAdmin() {
      try {
        const res = await getAdminList();
        if (res.status == 1) {
          this.data = [];
          res.data.forEach(item => {
            const tableItem = {
              createTime: item.createTime,
              role: "管理员",
              phone: item.phone,
              id: item.id
            };
            this.data.push(tableItem);
          });
        } else {
          throw new Error(res.message);
        }
      } catch (err) {
        console.log("获取数据失败", err);
      }
    },
    //根据id删除
    async handleDelete(index, row) {
      try {
        const data = { id: row.id };
        const res = await deleteAdmin(row.id);
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
    //添加按钮
    async add() {
      this.dialogFormVisible = true;
    },
    async resetForm() {
      this.adminForm = {
        password: "",
        phone: ""
      };
    },
    //提交添加数据
    submitForm(form) {
      this.$refs[form].validate(async valid => {
        if (valid) {
          this.adminForm.idcard = "back";
          this.adminForm.idcardResource = "back";
          this.adminForm.role = 0;
          let result = await addAdmin(this.adminForm);
          if (result.status == 1) {
            this.$message({
              type: "success",
              message: "添加成功"
            });
            this.initData();
            this.dialogFormVisible = false;
            this.adminForm = {
              password: "",
              phone: ""
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


