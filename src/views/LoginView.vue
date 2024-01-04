<template>
  <div class="auth-background">
    <div class="auth-container">
      <div class="auth-panel" :class="{active:isLogin}">

        <div class="login-box" v-if="isLogin">
          <el-row>
            <el-col :span="12" :offset="6">
              <div class="b-title">Sign In</div>
              <el-form :model="loginForm" :rules="loginRule" ref="loginForm">
                <el-form-item prop="login_email">
                  <el-input prefix-icon="el-icon-message" placeholder="Email" v-model="loginForm.login_email" clearable></el-input>
                </el-form-item>
                <el-form-item prop="login_password" style="margin-bottom: -5px;">
                  <el-input prefix-icon="el-icon-lock" placeholder="Password" v-model="loginForm.login_password" clearable show-password></el-input>
                </el-form-item>
                <el-form-item prop="login_type">
                  <el-select v-model="loginForm.login_type" clearable placeholder="User Type" style="width: 100%; margin-top: 25px">
                    <el-option
                        v-for="item in userTypeOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-form>
              <el-divider></el-divider>
              <el-button type="goon" @click="login('loginForm')" round :loading="loginLoading">Login</el-button>
            </el-col>
          </el-row>
        </div>

        <div class="register-box" v-else>
          <el-row>
            <el-col :span="12" :offset="6">
              <div class="b-title">Sign Up</div>
              <el-form :model="registerForm" :rules="registerRule" ref="registerForm">
                <el-form-item prop="register_email">
                  <el-input prefix-icon="el-icon-message" placeholder="Email" v-model="registerForm.register_email" clearable autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item prop="register_name">
                  <el-input prefix-icon="el-icon-user-solid" placeholder="Username" v-model="registerForm.register_name" clearable autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item prop="register_password">
                  <el-input prefix-icon="el-icon-lock" placeholder="Password" v-model="registerForm.register_password" clearable show-password autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item prop="register_confirmPassword">
                  <el-input prefix-icon="el-icon-lock" placeholder="Confirm Password" v-model="registerForm.register_confirmPassword" clearable show-password autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item prop="register_type">
                  <el-select v-model="registerForm.register_type" clearable placeholder="User Type" style="width: 100%;">
                    <el-option
                        v-for="item in userTypeOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item style="margin-bottom: 15px;" prop="register_verificationCode">
                  <el-input prefix-icon="el-icon-info" placeholder="Verification Code" v-model="registerForm.register_verificationCode" clearable autocomplete="off">
                    <el-button slot="append" icon="el-icon-s-promotion" id="v-email-btn" :disabled="disableVerificationBtn" :loading="disableVerificationBtn" @click="verificationCode">
                      <span id="v-email-txt">Send</span>
                    </el-button>
                  </el-input>
                </el-form-item>
              </el-form>
              <el-divider></el-divider>
              <el-button type="goon" @click="register('registerForm')" round>Register</el-button>
            </el-col>
          </el-row>
        </div>
      </div>

      <div class="small-box" :class="{active:isLogin}">
        <div class="small-container" v-if="isLogin">
          <div class="s-title">New user?</div>
          <button class="s-button" @click="changeType">Sign Up</button>
        </div>

        <div class="small-container" key="smallContainLogin" v-else>
          <div class="s-title">Have account?</div>
          <button class="s-button" @click="changeType">Sign In</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from "jquery";
import {generalError, unexpectedError} from "@/utils/general";
import {setUserInfo} from "@/utils/user";

