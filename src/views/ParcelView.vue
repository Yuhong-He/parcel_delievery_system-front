<template>
  <div>
    <div class="header-bar">
      <el-page-header @back="$router.back()" :content="this.$route.params.id">
      </el-page-header>
    </div>
    <div class="content">
      <el-timeline :reverse="true">
        <el-timeline-item
            v-for="(activity, index) in tracks"
            :key="index"
            size="large"
            :timestamp="activity.timestamp">
          {{activity.content}}
        </el-timeline-item>
      </el-timeline>
    </div>
  </div>
</template>

<script>
import {Loading} from "element-ui";
import {generalError, unexpectedError} from "@/utils/general";

export default {
  data() {
    return {
      tracks: []
    };
  },
  mounted() {
    this.getParcelTracks();
  },
  methods: {
    getParcelTracks() {
      this.tracks = [];
      let loadingInstance = Loading.service({ fullscreen: true });
      this.$api.getParcelTracks(this.$route.params.id).then(res => {
        loadingInstance.close();
        if(res.data.code === 200) {
          res.data.data.forEach(track => {
            if (track.description === "Broker notify receiver") {
              track.description = "This parcel will be sent by a postman. Broker notified the student, waiting to confirm address";
            }
            if (track.description === "Receiver Confirmed the address") {
              track.description = "Student confirmed delivery address";
            }
            this.tracks.push({
              content: track.description,
              timestamp: track.create_at
            })
          })
        } else {
          generalError(res.data);
        }
      }).catch(res => {
        unexpectedError(res);
      })
    }
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
/deep/ .el-timeline-item__content {
  font-size: 1.3em;
}
</style>
