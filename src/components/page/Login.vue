<template>
  <div class="login-wrap">
    <div class="ms-login">
      <div class="ms-title">后台管理系统</div>
      <el-form :model="form" :rules="rules" ref="form" label-width="0px" class="ms-content">
        <el-form-item prop="telephone">
          <el-input v-model="form.telephone" placeholder="请填写手机号">
            <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" placeholder="password" v-model="form.password" @keyup.enter.native="submitForm('form')">
            <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
          </el-input>
        </el-form-item>
        <div class="login-btn">
          <el-button type="primary" @click="submitForm('form')">登录</el-button>
        </div>
        <!-- <p class="login-tips">Tips : 用户名和密码随便填。</p> -->
      </el-form>
    </div>
  </div>
</template>

<script>
  // import { loginUrl,ERR_OK,ajax } from '../api/index'
  export default {
    data: function() {
      return {
        form: {
          telephone: '13958777778',
          password: '666666'
        },
        rules: {
          telephone: [{
            required: true,
            message: '请填写手机号',
            trigger: 'blur'
          }],
          password: [{
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          }]
        }
      }
    },
    methods: {
      submitForm(formName) {
        var that = this;
        let _this = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            var params = {
              telephone: _this.form.telephone,
              password: _this.form.password,
            }
            _this.$ajax.ajax(_this.$api.login, 'GET', params, function(res) {
              console.log('res', res);
              // this.addlOrEditVisible = false;
              // _this.$message.success(`${_this.visibleType=='add'?'添加':'修改'} ${_this.form.name} 信息成功`);
              //==============
              if (res.code == _this.$api.ERR_OK) {
                console.log('token', res.data.token);
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('_USERINFO_', JSON.stringify(res.data.assistAdminUserVo));
                _this.$router.push({
                  path: '/home'
                });
              }
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      }
    }
  }
</script>

<style scoped>
  .login-wrap {
    position: relative;
    width: 100%;
    height: 100%;
    background-image: url(../../assets/img/login-bg.jpg);
    background-size: 100%;
  }

  .ms-title {
    width: 100%;
    line-height: 50px;
    text-align: center;
    font-size: 20px;
    color: #fff;
    border-bottom: 1px solid #ddd;
  }

  .ms-login {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 350px;
    margin: -190px 0 0 -175px;
    border-radius: 5px;
    background: rgba(255, 255, 255, 0.3);
    overflow: hidden;
  }

  .ms-content {
    padding: 30px 30px;
  }

  .login-btn {
    text-align: center;
  }

  .login-btn button {
    width: 100%;
    height: 36px;
    margin-bottom: 10px;
  }

  .login-tips {
    font-size: 12px;
    line-height: 30px;
    color: #fff;
  }
</style>
