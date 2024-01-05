<template>
  <div>
    <div class="btn-area">
      <el-button type="primary" @click="openAddParcelDialog()">Add Parcel</el-button>
    </div>
    <div>
      <ParcelTableView ref="parcelTableViewRef" :currentPage="page"></ParcelTableView>
    </div>

    <el-dialog
      title="Add Parcel"
      :visible.sync="displayAddDialog"
      :close-on-click-modal="false"
      width="30%"
      center>
      <el-form label-position="right" label-width="120px" :model="parcelForm" :rules="parcelRule" ref="parcelForm">
        <el-form-item label="Type" prop="type">
          <el-select v-model="parcelForm.type" clearable placeholder="Please select" style="width: 100%;">
            <el-option
                v-for="item in parcelTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="UCD Residence" prop="address1">
          <el-select v-model="parcelForm.address1" clearable placeholder="Please select" style="width: 100%;">
            <el-option
                v-for="item in ucdResidenceOptions"
                :key="item.value"
                :label="item.value"
                :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Room" prop="address2">
          <el-input type="textarea" placeholder="E.g. house 3, apt 6, room 5" v-model="parcelForm.address2"></el-input>
        </el-form-item>
        <el-form-item label="Student" prop="student">
          <el-select
              v-model="parcelForm.student"
              filterable
              remote
              clearable
              style="width: 100%;"
              placeholder="Please search"
              :remote-method="searchStudent"
              :loading="loading"
              loading-text="Loading..."
              no-data-text="Not found">
            <el-option
                v-for="item in studentOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="displayAddDialog = false">Cancel</el-button>
        <el-button type="primary" @click="submitParcel('parcelForm')">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import ParcelTableView from "@/components/ParcelTableView.vue";
import {generalError, unexpectedError} from "@/utils/general";
import {Loading} from "element-ui";

export default {
  components: {
    ParcelTableView
  },
  data() {
    const validateNotNull = (rule, value, callback) => {
      if (!value) {
        callback(new Error("Please select"));
      } else {
        callback();
      }
    };
    const validateNotEmpty = (rule, value, callback) => {
      if (value === '') {
        callback(new Error("Please input"));
      } else {
        callback();
      }
    };

    return {
      displayAddDialog: false,
      parcelForm: {
        type: null,
        address1: "",
        address2: "",
        student: null
      },
      parcelRule: {
        type: [
          { validator: validateNotNull, trigger: 'blur' }
        ],
        address1: [
          { validator: validateNotEmpty, trigger: 'blur' }
        ],
        address2: [
          { validator: validateNotEmpty, trigger: 'blur' }
        ],
        student: [
          { validator: validateNotNull, trigger: 'blur' }
        ]
      },
      parcelTypeOptions: [{
        value: 1,
        label: 'Package'
      }, {
        value: 2,
        label: 'Regular Mail'
      }, {
        value: 3,
        label: 'Critical Mail'
      }],
      ucdResidenceOptions: [{
        value: "Ashfield"
      }, {
        value: "Belgrove"
      }, {
        value: "Blackrock"
      }, {
        value: "Glenomena"
      }, {
        value: "Merville"
      }, {
        value: "Proby"
      }, {
        value: "Roebuck Hall"
      }, {
        value: "Roebuck Castle"
      }, {
        value: "Village"
      }],
      loading: false,
      studentOptions: [],
      page: 1
    }
  },
  methods: {
    openAddParcelDialog() {
      this.parcelForm.type = null;
      this.parcelForm.address1 = "";
      this.parcelForm.address2 = "";
      this.parcelForm.student = null;
      if (this.$refs["parcelForm"]) {
        this.$nextTick(() => {
          this.$refs["parcelForm"].clearValidate();
        });
      }
      this.displayAddDialog = true
    },
    searchStudent(query) {
      if (query !== '') {
        this.loading = true;
        this.getStudentOptions(query);
      } else {
        this.studentOptions = [];
      }
    },
    getStudentOptions(query) {
      this.studentOptions = [];
      this.$api.searchStudentByName(query).then(res => {
        if(res.data.code === 200) {
          this.loading = false;
          res.data.data.forEach(user => {
            this.studentOptions.push({
              value: user.id,
              label: user.username + " / " + user.email
            });
          });
        } else {
          generalError(res.data);
        }
      }).catch(res => {
        unexpectedError(res);
      })
    },
    submitParcel(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.doSubmit(
              {
                type: this.parcelForm.type,
                address1: this.parcelForm.address1,
                address2: this.parcelForm.address2,
                student: this.parcelForm.student
              }
          );
        }
      });
    },
    doSubmit(data) {
      let loadingInstance = Loading.service({ fullscreen: true });
      this.$api.createParcel(data).then(res => {
        loadingInstance.close();
        if(res.data.code === 200) {
          this.$message({
            message: "Add Success",
            type: 'success'
          });
          this.page = 1;
          this.displayAddDialog = false;
          this.$refs.parcelTableViewRef.getParcelData();
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
.btn-area {
  line-height: 70px;
}
</style>
