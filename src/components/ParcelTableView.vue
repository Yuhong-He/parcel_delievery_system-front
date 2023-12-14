<template>
  <div>
    <el-table
        :data="tableData"
        empty-text="No data"
        style="width: 100%">
      <el-table-column
          prop="id"
          label="Parcel ID"
          width="180">
      </el-table-column>
      <el-table-column
          prop="student"
          label="Student"
          width="180">
      </el-table-column>
      <el-table-column
          prop="type"
          label="Type"
          width="180">
      </el-table-column>
      <el-table-column
          prop="address"
          label="Address"
          width="320">
      </el-table-column>
      <el-table-column
          prop="status"
          label="Status">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import {generalError, unexpectedError} from "@/utils/general";
import {Loading} from "element-ui";

export default {
  data() {
    return {
      tableData: []
    }
  },
  mounted() {
    this.getParcelData();
  },
  methods: {
    getParcelData() {
      this.tableData = [];
      let loadingInstance = Loading.service({ fullscreen: true });
      this.$api.listParcel(1).then(res => {
        loadingInstance.close();
        if(res.data.code === 200) {
          console.log(res.data.data.records)
          res.data.data.records.forEach(parcel => {
            this.tableData.push({
              id: parcel.id,
              student: parcel.student,
              type: parcel.type,
              address: parcel.address1 + ", " + parcel.address2,
              status: parcel.last_update_desc
            });
          });
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

</style>
