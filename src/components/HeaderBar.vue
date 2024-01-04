<template>
  <div>
    <el-row>
      <el-col :span="12">
        <div class="left">{{ convertTypeName(userType) }}</div>
      </el-col>
      <el-col :span="12">
        <div class="right">
          <span class="username">{{ username }}</span>
          <el-button type="info" @click="logout()">Logout</el-button>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {mapState} from "vuex";
import {cleanUserInfo} from "@/utils/user";

export default {
  computed: {
    ...mapState('User', ['username', 'userType'])
  },
  created() {
    document.title = "Home";
    if (!this.username || this.username.length === 0 || this.userType === 0) {
      this.$router.push("/login");
    }
  },
  methods: {
    convertTypeName(type) {
      switch (type) {
        case 1: return "Student Center";
        case 2: return "Postman Panel";
        case 3: return "Merville Console";
        case 4: return "Estate Service Center";
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

<style scoped lang="less">
.left {
  font-size: 20px;
  white-space: nowrap;
}
.right {
  font-size: 20px;
  text-align: right;
  .username {
    padding-right: 20px;
  }
}
</style>
