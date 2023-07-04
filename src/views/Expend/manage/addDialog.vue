<template>
  <!-- 上传竞标 -->
  <el-dialog title="账号绑定" :visible.sync="show" width="35%" max-height="800px" custom-class="dialogJb"
    :close-on-click-modal="false" @close="closeEvent(0)">

    <el-form ref="account" :model="acForm" class="formObj" :rules="rules">
      <el-row :gutter="20">
        <el-col :span="22" class="flexCol">
          <el-form-item label="账号类型">
            <el-radio-group v-model="user_type" @input="readioEvent">
              <el-radio label="京准通" border></el-radio>
              <el-radio label="京牌代理" border></el-radio>
            </el-radio-group>
            <el-tooltip class="dateitem dateitem2" effect="light" content="如提示账号不存在/密码错误请联系您对应主管，修改账号信息"
              placement="bottom-start">
              <span class="el-icon-warning-outline"></span>
            </el-tooltip>
          </el-form-item>
        </el-col>
        <el-col :span="22" class="flexCol">
          <el-form-item :label="user_type === '京牌代理' ? '主账号' : '账号'" prop="username">
            <el-input v-model.trim="acForm.username" :placeholder="user_type === '京牌代理' ? '请输入主账号' : '请输入账号'" clearable>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-col :span="22" class="flexCol">
        <el-form-item label="密码" prop="pwd">
          <el-input v-model.trim="acForm.pwd" show-password placeholder="请输入密码" @blur="blurEvent"
            :disabled="!acForm.username" clearable>
          </el-input>
        </el-form-item>
      </el-col>
      <el-col v-if="user_type === '京牌代理'" :span="22">
        <el-form-item label="账号" prop="mutip">
          <el-select ref="selectref" v-model="acForm.mutip" reserve-keyword filterable multiple placeholder="请选择账号"
            :disabled="disPulldown" :multiple-limit="50">
            <el-option-group label="">
              <el-option disabled value="34567">
                <span class="el-icon-search">输入框内可关键字搜索，单次至多选择50项</span>
              </el-option>
            </el-option-group>
            <el-option v-for="item in options" :key="item" :label="item" :value="item">
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-form>
    <div class="send"></div>
    <span slot="footer" class="dialog-footer ts">
      <el-link class="link" type="primary" icon="el-icon-link" :underline="false"
        href="https://huv8qqoobd.feishu.cn/docx/X3x0d1hABoe8OPxmQNScbYKWnhd" target="_blank">错误提示信息自查表</el-link>
      <div>
        <a class="btnnormal btnnormal_down marginR" @click="closeEvent(0)">
          <div class="el-icon-close btnSize">取消</div>
        </a>
        <el-button v-waves class="el-icon-check" type="primary" @click="saveEvent">保存</el-button>
      </div>
    </span>
  </el-dialog>
</template>
<script>
import {
  multiAccAdd1,
  multiAccAdd2,
  multiAccDown
} from "@/api/api.js";
import Upload from "@/components/upload";
import message from "@/mixin/message";

export default {
  name: "UpDialog",
  components: {
    Upload,
  },
  mixins: [message],
  props: {
    showFlag: {
      type: Boolean
    },
    fromTag: {
      type: Number
    },
  },
  data () {
    return {
      user_type: '京准通',
      acForm: {
        username: '',
        pwd: '',
        mutip: null
      },
      disPulldown: true,
      options: null,
      rules: {
        username: [{
          required: true,
          message: "请输入账户名",
          trigger: ["blur", "change"],
        }],
        pwd: [{
          required: true,
          message: "请输入密码",
          trigger: ["blur", "change"],
        }],
        mutip: [{
          required: true,
          message: "请选择账号",
          trigger: ["blur", "change"],
        }],
      },
    };
  },
  computed: {
    username () {
      return this.acForm.username
    },
    pwd () {
      return this.acForm.pwd
    },
    show: {
      get () {
        return this.showFlag
      },
      set () { }
    },
  },
  watch: {
    username: {
      handler (newval, oldval) {
        this.acForm.pwd = ''
        this.acForm.mutip = ''
        this.options = null
        this.disPulldown = true
      }
    },
    pwd: {
      handler (newval, oldval) {
        this.acForm.mutip = ''
        this.options = null
        this.disPulldown = true
      }
    }
  },
  methods: {
    saveEvent () {
      const vm = this
      vm.$refs.account.validate(valid => {
        if (valid) {
          if (vm.user_type === '京准通') {
            multiAccAdd1({
              account: vm.acForm.username,
              password: vm.acForm.pwd
            }).then(res => {
              if (res.data.code === 10000) {
                vm.$msg({
                  msg: "保存成功"
                });
                vm.closeEvent(true)
              } else if (res.data.code === 10003) {
                vm.openMessageBox({
                  type: "warning",
                  showClose: true,
                  tipTitle: `账号未授权或授权失效`,
                  tipContent: `http://tool.afocus.com.cn/jos/oauth2`,
                  auth: true,
                  dangerouslyUseHTMLString: true,
                  confirmButtonFn: () => { },
                });
              } else {
                vm.$msg({
                  type: "error",
                  msg: res.data.data || res.data.msg,
                });
              }
            })
          } else {
            multiAccAdd2({
              primary_account: vm.acForm.username,
              accounts: vm.acForm.mutip
            }).then(res => {
              if (res.data.code === 10000) {
                vm.$msg({
                  msg: "保存成功"
                });
                vm.closeEvent(true)
              } else {
                vm.$msg({
                  type: "error",
                  msg: res.data.data || res.data.msg,
                });
              }
            })
          }
        }
      })
    },
    blurEvent () {
      if (this.user_type === '京牌代理' && this.acForm.pwd) {
        this.getPullDown()
      }
    },
    getPullDown () {
      const vm = this
      multiAccDown({
        primary_account: vm.acForm.username,
        password: vm.acForm.pwd
      }).then(res => {
        vm.options = null
        vm.disPulldown = res.data.code !== 10000
        if (res.data.code === 10000) {
          vm.options = res.data.data
        } else if (res.data.code === 10003) {
          vm.openMessageBox({
            type: "warning",
            showClose: true,
            tipTitle: `账号未授权或授权失效`,
            tipContent: `http://tool.afocus.com.cn/jos/oauth2`,
            auth: true,
            dangerouslyUseHTMLString: true,
            confirmButtonFn: () => { },
          });
        } else {
          vm.$msg({
            type: "error",
            msg: res.data.msg,
          });
        }
      })
    },
    readioEvent () {
      const vm = this
      vm.$refs.account.resetFields()
      vm.$nextTick(() => {
        vm.$refs.account.clearValidate('mutip')
      })
    },
    closeEvent (tag) {
      const vm = this
      vm.$refs.account.resetFields()
      vm.user_type = '京准通'
      vm.disPulldown = true
      vm.$emit('close', tag)
    },
  },
};
</script>
  
<style lang="less" scoped>
@import 'index';
@import '../../DataApplication/child/index.less';

.link {
  border-bottom: 1px solid #409eff;
}

.dateitem {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: -110px;

  &:before {
    font-size: 22px;
  }

  &.dateitem2 {
    top: 19px;
  }
}
</style>
  