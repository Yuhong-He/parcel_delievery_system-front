<template>
  <div class="home">
    <div class="header-bar-area">
      <el-row>
        <el-col :span="12">
          <div class="header-bar-area-left">
            {{ username }} ({{ convertTypeName(userType) }})
          </div>
        </el-col>
        <el-col :span="12">
          <div class="header-bar-area-right">
            <el-button type="info" round @click="logout()">Logout</el-button>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="content-area">
      <StudentView v-if="userType === 1"></StudentView>
      <PostmanView v-if="userType === 2"></PostmanView>
      <MervillStaffView v-if="userType === 3"></MervillStaffView>
      <EstateServiceStaffView v-if="userType === 4"></EstateServiceStaffView>
    </div>
  </div>
</template>

<script>

import StudentView from "@/views/Home/StudentView.vue";
import PostmanView from "@/views/Home/PostmanView.vue";
import MervillStaffView from "@/views/Home/MervillStaffView.vue";
import EstateServiceStaffView from "@/views/Home/EstateServiceStaffView.vue";
import {mapState} from "vuex";
import {cleanUserInfo} from "@/utils/user";

export default {
  components: {
    StudentView,
    PostmanView,
    MervillStaffView,
    EstateServiceStaffView
  },
  computed: {
    ...mapState('User', ['username', 'userType'])
  },
  created() {
    document.title = "Home";
    if (this.username.length === 0 || this.userType === 0) {
      this.$router.push("/login");
    }
  },
  methods: {
    convertTypeName(type) {
      switch (type) {
        case 1: return "Student";
        case 2: return "Postman";
        case 3: return "Mervill Staff";
        case 4: return "Estate Service Staff";
        default: return "Unknown Type";
      }
    },
    logout() {
      this.$confirm("Confirm Logout", {
        confirmButtonText: "Confirm",
        cancelButtonText: "Cancel",
        type: 'warning'
      }).then(() => {
        cleanUserInfo();
        this.$router.push("/login");
        this.$message({
          type: 'success',
          message: "Logout success"
        });
      }).catch(() => {});
    },
  }
}
</script>

<style lang="less" scoped>
.home {
  height: 100vh;
  width: 100%;
}

.header-bar-area {
  height: 10vh;
  line-height: 10vh;
  padding-left: 30px;
  padding-right: 30px;
}
.header-bar-area-left {
  font-size: 20px;
  white-space: nowrap;
}
.header-bar-area-right {
  text-align: right;
}
.content-area {
  width: 80%;
  margin-left: auto;
  margin-right: auto;
  padding-bottom: 40px;
}
</style>
