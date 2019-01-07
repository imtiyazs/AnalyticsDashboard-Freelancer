<template>
  <div v-if="userLogged" class="animated fadeIn">
    <div class="loader">
      <circle4 v-if="showLoader" style="height:80px;width:80px;"></circle4>
    </div>
    <b-row>
      <b-col sm="6" lg="3">
        <b-card
          no-body
          style="height: 150px;background-color: #00BCD4;color: white;"
        >
          <b-card-body class="pb-0">
            <h1 class="mb-0">{{this.dashboardData.totalFilesUploaded}}</h1>
            <p class="card-text">TOTAL FILES UPLOADED</p>
            <img class="card-icons" src="img/bars.png">
          </b-card-body>
          <!-- <card-line3-chart-example
            chartId="card-chart-03"
            class="chart-wrapper"
            style="height:70px;"
            height="70"
          />-->
        </b-card>
      </b-col>
      <b-col sm="6" lg="3">
        <b-card
          @click="reDirectTo('/reporthistory')"
          no-body
          class="bg-danger"
          style="height: 150px;cursor:pointer;"
        >
          <b-card-body class="pb-0">
            <h1 class="mb-0">{{this.dashboardData.totalReportsGenerated}}</h1>
            <p class="card-text">REPORTS GENERATED</p>
            <img class="card-icons" src="img/report.png" style="top: 42px;right: 25px;">
          </b-card-body>
          <!-- <card-bar-chart-example
            chartId="card-chart-04"
            class="chart-wrapper px-3"
            style="height:70px;"
            height="70"
          />-->
        </b-card>
      </b-col>
      <b-col md="6" style="height:100%">
        <b-card border-variant="info" header="Quick Report Analysis">
          <div class="row">
            <div class="col-12 mt-3">
              <form v-on:submit="generateQuickAnalysis">
                <div class="input-group mb-3">
                  <div class="input-group-prepend">
                    <span class="input-group-text">Report Name</span>
                  </div>
                  <input
                    type="text"
                    class="form-control"
                    aria-label="Default"
                    label-for="nameOfReport"
                    aria-describedby="inputGroup-sizing-default"
                    v-model="nameOfReport"
                    required
                  >
                </div>
                <div class="input-group mb-3">
                  <div class="input-group-prepend">
                    <span class="input-group-text">Report Upload</span>
                  </div>
                  <div class="custom-file">
                    <input
                      type="file"
                      id="file"
                      ref="file"
                      accept=".sav, .xls, .xlsx, .csv"
                      class="custom-file-input"
                      v-on:change="handleFileUpload"
                      :plain="true"
                      required
                    >
                    <label class="custom-file-label">{{uploadInputLabel}}</label>
                  </div>
                </div>

                <b-button type="submit" variant="primary" class="float-right mt-4">
                  <i class="icon-pie-chart"></i> Generate Report Analysis
                </b-button>
              </form>
            </div>
          </div>
        </b-card>
      </b-col>
    </b-row>
    <!--  -->
    <b-modal ref="showReportQuickView" size="lg" hide-footer title="Quick Report Analysis">
      <div class="loader" style="top: 40%;left: 45%;">
        <circle4 v-if="showLoader" style="height:80px;width:80px;"></circle4>
      </div>
      <b-card-group>
        <div class="card">
          <div class="card-body" style="overflow-y: scroll;overflow-x: hidden; height: 480px;">
            <div class="mb-3">
              Report Name:
              <span
                style="font-size: 20px;font-weight: 500;"
              >{{CapitalizeFirstLetter(nameOfReport)}}</span>
            </div>
            <!-- Iterate columns  -->
            <div v-for="(value, key) in JSONObject" :value="{key:value}" :key="key">
              <div class="row">
                <div class="col-12">
                  <div class="card">
                    <b-card-header header-tag="header" class="p-1" role="tab">
                      <b-btn block href="#" v-b-toggle="key" variant="light">
                        <h5 class="text-left mb-0">
                          <span style="font-size: 12px;">Column Name:</span>
                          {{ CapitalizeFirstLetter(key)}}
                        </h5>
                      </b-btn>
                    </b-card-header>

                    <b-collapse :id="key">
                      <div class="card-body">
                        <div class="row">
                          <!-- Bar Chart Display -->
                          <div class="col-6">
                            <b-card header="Bar Chart">
                              <div class="chart-wrapper">
                                <BarCharts
                                  :datasetBar="returnFrequency(value)"
                                  chartId="chart-bar-01"
                                />
                              </div>
                            </b-card>
                          </div>

                          <!-- Pie Chart Display -->
                          <div class="col-6">
                            <b-card header="Pie Chart">
                              <div class="chart-wrapper">
                                <PieCharts
                                  :datasetPie="returnFrequency(value)"
                                  chartId="chart-pie-01"
                                />
                              </div>
                            </b-card>
                          </div>
                        </div>
                      </div>
                    </b-collapse>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </b-card-group>
    </b-modal>
  </div>
</template>