export default{
  created() {
    document.title = "Login";
  },
  data(){
    const validateLoginEmail = (rule, value, callback) => {
      const regex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
      if (value === '') {
        callback(new Error("Please enter email"));
      } else if(!regex.test(value)) {
        callback(new Error("Invalid email"));
      } else {
        callback();
      }
    };
    const validateLoginPassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error("Please enter password"));
      } else {
        callback();
      }
    };
    const validateUserType = (rule, value, callback) => {
      if (![1,2,3,4].includes(value)) {
        callback(new Error("Please select user type"));
      } else {
        callback();
      }
    };
    const validateRegisterEmail = (rule, value, callback) => {
      const regex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
      if (value === '') {
        callback(new Error("Please enter email"));
      } else if(!regex.test(value)) {
        callback(new Error("Invalid email"));
      } else {
        callback();
      }
    };
    const validateRegisterUsername = (rule, value, callback) => {
      if (value === '') {
        callback(new Error("Please enter username"));
      } else if(value.trim().length < 2 || value.trim().length > 15) {
        callback(new Error("Length between 1 - 15"));
      } else {
        callback();
      }
    };
    const validateRegisterPassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error("Please enter password"));
      } else if(value.length < 6) {
        callback(new Error("Password at least 6 digits"));
      } else {
        callback();
      }
    };
    const validateRegisterConfirmPassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error("Please enter password again"));
      } else if(value !== this.registerForm.register_password) {
        callback(new Error("Password not matched"));
      } else {
        callback();
      }
    };
    const validateRegisterVerificationCode = (rule, value, callback) => {
      const regex = /^\d{6}$/;
      if (value === '') {
        callback(new Error("Please enter verification code"));
      } else if(!regex.test(value)) {
        callback(new Error("Verification code is 6 digits number"));
      } else {
        callback();
      }
    };

    return {
      isLogin: true,
      resetPwdBox: false,
      loginForm: {
        login_email: '',
        login_password: '',
        login_type: null
      },
      loginRule: {
        login_email: [
          { validator: validateLoginEmail, trigger: 'blur' }
        ],
        login_password: [
          { validator: validateLoginPassword, trigger: 'blur' }
        ],
        login_type: [
          { validator: validateUserType, trigger: 'blur' }
        ]
      },
      registerForm: {
        register_email: '',
        register_name: '',
        register_password: '',
        register_confirmPassword: '',
        register_type: null,
        register_verificationCode: ''
      },
      registerRule: {
        register_email: [
          { validator: validateRegisterEmail, trigger: 'blur' }
        ],
        register_name: [
          { validator: validateRegisterUsername, trigger: 'blur' }
        ],
        register_password: [
          { validator: validateRegisterPassword, trigger: 'blur' }
        ],
        register_confirmPassword: [
          { validator: validateRegisterConfirmPassword, trigger: 'blur' }
        ],
        register_verificationCode: [
          { validator: validateRegisterVerificationCode, trigger: 'blur' }
        ],
        register_type: [
          { validator: validateUserType, trigger: 'blur' }
        ]
      },
      loginLoading: false,
      disableVerificationBtn: false,
      userTypeOptions: [{
        value: 1,
        label: 'Student'
      }, {
        value: 2,
        label: 'Postman'
      }, {
        value: 3,
        label: 'Merville Staff'
      }, {
        value: 4,
        label: 'Estate Service Staff'
      }]
    }
  },
  methods:{
    changeType() {
      this.isLogin = !this.isLogin;
      this.loginForm.login_email = '';
      this.loginForm.login_password = '';
      this.loginForm.login_type = null;
      this.registerForm.register_email = '';
      this.registerForm.register_name = '';
      this.registerForm.register_password = '';
      this.registerForm.register_confirmPassword = '';
      this.registerForm.register_type = null;
      this.registerForm.register_verificationCode = '';
      if(this.isLogin) {
        this.$nextTick(()=>{
          this.$refs["loginForm"].clearValidate();
        })
      } else {
        this.$nextTick(()=>{
          this.$refs["registerForm"].clearValidate();
        })
      }
      clearInterval(this.timer);
      this.restoreEmailBtn();
    },
    login(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.doLogin(this.loginForm.login_email, this.loginForm.login_password, this.loginForm.login_type);
        }
      });
    },
    doLogin(email, password, type) {
      this.loginLoading = true;
      this.$api.login({'email': email, 'password': password, 'type': type}).then(res => {
        if(res.data.code === 200) {
          setUserInfo(res.data.data);
          this.loginLoading = false;
          this.$router.push("/");
          this.$message({
            type: 'success',
            message: "Welcome " + res.data.data.username
          });
        } else if (res.data.code === 206) {
          this.loginLoading = false;
          this.$alert("Incorrect password", {
            confirmButtonText: "Confirm"
          }).catch(() => {});
        } else if (res.data.code === 208) {
          this.loginLoading = false;
          this.$alert("This email hasn\'t been registered as the user type", {
            confirmButtonText: "Confirm"
          }).catch(() => {});
        } else {
          generalError(res.data);
        }
      }).catch(res => {
        unexpectedError(res);
      })
    },
    register(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.doRegister(
              this.registerForm.register_email,
              this.registerForm.register_name,
              this.registerForm.register_password,
              this.registerForm.register_confirmPassword,
              this.registerForm.register_type,
              this.registerForm.register_verificationCode
          );
        }
      });
    },
    doRegister(email, username, pwd, pwd2, type, code) {
      this.$api.register(
          {'email': email, 'username': username, 'password': pwd,
            'password2': pwd2, 'type': type, 'code': code}).then(res => {
        if(res.data.code === 200) {
          this.$message({
            type: 'success',
            message: "Register success"
          });
          clearInterval(this.timer);
          this.restoreEmailBtn();
          this.isLogin = true;
          this.loginForm.login_email = email;
          this.loginForm.login_password = pwd;
          this.loginForm.login_type = type;
        } else if (res.data.code === 218) {
          this.$alert("Never sent a verification code to this email address before", {
            confirmButtonText: "Confirm",
            callback: () => {}
          });
        } else if (res.data.code === 215) {
          this.$alert("The email address already registered with the user type", {
            confirmButtonText: "Confirm",
            callback: () => {}
          });
        } else if (res.data.code === 213 || res.data.code === 214) {
          this.$alert("Verification code incorrect", {
            confirmButtonText: "Confirm",
            callback: () => {}
          });
        } else {
          generalError(res.data);
        }
      }).catch(res => {
        unexpectedError(res);
      })
    },
    verificationCode() {
      const email = this.registerForm.register_email;
      const type = this.registerForm.register_type;
      if(email && email.length > 0 && type) {
        const regex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
        if (regex.test(email) && [1,2,3,4].includes(type)) {
          this.disableVerificationBtn = true;
          this.doSendVerificationEmail(email, type);
        } else {
          this.$alert("Invalid email or user type", {
            confirmButtonText: "Confirm",
            callback: () => {}
          });
        }
      } else {
        this.$alert("Please enter email and select user type", {
          confirmButtonText: "Confirm",
          callback: () => {}
        });
      }
    },
    doSendVerificationEmail (email, type) {
      this.$api.sendVerificationEmail({'email': email, 'type': type}).then(res => {
        this.disableVerificationBtn = false;
        if(res.data.code === 200) {
          $("#v-email-btn").css("cursor", "not-allowed");
          this.countDown();
          this.$message({
            type: 'success',
            duration: 30000,
            showClose: true,
            message: "Verification code sent, if there is no email in the inbox, please check the spam"
          });
        } else if (res.data.code === 211) {
          this.$message({
            type: 'warning',
            message: "Please re-send after 1 minute"
          });
        } else if (res.data.code === 212) {
          this.$message({
            type: 'warning',
            message: "Send email fail, please check email address"
          });
        } else if (res.data.code === 215) {
          this.$alert("The email address already registered", {
            confirmButtonText: "Confirm",
            callback: () => {}
          });
        } else {
          generalError(res.data);
        }
      }).catch(res => {
        unexpectedError(res);
      })
    },
    countDown() {
      clearInterval(this.timer);
      let countDownNum = 60;
      this.timer = setInterval(() => {
        countDownNum--;
        $("#v-email-txt").text(countDownNum + " s");
        if(countDownNum <= 0) {
          clearInterval(this.timer);
          this.restoreEmailBtn();
        }
      },1000);
    },
    restoreEmailBtn() {
      $("#v-email-txt").text("Send");
      $("#v-email-btn").css("cursor", "pointer");
    }
  }
}
</script>

