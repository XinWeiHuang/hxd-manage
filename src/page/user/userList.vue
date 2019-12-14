<template>
  <div class="fillcontain">
    <head-top></head-top>
    <div class="table_container">
      <el-table :data="data" style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="开户行">
                <span>{{ props.row.openBank }}</span>
              </el-form-item>
              <el-form-item label="公司名称">
                <span>{{ props.row.companyName }}</span>
              </el-form-item>
              <el-form-item label="公司地址">
                <span>{{ props.row.companyAddress }}</span>
              </el-form-item>
              <el-form-item label="公司电话">
                <span>{{ props.row.companyPhone }}</span>
              </el-form-item>
              <el-form-item label="职位">
                <span>{{ props.row.position}}</span>
              </el-form-item>
              <el-form-item label="紧急联系人姓名">
                <span>{{ props.row.mainName }}</span>
              </el-form-item>
              <el-form-item label="紧急联系人电话">
                <span>{{ props.row.mainPhone }}</span>
              </el-form-item>
              <el-form-item label="其他联系人">
                <span>{{ props.row.otherName}}</span>
              </el-form-item>
              <el-form-item label="其他联系人电话">
                <span>{{ props.row.otherPhone }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="用户名" prop="name"></el-table-column>
        <el-table-column label="手机号" prop="phone"></el-table-column>
        <el-table-column label="身份证" prop="idcard"></el-table-column>
        <el-table-column label="银行卡" prop="bankCardNum"></el-table-column>
        <el-table-column label="操作" width="160">
          <template slot-scope="scope">
            <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="Pagination" style="text-align: left;margin-top: 10px;">
        <el-pagination
          @current-change="handleChange"
          :page-size="size"
          layout="total, prev, pager, next"
          :total="count"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import headTop from "../../components/headTop";
import { getAdminList, getAdminCount, deleteAdmin } from "@/api/getData";
export default {
  data() {
    return {
      data: [],
      currentRow: null,
      page: 1,
      size: 10,
      count: 0,
      currentPage: 1,
      param: {
        role: 1
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
        const countData = await getAdminCount(this.param);
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
        this.param.page = this.page;
        this.param.size = this.size;
        const res = await getAdminList(this.param);
        if (res.status == 1) {
          this.data = [];
          res.data.forEach(item => {
            const tableItem = {
              createTime: item.createTime,
              name: item.name,
              phone: item.phone,
              id: item.id,
              idcard: item.idcard,
              bankCardNum: item.bankCardNum
            };
            if (item.userWorkInfo) {
              tableItem.companyName = item.userWorkInfo.companyName;
              tableItem.companyAddress = item.userWorkInfo.companyAddress;
              tableItem.companyPhone = item.userWorkInfo.companyPhone;
              tableItem.position = item.userWorkInfo.position;
            }
            if (item.userMainContact) {
              tableItem.mainName = item.userMainContact.name;
              tableItem.mainPhone = item.userMainContact.phone;
            }
            if (item.userOtherContact) {
              tableItem.otherPhone = item.userOtherContact.phone;
              tableItem.otherName = item.userOtherContact.name;
            }
            if (item.userBankCard) {
              tableItem.openBank = item.userBankCard.openBank;
            }
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
      this.$confirm("此操作将删除用户, 是否继续?", "提示", {
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
    handleChange(val) {
      this.page = val;
      this.getAdmin();
    }
  }
};
</script>

<style lang="less">
@import "../../style/mixin";
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
.table_container {
  padding: 20px;
}
.Pagination {
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


