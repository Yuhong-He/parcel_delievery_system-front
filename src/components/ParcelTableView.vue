<template>
  <div>
    <div class="parcel-table">
      <el-table :data="tableData" empty-text="No data" style="width: 100%">
        <el-table-column label="Parcel ID" width="160">
          <template v-slot="scope">
            <el-link :underline="false" @click="$router.push('/parcel/' + scope.row.id)">
              {{ scope.row.id }}
            </el-link>
          </template>
        </el-table-column>
        <el-table-column label="Student" width="200">
          <template v-slot="scope">
            {{ scope.row.studentInfo.username }}<br>({{ scope.row.studentInfo.email }})
          </template>
        </el-table-column>
        <el-table-column label="Type" width="90">
          <template v-slot="scope">
            {{ getParcelType(scope.row.type) }}
          </template>
        </el-table-column>
        <el-table-column prop="address" label="Address" width="270"></el-table-column>
        <el-table-column prop="status" label="Status"></el-table-column>
        <el-table-column label="Time">
          <template v-slot="scope">
            {{ convertTimestamp(scope.row.timestamp) }}
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="parcel-table-pagination">
      <el-pagination
          background
          @current-change="toPage"
          :current-page="currentPage"
          :page-size="10"
          layout="total, prev, pager, next, jumper"
          :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import {generalError, unexpectedError} from "@/utils/general";
import {Loading} from "element-ui";

export default {
  props: {
    currentPage: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      tableData: [],
      total: 0
    }
  },
  mounted() {
    this.getParcelData();
  },
  methods: {
    getParcelData() {
      this.tableData = [];
      let loadingInstance = Loading.service({ fullscreen: true });
      this.$api.listParcel(this.currentPage).then(res => {
        loadingInstance.close();
        if(res.data.code === 200) {
          res.data.data.records.forEach(parcel => {
            this.tableData.push({
              id: parcel.id,
              studentInfo: parcel.studentInfo,
              type: parcel.type,
              address: `${parcel.address1}, ${parcel.address2}`,
              status: parcel.lastUpdateDesc,
              timestamp: parcel.lastUpdateAt
            });
          });
          this.total = res.data.data.total;
        } else {
          generalError(res.data);
        }
      }).catch(res => {
        unexpectedError(res);
      })
    },
    getParcelType(val) {
      switch (val) {
        case 1: return "Package";
        case 2: return "Regular Mail";
        case 3: return "Critical Mail";
      }
    },
    convertTimestamp(val) {
      const date = new Date(val);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
    },
    toPage(val) {
      this.currentPage = val;
      this.getParcelData();
    }
  }
}
</script>

<style lang="less" scoped>
.parcel-table-pagination {
  text-align: center;
  margin-top: 30px;
}
/deep/ .el-table .cell {
  word-break: break-word;
}
.el-link.el-link--default {
  color: #0645AD;
}
.el-link.el-link--default:hover {
  color: #409EFF;
}
.el-link.el-link--default:active {
  color: darkorange;
}
</style>
