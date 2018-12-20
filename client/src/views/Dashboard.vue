<template>
  <div v-if="userLogged" class="animated fadeIn">
    <div class="loader">
      <circle4 v-if="showLoader" style="height:80px;width:80px;"></circle4>
    </div>
    <b-row>
      <b-col sm="6" lg="3">
        <b-card no-body class="bg-warning">
          <b-card-body class="pb-0">
            <b-dropdown class="float-right" variant="transparent p-0" right>
              <template slot="button-content">
                <i class="icon-settings"></i>
              </template>
              <b-dropdown-item @click="reDirectTo('/reportanalysis')">Generate New Report</b-dropdown-item>
              <!-- <b-dropdown-item @click="reDirectTo('/downloadreports')">Download Report</b-dropdown-item> -->
            </b-dropdown>
            <h4 class="mb-0">{{this.dashboardData.totalFilesUploaded}}</h4>
            <p>Total Files Uploaded</p>
          </b-card-body>
          <card-line3-chart-example
            chartId="card-chart-03"
            class="chart-wrapper"
            style="height:70px;"
            height="70"
          />
        </b-card>
      </b-col>
      <b-col sm="6" lg="3">
        <b-card no-body class="bg-danger">
          <b-card-body class="pb-0">
            <h4 class="mb-0">{{this.dashboardData.totalReportsGenerated}}</h4>
            <p>Reports Generated</p>
          </b-card-body>
          <card-bar-chart-example
            chartId="card-chart-04"
            class="chart-wrapper px-3"
            style="height:70px;"
            height="70"
          />
        </b-card>
      </b-col>
      <b-col sm="6" lg="6">
        <b-card header="Announcements" no-body class="bg-primary">
          <b-card-body style="height: 105px; overflow-x: hidden;overflow-y: auto;">
            <p v-if="this.dashboardData.announcementsArray.length === 0">No New Announcements</p>
            <div v-for="(announcement, key) in this.dashboardData.announcementsArray" :key="key">
              <div>
                <p
                  style="font-size: 12px;position: relative;z-index: 2;"
                >{{ new Date(announcement.creationDate).toDateString() }} : {{ announcement.message }}</p>
              </div>
            </div>
            <card-line1-chart-example
              chartId="card-chart-01"
              class="chart-wrapper px-3"
              :height="70"
              style="position: absolute;top: 80px;right: 0px;"
            />
          </b-card-body>
        </b-card>
      </b-col>
    </b-row>

    <b-row class="mb-3">
      <b-col md="6" style="height:100%">
        <b-card border-variant="info" header="Quick Report Analysis">
          <div class="row">
            <div class="animated fadeIn col-12">
              <b-card-group>
                <div class="card" style="height: 300px;">
                  <div class="card-body">
                    <div class="row">
                      <h5 class="card-title ml-3">Generate Quick Report</h5>
                    </div>
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
                  </div>
                </div>
              </b-card-group>
            </div>
          </div>
        </b-card>
      </b-col>
      <b-col md="6" style="height:100%">
        <div class="row">
          <div class="animated fadeIn col-12">
            <b-card-group>
              <b-card border-variant="info" header="Latest Generated Reports">
                <div class="card">
                  <div class="card-body">
                    <b-row class="mb-4">
                      <b-col cols="2" class="text-center">
                        <b>#</b>
                      </b-col>
                      <b-col>
                        <b>Report Name</b>
                      </b-col>
                      <b-col>
                        <b>Analytics Name</b>
                      </b-col>
                    </b-row>
                    <b-list-group style="height: 190px;overflow-x: hidden;overflow-y: scroll;">
                      <p
                        v-if="latestDashboard.length === 0"
                        class="text-center mt-5"
                      >No Reports Found</p>
                      <b-list-group-item
                        v-for="(singleDashboard, index) in latestDashboard"
                        :key="index"
                      >
                        <div class="row">
                          <b-col cols="2">{{index+1}}</b-col>
                          <b-col>{{ CapitalizeFirstLetter(singleDashboard.reportName)}}</b-col>
                          <b-col>{{CapitalizeFirstLetter(singleDashboard.analyticsDataName)}}</b-col>
                        </div>
                      </b-list-group-item>
                    </b-list-group>
                    <!-- <b-row
                       
                        class="p-10"
                      >
                       
                    </b-row>-->
                  </div>
                </div>
              </b-card>
            </b-card-group>
          </div>
        </div>
      </b-col>
    </b-row>

    <b-row>
      <b-col md="12" v-if="dashboardData.lastReportSummary !== null">
        <b-card border-variant="info" header="Last Report Generated">
          <b-card-group>
            <div class="card">
              <div class="card-body">
                <!-- Report File Name -->
                <div style="padding-left: 20px">
                  <span>
                    Report Name:
                    <span style="font-size: 20px;font-weight: 500;">
                      {{CapitalizeFirstLetter(dashboardData.lastReportSummary.reportName)}}
                      <!-- {{dashboardData.lastReportSummary}} -->
                    </span>
                  </span>
                  <br>
                  <span class="mb-5">
                    Analytic Report Name:
                    <span
                      style="font-size: 20px;font-weight: 500;"
                    >{{CapitalizeFirstLetter(dashboardData.lastReportSummary.analyticsDataName)}}</span>
                  </span>
                </div>
                <!-- <b-button
                      variant="primary"
                      style="position:fixed; bottom: 5%; right:62px;z-index: 10;"
                      @click="createPDF"
                    >
                      <i class="fa fa-download"></i> Download Report PDF
                </b-button>-->
                <div class="card-body">
                  <div ref="printReport" class="row">
                    <div
                      v-if="dashboardData.lastReportSummary !== null"
                      v-for="(singleGraph,index) in dashboardData.lastReportSummary.analyticsData"
                      :key="index"
                      class="col-4"
                    >
                      <div v-if="singleGraph.typeOfGraph ==='BarGraph'">
                        <b-card
                          :header="CapitalizeFirstLetter(singleGraph.columnName)"
                          style="font-weight:500"
                        >
                          <div class="chart-wrapper">
                            <BarCharts
                              :datasetBar="returnFrequency(singleGraph.data)"
                              :columnName="CapitalizeFirstLetter(singleGraph.columnName)"
                              chartId="chart-bar-01"
                            />
                          </div>
                        </b-card>
                      </div>
                      <div v-if="singleGraph.typeOfGraph ==='PieGraph'">
                        <b-card
                          :header="CapitalizeFirstLetter(singleGraph.columnName)"
                          style="font-weight:500"
                        >
                          <div class="chart-wrapper">
                            <PieCharts
                              :datasetPie="returnFrequency(singleGraph.data)"
                              chartId="chart-pie-01"
                            />
                          </div>
                        </b-card>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </b-card-group>
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
        totalFilesUploaded: null,
        totalReportsGenerated: null,
        announcementsArray: null,
        lastReportSummary: null
      },
      // dropzoneOptions: {
      //   url: "https://httpbin.org/post",
      //   acceptedFiles: ".sav,.pdf,.csv,.xlxs,.xls",
      //   dictDefaultMessage:
      //     "<i class='fa fa-cloud-upload'></i> Upload Files (.sav,.pdf,.csv,.xlsx,.xls)",
      //   thumbnailWidth: 150,
      //   maxFilesize: 10,
      //   headers: { "My-Awesome-Header": "header value" }
      // },
      latestDashboard: [],
      JSONObject: []
    };
  },
  methods: {
    CapitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    },
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
          this.$toaster.error(error.response.data)
          this.showLoader = false;
          return false;
        });

      this.$refs.showReportQuickView.show();
    },
    handleFileUpload() {
      this.fileObject = this.$refs.file.files[0];
      this.uploadInputLabel = this.$refs.file.files[0].name;
    },
    CapitalizeFirstLetter(string) {
      if (string !== undefined)
        return string.charAt(0).toUpperCase() + string.slice(1);
      return "";
    },
    reDirectTo(mentionPath) {
      this.$router.push({ path: mentionPath });
    },
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
        //self.$set(this, "user", response.data);
        this.user = response.data;
        this.userLogged = true;
        this.userProfileData.username = response.data.username;
        this.userProfileData.email = response.data.email;
        this.userProfileData.role = response.data.role;
        this.userProfileData.lastlogin = response.data.lastlogin;

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
            this.dashboardData.announcementsArray = response.data.announcements;
            this.dashboardData.lastReportSummary =
              response.data.lastReportSummary;
          })
          .catch(errors => {
            this.showLoader = false;
            this.$toaster.error(errors.response.data);
            //router.push("/login");
          });

        //
        axios
          .post("/o/reporthistory", {
            username: this.userProfileData.username,
            limit: 5
          })
          .then(response => {
            this.latestDashboard = response.data.reports;
            this.dashboardData.lastReportSummary = this.latestDashboard[0];
          })
          .catch(errors => {
            this.showLoader = false;
            this.$toaster.error(errors.repsonse.data);
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
</style>
