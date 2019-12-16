<template>
  <div>
    <head-top></head-top>
    <el-row style="margin-top: 20px;">
      <el-col :span="22" :offset="1">
        <el-form :model="form" :rules="rules" ref="form" label-width="140px" class="demo-formData">
          <el-form-item label="贷款最小金额" prop="minLoanMoney">
            <el-input v-model="form.minLoanMoney" ></el-input>
          </el-form-item>
          <el-form-item label="贷款最大金额" prop="maxLoanMoney">
            <el-input v-model="form.maxLoanMoney" ></el-input>
          </el-form-item>
          <el-form-item label="初始显示金额" prop="defaultLoanMoney">
            <el-input v-model="form.defaultLoanMoney"></el-input>
          </el-form-item>
          <el-form-item label="允许选择月份" prop="availableMonths">
            <el-input v-model="form.availableMonths" placeholder="用,号分开"></el-input>
          </el-form-item>
          <el-form-item label="初始选择月份" prop="defaultMonth">
            <el-input v-model.number="form.defaultMonth" ></el-input>
          </el-form-item>
          <el-form-item label="万分利" prop="loanRate">
            <el-input v-model="form.loanRate"></el-input>
          </el-form-item>
          <el-form-item label="每月还款日" prop="refundDay">
            <el-input v-model="form.refundDay"></el-input>
          </el-form-item>
          <el-form-item class="button_submit">
            <el-button type="primary" style="float:left;" @click="submitForm('form')">保存</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import headTop from "../../components/headTop";
import { getSystemConfig, saveSystemConfig } from "@/api/getData";
export default {
  data() {
    return {
      form: {
        minLoanMoney: 0,
        maxLoanMoney: 0,
        defaultLoanMoney: 0,
        availableMonths: "",
        defaultMonth: 0,
        loanRate: 0,
        refundDay: 1
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
        const systemConfig = await getSystemConfig();
        if (systemConfig.status == 1) {
          this.form.id = systemConfig.data.id;
          this.form.minLoanMoney = systemConfig.data.minLoanMoney;
          this.form.maxLoanMoney = systemConfig.data.maxLoanMoney;
          this.form.defaultLoanMoney = systemConfig.data.defaultLoanMoney;
          this.form.availableMonths = systemConfig.data.availableMonths;
          this.form.defaultMonth = systemConfig.data.defaultMonth;
          this.form.loanRate = systemConfig.data.loanRate;
          this.form.refundDay = systemConfig.data.refundDay;
        } else {
          throw new Error("获取数据失败");
        }
        this.getLoanRate();
      } catch (err) {
        console.log("获取数据失败", err);
      }
    },
    //提交添加数据
    submitForm(form) {
      this.$refs[form].validate(async valid => {
        if (valid) {
          let result = await saveSystemConfig(this.form);
          if (result.status == 1) {
            this.$message({
              type: "success",
              message: "保存成功"
            });
            this.initData();
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
.button_submit {
  text-align: center;
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
.el-table .info-row {
  background: #c9e5f5;
}

.el-table .positive-row {
  background: #e2f0e4;
}
</style>


