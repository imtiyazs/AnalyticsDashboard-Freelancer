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
            <p>Files Uploaded</p>
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
        <b-card header="Announcements" no-body class="bg-primary" style="height: 85%;">
          <b-card-body style="overflow-y: auto;z-index: 110;">
            <ul id="announcements-ul">
              <li
                v-for="(announcement,index) in this.dashboardData.announcementsArray"
                v-bind:key="index"
              >{{ announcement.message }}</li>
            </ul>
          </b-card-body>
          <card-line1-chart-example
            chartId="card-chart-01"
            class="chart-wrapper px-3"
            style=" height: 70px; position: absolute; top: 70px;opacity:0.8"
            :height="70"
          />
        </b-card>
      </b-col>
    </b-row>

    <b-row>
      <b-col md="6" style="height:100%">
        <b-card header="Quick Report Analysis">
          <div class="row">
            <div class="animated fadeIn col-12">
              <b-card-group>
                <div class="card">
                  <div class="card-body">
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
                          accept=".sav, .xls, .xlsx"
                          class="custom-file-input"
                          v-on:change="handleFileUpload"
                          :plain="true"
                        >
                        <label class="custom-file-label">{{uploadInputLabel}}</label>
                      </div>
                    </div>
                    <b-button type="button" variant="primary" class="float-right" @click="generateQuickAnalysis">
                      <i class="icon-pie-chart"></i> Generate Report Analysis
                    </b-button>
                  </div>
                </div>
              </b-card-group>
            </div>
          </div>
        </b-card>
      </b-col>
      <b-col md="6" style="height:100%">
        <b-card header="Latest Generated Report">
          <b-container >
            <b-row>
              <b-col cols="2"><b>#</b></b-col>
              <b-col><b>Report Name</b></b-col>
              <b-col><b>Dashboard Name</b></b-col>
            </b-row>
            <b-row v-for="(singleDashboard, index) in latestDashboard" :key="index" class="p-10">
              <b-col cols="2">{{index+1}}</b-col>
              <b-col>{{singleDashboard.reportName}}</b-col>
              <b-col>{{singleDashboard.analyticsDataName}}</b-col>
            </b-row>
        </b-container>
        </b-card>
      </b-col>
    </b-row>

    <b-row>
      <b-col md="12">
        <b-card header="Last Dashboard Generated Summary">
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
                        <span style="font-size: 20px;font-weight: 500;">
                          {{CapitalizeFirstLetter(dashboardData.lastReportSummary.analyticsDataName)}}
                        </span>
                      </span>
                    </div>
                    <!-- <b-button
                      variant="primary"
                      style="position:fixed; bottom: 5%; right:62px;z-index: 10;"
                      @click="createPDF"
                    >
                      <i class="fa fa-download"></i> Download Report PDF
                    </b-button> -->
                    <div class="card-body">
                      <div ref="printReport" class="row">
                        <div
                          v-for="(singleGraph,index) in dashboardData.lastReportSummary.analyticsData"
                          :key="index"
                          class="col-4">
                          <div v-if="singleGraph.typeOfGraph ==='BarGraph'">
                            <b-card
                              :header="CapitalizeFirstLetter(singleGraph.columnName)"
                              style="font-weight:500"
                            >
                              <div class="chart-wrapper">
                                <BarCharts
                                  :datasetBar="returnFrequency(singleGraph.data)"
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
    <b-modal ref="showReportQuickView" hide-footer title="Quick View of Your Report">
      <b-card-group >
        <div class="card">
          <div class="card-body">
            <span>
              Report Name:
              <span
                style="font-size: 20px;font-weight: 500;"
              >{{CapitalizeFirstLetter(nameOfReport)}}</span>
            </span>
            <!-- Iterate columns  -->
          
              <div v-for="(value, key) in JSONObject" :value="{key:value}" :key="key">
                <div class="row">
                  <div class="col-10">
                    <div class="card">
                      <div class="card-header">
                        <h5 class="mb-0">
                          <span style="font-size: 12px;">Column Name:</span>
                          {{ CapitalizeFirstLetter(key)}}
                        </h5>
                      </div>

                      <div class="collapse show">
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
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            
              
          </div>
        </div>
      </b-card-group>
    </b-modal>
    <!--  -->

    <!-- User statistics module  -->
    <!-- <b-table
            class="mb-0 table-outline"
            responsive="sm"
            hover
            :items="tableItems"
            :fields="tableFields"
            head-variant="light"
          >
            <div slot="avatar" class="avatar" slot-scope="item">
              <img :src="item.value.url" class="img-avatar" alt>
              <span
                class="avatar-status"
                v-bind:class="{ 'bg-success': item.value.status == 'success',  'bg-warning': item.value.status == 'warning', 'bg-danger': item.value.status == 'danger', 'bg-secondary': item.value.status == '' }"
              ></span>
            </div>
            <div slot="user" slot-scope="item">
              <div>{{item.value.name}}</div>
              <div class="small text-muted">
                <span>
                  <template v-if="item.value.new">New</template>
                  <template v-else>Recurring</template>
                </span>
                | Registered: {{item.value.registered}}
              </div>
            </div>
            <i
              slot="country"
              class="h4 mb-0"
              :class="flag(item.value.flag)"
              slot-scope="item"
              :title="item.value.flag"
              :id="item.value.flag"
            ></i>
            <i class="flag-icon flag-icon-pw h1" title="pw" id="pw"></i>
            <div slot="usage" slot-scope="item">
              <div class="clearfix">
                <div class="float-left">
                  <strong>{{item.value.value}}%</strong>
                </div>
                <div class="float-right">
                  <small class="text-muted">{{item.value.period}}</small>
                </div>
              </div>
              <b-progress
                height="{}"
                class="progress-xs"
                v-model="item.value.value"
                :variant="variant(item.value.value)"
              ></b-progress>
            </div>
            <i slot="payment" slot-scope="item" :class="item.value.icon" style="font-size:24px"></i>
            <div slot="activity" slot-scope="item">
              <div class="small text-muted">Last login</div>
              <strong>{{item.value}}</strong>
            </div>
    </b-table>-->
    <!-- Social site statistics -->
    <!-- <b-row>
      <b-col sm="6" lg="3">
        <div class="brand-card">
          <div class="brand-card-header bg-facebook">
            <i class="fa fa-facebook"></i>
            <div class="chart-wrapper">
              <social-box-chart-example
                chartId="box-chart-01"
                :data="[65, 59, 84, 84, 51, 55, 40]"
              />
            </div>
          </div>
          <div class="brand-card-body">
            <div>
              <div class="text-value">89k</div>
              <div class="text-uppercase text-muted small">friends</div>
            </div>
            <div>
              <div class="text-value">459</div>
              <div class="text-uppercase text-muted small">feeds</div>
            </div>
          </div>
        </div>
      </b-col>
      <b-col sm="6" lg="3">
        <div class="brand-card">
          <div class="brand-card-header bg-twitter">
            <i class="fa fa-twitter"></i>
            <div class="chart-wrapper">
              <social-box-chart-example chartId="box-chart-02" :data="[1, 13, 9, 17, 34, 41, 38]"/>
            </div>
          </div>
          <div class="brand-card-body">
            <div>
              <div class="text-value">973k</div>
              <div class="text-uppercase text-muted small">followers</div>
            </div>
            <div>
              <div class="text-value">1.792</div>
              <div class="text-uppercase text-muted small">tweets</div>
            </div>
          </div>
        </div>
      </b-col>
      <b-col sm="6" lg="3">
        <div class="brand-card">
          <div class="brand-card-header bg-linkedin">
            <i class="fa fa-linkedin"></i>
            <div class="chart-wrapper">
              <social-box-chart-example
                chartId="box-chart-03"
                :data="[78, 81, 80, 45, 34, 12, 40]"
              />
            </div>
          </div>
          <div class="brand-card-body">
            <div>
              <div class="text-value">500+</div>
              <div class="text-uppercase text-muted small">contacts</div>
            </div>
            <div>
              <div class="text-value">292</div>
              <div class="text-uppercase text-muted small">feeds</div>
            </div>
          </div>
        </div>
      </b-col>
      <b-col sm="6" lg="3">
        <div class="brand-card">
          <div class="brand-card-header bg-google-plus">
            <i class="fa fa-google-plus"></i>
            <div class="chart-wrapper">
              <social-box-chart-example
                chartId="box-chart-04"
                :data="[35, 23, 56, 22, 97, 23, 64]"
              />
            </div>
          </div>
          <div class="brand-card-body">
            <div>
              <div class="text-value">894</div>
              <div class="text-uppercase text-muted small">followers</div>
            </div>
            <div>
              <div class="text-value">92</div>
              <div class="text-uppercase text-muted small">circles</div>
            </div>
          </div>
        </div>
      </b-col>
    </b-row>-->
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
      user:{},
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
      latestDashboard:[],
      JSONObject:[]
    };
  },
  methods: {
    generateQuickAnalysis(){
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
          //console.log(response);
          //this.fileName = response.data.fileName;
          //this.fileType = response.data.fileType;
          this.JSONObject = response.data.dataValues;

          // this.firstStepDisplayForm = false;
          // this.secondStepShowLoader = false;
          // this.thirdStepDisplayAnalysis = true;

          return true;
        })
        // On file reading error
        .catch(function(error) {
          console.log(error);
          return false;
          // this.secondStepShowLoader = false;
        });
      
      this.$refs.showReportQuickView.show();
    },
    handleFileUpload() {
      this.fileObject = this.$refs.file.files[0];
      this.uploadInputLabel = this.$refs.file.files[0].name;
    },
   CapitalizeFirstLetter(string) {
     if (string!== undefined)
        return string.charAt(0).toUpperCase() + string.slice(1);
      return ""
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
    },
    
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
            this.$toaster.error("Unable to fetch details");
            //router.push("/login");
          });
          
          // 
          axios
          .post("/o/reporthistory", {
            username: this.userProfileData.username,
            limit:5
          })  
          .then(response => {
            console.log(response.data)
            this.latestDashboard = response.data.reports
            this.dashboardData.lastReportSummary = this.latestDashboard[0]
          })
          .catch(errors => {
            this.showLoader = false;
            this.$toaster.error("Unable to fetch details");
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