<style lang="less" scoped>
.auth-background {
  height: 100vh;
  min-height: 500px;
  box-sizing: border-box;
  content: "";
  background: url(https://www.ucd.ie/t4media/AboutUCD_Lake_resize.jpg) no-repeat center;
  background-size: cover;
  object-fit: cover;
  display: flex;
  justify-content: center;
  align-items: center;
}

.auth-container {
  width: 60vw;
  min-width: 500px;
  height: 35vw;
  min-height: 510px;
  position: relative;
  display: flex;
  background-color: #fff;
  border-radius: 20px;
  box-shadow: 0 0 3px #f0f0f0,
  0 0 6px #f0f0f0;
}

.auth-panel {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 70%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 30%;
  transform: translateX(0%);
  transition: all 1s;
}

.login-box {
  width: 90%;
  text-align: center;
}

.register-box {
  width: 90%;
  text-align: center;
}

.b-title {
  font-size: 2em;
  font-weight: bold;
  color: rgb(204, 119, 34);
  padding-bottom: 15px;
}

.small-box {
  width: 30%;
  height: 100%;
  background: linear-gradient(135deg, rgb(204, 119, 34), rgb(56,183,145));
  position: absolute;
  top: 0;
  left: 0;
  transform: translateX(0%);
  transition: all 1s;
  border-top-left-radius: inherit;
  border-bottom-left-radius: inherit;
}

.small-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.s-title {
  font-size: 1.5em;
  font-weight: bold;
  color: #fff;
  padding-bottom: 10px;
}

.s-button {
  width: 60%;
  height: 40px;
  border-radius: 24px;
  border: 1px solid #fff;
  outline: none;
  background-color: transparent;
  color: #fff;
  font-size: 1.2em;
  cursor: pointer;
}

.auth-panel.active {
  left: 0;
  transition: all 0.5s;
}

.small-box.active {
  left: 100%;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  border-top-right-radius: inherit;
  border-bottom-right-radius: inherit;
  transform: translateX(-100%);
  transition: all 1s;
}

.el-button--goon.is-active,
.el-button--goon:active {
  background: rgb(204, 119, 34);
  border-color: rgb(204, 119, 34);
  color: #fff;
}

.el-button--goon:focus,
.el-button--goon:hover {
  background: #6B4423;
  border-color: #6B4423;
  color: #fff;
}

.el-button--goon {
  color: #FFF;
  background-color: rgb(204, 119, 34);
  border-color: rgb(204, 119, 34);
}
</style>
