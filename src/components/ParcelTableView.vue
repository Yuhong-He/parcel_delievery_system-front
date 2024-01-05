<template>
  <div>
    <div class="parcel-table">
      <el-table :data="tableData" empty-text="No data" :row-class-name="tableRowClassName" style="width: 100%">
        <el-table-column label="Parcel ID" width="160">
          <template v-slot="scope">
            <el-link :underline="false" @click="$router.push('/parcel/' + scope.row.id)">
              {{ scope.row.id }}
            </el-link>
          </template>
        </el-table-column>
        <el-table-column v-if="this.userType !== 1" label="Student" width="200">
          <template v-slot="scope">
            {{ scope.row.studentInfo.username }}<br>({{ scope.row.studentInfo.email }})
          </template>
        </el-table-column>
        <el-table-column label="Type" width="90">
          <template v-slot="scope">
            {{ getParcelType(scope.row.type) }}
          </template>
        </el-table-column>
        <el-table-column prop="address" v-if="this.userType !== 1 && this.userType !== 3" label="Address" width="270"></el-table-column>
        <el-table-column prop="status" label="Status"></el-table-column>
        <el-table-column label="Time">
          <template v-slot="scope">
            {{ convertTimestamp(scope.row.timestamp) }}
          </template>
        </el-table-column>
        <el-table-column v-if="this.userType === 1 && showConfirmAddressButtonColumn">
          <template v-slot="scope">
            <el-button icon="el-icon-check" v-if="scope.row.status === 'Broker notified student, waiting confirm address'" @click="confirmAddress(scope.row.id)" plain>Confirm address</el-button>
          </template>
        </el-table-column>
        <el-table-column v-if="this.userType === 2 && showDeliverButtonColumn">
          <template v-slot="scope">
            <el-button icon="el-icon-position" v-if="scope.row.status === 'Student confirmed the address'" @click="deliverConfirm(scope.row.id)" plain>Deliver mail</el-button>
          </template>
        </el-table-column>
        <el-table-column v-if="this.userType === 3 && showCollectButtonColumn">
          <template v-slot="scope">
            <el-button icon="el-icon-goods" v-if="scope.row.status === 'Broker send parcel to Merville Room'" @click="confirmCollect(scope.row.id)" plain>Confirm collected</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="parcel-table-pagination">
      <el-pagination
          background
          @current-change="toPage"
          :current-page="currentPageNumber"
          :page-size="10"
          layout="total, prev, pager, next, jumper"
          :total="total">
      </el-pagination>
    </div>

    <el-dialog
        :visible.sync="deliverConfirmDialog"
        width="30%">
      <span style="font-size: 1.5em">Confirm Deliver?</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deliverConfirmDialog = false">Cancel</el-button>
        <el-button type="primary" @click="deliver">Confirm</el-button>
      </span>
    </el-dialog>
    <el-dialog
        :visible.sync="confirmAddressDialog"
        width="30%">
      <span style="font-size: 1.5em">Confirm Address?</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="confirmAddressDialog = false">Cancel</el-button>
        <el-button type="primary" @click="doConfirmAddress">Confirm</el-button>
      </span>
    </el-dialog>
    <el-dialog
        :visible.sync="confirmCollectDialog"
        width="30%">
      <span style="font-size: 1.5em">Confirm student has collected the parcel.</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="confirmCollectDialog = false">Cancel</el-button>
        <el-button type="primary" @click="doConfirmCollect">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {generalError, unexpectedError} from "@/utils/general";
import {Loading} from "element-ui";
import {mapState} from "vuex";

export default {
  computed: {
    ...mapState('User', ['userType'])
  },
  props: {
    currentPage: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      tableData: [],
      total: 0,
      currentPageNumber: this.currentPage,
      deliverConfirmDialog: false,
      confirmAddressDialog: false,
      confirmCollectDialog: false,
      deliverParcelId: "",
      confirmParcelId: "",
      collectedParcelId: "",
      showConfirmAddressButtonColumn: false,
      showDeliverButtonColumn: false,
      showCollectButtonColumn: false
    }
  },
  mounted() {
    this.getParcelData();
  },
  methods: {
    getParcelData() {
      this.tableData = [];
      let loadingInstance = Loading.service({ fullscreen: true });
      this.$api.listParcel(this.currentPageNumber).then(res => {
        loadingInstance.close();
        this.showConfirmAddressButtonColumn = false;
        this.showDeliverButtonColumn = false;
        if(res.data.code === 200) {
          res.data.data.records.forEach(parcel => {
            if (parcel.lastUpdateDesc === "Receiver Confirmed the address") {
              parcel.lastUpdateDesc = "Student confirmed the address";
                  this.showDeliverButtonColumn = true;
            }
            if (parcel.lastUpdateDesc === "Broker notify receiver") {
              this.showConfirmAddressButtonColumn = true;
              parcel.lastUpdateDesc = "Broker notified student, waiting confirm address";
            }
            if (parcel.lastUpdateDesc === "Broker send parcel to Merville Room") {
              this.showCollectButtonColumn = true;
            }
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
      this.currentPageNumber = val;
      this.getParcelData();
    },
    confirmAddress(id) {
      this.confirmParcelId = id;
      this.confirmAddressDialog = true;
    },
    doConfirmAddress() {
      this.confirmAddressDialog = false;
      let loadingInstance = Loading.service({ fullscreen: true });
      this.$api.confirmAddress(this.confirmParcelId).then(res => {
        loadingInstance.close();
        if(res.data.code === 200) {
          this.getParcelData();
        } else {
          generalError(res.data);
        }
      }).catch(res => {
        unexpectedError(res);
      })
    },
    deliverConfirm(id) {
      this.deliverParcelId = id;
      this.deliverConfirmDialog = true;
    },
    deliver() {
      this.deliverConfirmDialog = false;
      let loadingInstance = Loading.service({ fullscreen: true });
      this.$api.deliverParcel(this.deliverParcelId).then(res => {
        loadingInstance.close();
        if(res.data.code === 200) {
          this.getParcelData();
        } else {
          generalError(res.data);
        }
      }).catch(res => {
        unexpectedError(res);
      })
    },
    confirmCollect(id) {
      this.collectedParcelId = id;
      this.confirmCollectDialog = true;
    },
    doConfirmCollect() {
      this.confirmCollectDialog = false;
      let loadingInstance = Loading.service({ fullscreen: true });
      this.$api.confirmCollected(this.collectedParcelId).then(res => {
        loadingInstance.close();
        if(res.data.code === 200) {
          this.getParcelData();
        } else {
          generalError(res.data);
        }
      }).catch(res => {
        unexpectedError(res);
      })
    },
    tableRowClassName({row, rowIndex}) {
      if (row.status === "Postman delivered the parcel" || row.status === "Student collected parcel") {
        return 'success-row';
      }
      return '';
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
/deep/ .el-table .success-row {
  background: #AFE1AF;
}
</style>