<script>
import CardLine1ChartExample from "./dashboard/CardLine1ChartExample";
import CardLine2ChartExample from "./dashboard/CardLine2ChartExample";
import CardLine3ChartExample from "./dashboard/CardLine3ChartExample";
import CardBarChartExample from "./dashboard/CardBarChartExample";
import MainChartExample from "./dashboard/MainChartExample";
import SocialBoxChartExample from "./dashboard/SocialBoxChartExample";
import CalloutChartExample from "./dashboard/CalloutChartExample";
import { Callout } from "@coreui/vue";
import axios from "axios";
import router from "../router";
import vue2Dropzone from "vue2-dropzone";
import "vue2-dropzone/dist/vue2Dropzone.min.css";
import { Circle4 } from "vue-loading-spinner";

import BarCharts from "@/views/pages/ChartComponent/BarCharts";
import PieCharts from "@/views/pages/ChartComponent/PieCharts";

export default {
  name: "dashboard",
  components: {
    Callout,
    CardLine1ChartExample,
    CardLine2ChartExample,
    CardLine3ChartExample,
    CardBarChartExample,
    MainChartExample,
    SocialBoxChartExample,
    CalloutChartExample,
    vueDropzone: vue2Dropzone,
    Circle4,
    BarCharts,
    PieCharts
  },
  data: function() {
    return {
      user: {},
      userLogged: false,
      displayDropZone: true,
      showLoader: false,
      nameOfReport: "",
      uploadInputLabel: "Select File (.sav, .xls, .xlsx, .csv)",
      fileObject: null,
      userProfileData: {
        username: "",
        email: "",
        lastlogin: "",
        role: ""
      },
      dashboardData: {
        totalFilesUploaded: 0,
        totalReportsGenerated: 0,
        lastReportSummary: null
      },
      latestDashboard: [],
      JSONObject: []
    };
  },
  methods: {
    // Capitalize the first letter
    CapitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    },

    // Creating Quick Analysis Report
    generateQuickAnalysis: function(e) {
      e.preventDefault();
      this.showLoader = true;
      let formData = new FormData();
      formData.append("reportname", this.nameOfReport);
      formData.append("file", this.fileObject);
      axios
        .post("/o/uploadfiles", formData, {
          headers: {
            username: this.userProfileData.username,
            "Content-Type": "application/x-www-form-urlencoded"
          }
        })
        .then(response => {
          this.JSONObject = response.data.dataValues;
          this.showLoader = false;
          return true;
        })
        .catch(function(error) {
          this.$toaster.error(error.response.data);
          this.showLoader = false;
          return false;
        });

      this.$refs.showReportQuickView.show();
    },

    // Handled uploaded file object
    handleFileUpload() {
      this.fileObject = this.$refs.file.files[0];
      this.uploadInputLabel = this.$refs.file.files[0].name;
    },

    // Capitalize the first letter
    CapitalizeFirstLetter(string) {
      if (string !== undefined)
        return string.charAt(0).toUpperCase() + string.slice(1);
      return "";
    },

    // Redirect to anonther view
    reDirectTo(mentionPath) {
      this.$router.push({ path: mentionPath });
    },

    // Returning frequencies to feed chart component sent thorough props
    returnFrequency(arrayObject) {
      let counts = {};
      for (let i = 0; i < arrayObject.length; i++) {
        let num = arrayObject[i];
        counts[num] = counts[num] ? counts[num] + 1 : 1;
      }
      return counts;
    }
  },
  mounted() {
    /** Check User Logged In */
    let self = this;
    this.showLoader = true;
    axios
      .post("/o/user")
      .then(response => {
        this.user = response.data;
        this.userLogged = true;
        this.userProfileData.username = response.data.username;
        this.userProfileData.email = response.data.email;
        this.userProfileData.role = response.data.role;
        this.userProfileData.lastlogin = response.data.lastlogin;

        // If user is logged in send request to fetch dashboard stats
        axios
          .post("/o/getdashboardstats", {
            username: this.userProfileData.username
          })
          .then(response => {
            this.showLoader = false;
            this.dashboardData.totalFilesUploaded =
              response.data.totalFileUploads;
            this.dashboardData.totalReportsGenerated =
              response.data.totalReportUploads;
            this.dashboardData.lastReportSummary =
              response.data.lastReportSummary;
          })
          .catch(errors => {
            this.showLoader = false;
            this.$toaster.error(errors.response.data);
          });
      })
      .catch(errors => {
        this.showLoader = false;
        this.$toaster.error("Session Expired. Please Login Again.");
        router.push("/login");
      });
  }
};
</script>
<style>
*::-webkit-scrollbar {
  width: 3px;
}

*::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
}

*::-webkit-scrollbar-thumb {
  background-color: darkgrey;
  outline: 1px solid slategrey;
}

.loader {
  width: 80px;
  height: 80px;
  height: 8;
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 10;
}

.card-text {
  width: 100px;
  margin: 20px 0 0 0;
  font-weight: 500;
  font-size: 14px;
}

.card-icons {
  position: absolute;
  width: 80px;
  top: 50px;
  right: 30px;
}
</style>
