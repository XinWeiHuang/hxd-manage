<template>
  <div>
    <head-top></head-top>
    <el-row style="margin-top: 20px;">
      <el-col :span="22" :offset="1">
        <el-form :model="form" :rules="rules" ref="form" label-width="140px" class="demo-formData">
          <el-form-item label="客服地址" prop="serviceAddress">
            <el-input v-model="form.serviceAddress" ></el-input>
          </el-form-item>
          <el-form-item label="站点标题" prop="webName">
            <el-input v-model="form.webName" ></el-input>
          </el-form-item>
          <el-form-item label="是否关闭网站" prop="isClose">
            <el-radio v-model="form.isClose" :label= 0>开启</el-radio>
            <el-radio v-model="form.isClose" :label= 1>关闭</el-radio>
          </el-form-item>
          <el-form-item label="关闭网站提示" prop="closeTips">
            <el-input v-model="form.closeTips" placeholder="用,号分开"></el-input>
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
import { getWebInfo, saveWebInfo } from "@/api/getData";
export default {
  data() {
    return {
      form: {
        serviceAddress: null,
        webName: "",
        isClose: 0,
        closeTips: ""
      },
      rules: {
        wenName: [
          //{ required: true, message: '请输入密码称', trigger: 'blur' },
        ],
        closeTips: [
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
        const webInfo = await getWebInfo();
        if (webInfo.status == 1) {
          this.form.id = webInfo.data.id;
          this.form.serviceAddress = webInfo.data.serviceAddress;
          this.form.webName = webInfo.data.webName;
          this.form.isClose = webInfo.data.isClose;
          this.form.closeTips = webInfo.data.closeTips;
          console.log(this.form)
        } else {
          throw new Error("获取数据失败");
        }
      } catch (err) {
        console.log("获取数据失败", err);
      }
    },
    //提交添加数据
    submitForm(form) {
      this.$refs[form].validate(async valid => {
        if (valid) {
          let result = await saveWebInfo(this.form);
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


