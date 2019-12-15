<template>
  <div class="fillcontain">
    <head-top></head-top>
    <div class="table_container">
      <el-table :data="data" style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="学历">
                <span>{{ props.row.education }}</span>
              </el-form-item>
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
              <el-form-item label="身份证正面">
                <span>
                  <img v-image-preview width="200" height="100" :src="props.row.frontImageUrl" alt="">
                </span>
              </el-form-item>
              <el-form-item label="身份证反面">
                <span>
                  <img v-image-preview width="200" height="100" :src="props.row.oppositeImageUrl" alt="">
                </span>
              </el-form-item>
              <el-form-item label="手持身份证">
                <span>
                  <img v-image-preview width="200" height="100" :src="props.row.holdCardImageUrl" alt="">
                </span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="用户名" prop="name"></el-table-column>
        <el-table-column label="手机号" prop="phone" width="150"></el-table-column>
        <el-table-column label="身份证" prop="idcard" width="200"></el-table-column>
        <el-table-column label="银行卡" prop="bankCardNum" width="200"></el-table-column>
        <el-table-column label="余额" prop="money"></el-table-column>
        <el-table-column label="操作" width="300">
          <template slot-scope="scope">
            <el-button size="small" @click="handleWallet(scope.$index, scope.row)">修改钱包</el-button>
            <el-button size="small" @click="handleWalletDraw(scope.$index, scope.row)">提现记录</el-button>
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
    <el-dialog title="钱包信息" :visible.sync="dialogFormVisible">
      <el-form :model="form" ref="form" label-width="140px">
        <el-form-item label="当前余额" prop="money">
          <el-input v-model="form.newMoney"></el-input>
        </el-form-item>
        <el-form-item label="修改余额" prop="newMoney">
          <el-input v-model="form.money"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button style="float:right;" type="primary" @click="submitForm('form')">修改</el-button>
          <el-button style="float:right;margin-right:15px" @click="resetForm">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog title="提现记录" :visible.sync="walletDrawVisible">
      <el-table :data="drawData" style="width: 100%">
        <el-table-column label="提现金额" prop="drawMoney"></el-table-column>
        <el-table-column label="提现时间" prop="createTime"></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import headTop from "../../components/headTop";
import {
  getAdminList,
  getAdminCount,
  deleteAdmin,
  getUserWallet,
  saveWallet,
  getUserWalletDraw
} from "@/api/getData";
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
      form: {
        money: 0,
        newMoney: 0
      },
      walletDrawVisible: false,
      drawData: []
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
              bankCardNum: item.bankCardNum,
              money: item.money
            };
            const money = item.money ? item.money : 0;
            tableItem.money = money;
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
            if (item.idCardInfo) {
              tableItem.frontImageUrl = item.idCardInfo.frontImageUrl;
              tableItem.oppositeImageUrl = item.idCardInfo.oppositeImageUrl;
              tableItem.holdCardImageUrl = item.idCardInfo.holdCardImageUrl;
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
    },
    async handleWallet(index, row) {
      try {
        const param = { userId: row.id };
        const wallet = await getUserWallet(param);
        if (wallet.status == 1) {
          this.form.money = wallet.data.money;
          this.form.newMoney = wallet.data.money;
          this.form.id = wallet.data.id;
          this.form.userId = row.id;
          this.dialogFormVisible = true;
        } else {
          throw new Error("获取数据失败");
        }
      } catch (err) {
        console.log("获取数据失败", err);
      }
    },
    resetForm() {
      this.form.id = null;
      this.form.money = 0;
      this.form.newMoney = 0;
      this.form.userId = null;
      this.dialogFormVisible = false;
    },
    submitForm(form) {
      this.$refs[form].validate(async valid => {
        if (valid) {
          let result = await saveWallet(this.form);
          if (result.status == 1) {
            this.$message({
              type: "success",
              message: "修改成功"
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
    },
    async handleWalletDraw(index, row) {
      this.drawData = [];
      try {
        const param = { userId: row.id };
        const walletDrawData = await getUserWalletDraw(param);
        if (walletDrawData.status == 1) {
          walletDrawData.data.forEach(item => {
            const tableItem = {
              createTime: item.createTime,
              drawMoney: item.drawMoney
            };
            this.drawData.push(tableItem);
          });
        } else {
          throw new Error("获取数据失败");
        }
      } catch (err) {
        console.log("获取数据失败", err);
      }
      this.walletDrawVisible = true;
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


