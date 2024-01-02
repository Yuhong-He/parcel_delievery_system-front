<template>
  <div>
    <div class="header-bar">
      <el-page-header @back="$router.back()" :content="this.$route.params.id">
      </el-page-header>
    </div>
    <div class="content">
      <el-timeline>
        <el-timeline-item
            v-for="(activity, index) in activities"
            :key="index"
            :timestamp="activity.timestamp">
          {{activity.content}}
        </el-timeline-item>
      </el-timeline>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activities: [{
        content: '活动按期开始',
        timestamp: '2018-04-15'
      }, {
        content: '通过审核',
        timestamp: '2018-04-13'
      }, {
        content: '创建成功',
        timestamp: '2018-04-11'
      }]
    };
  },
  methods: {

  }
}
</script>

<style lang="less" scoped>
.header-bar {
  padding: 25px;
}
.content {
  margin-top: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
