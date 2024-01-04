<template>
  <div class="home">
    <div class="header-bar-area">
      <HeaderBar></HeaderBar>
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
import HeaderBar from "@/components/HeaderBar.vue";
import {mapState} from "vuex";

export default {
  components: {
    StudentView,
    PostmanView,
    MervillStaffView,
    EstateServiceStaffView,
    HeaderBar
  },
  computed: {
    ...mapState('User', ['userType'])
  }
}
</script>

<style lang="less" scoped>
.home {
  height: 100vh;
  width: 100%;
}

.header-bar-area {
  height: 80px;
  line-height: 80px;
  padding-left: 30px;
  padding-right: 30px;
  background-color: #E4E4E4;
}
.content-area {
  width: 80%;
  margin-left: auto;
  margin-right: auto;
  padding-bottom: 40px;
}
</style>
