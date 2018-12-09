<template>
  <div v-if="userLogged" class="animated fadeIn">
    <b-row>
      <b-col sm="6" lg="3">
        <b-card no-body class="bg-warning">
          <b-card-body class="pb-0">
            <b-dropdown class="float-right" variant="transparent p-0" right>
              <template slot="button-content">
                <i class="icon-settings"></i>
              </template>
              <b-dropdown-item>Generate New Report</b-dropdown-item>
              <b-dropdown-item>Download Report</b-dropdown-item>
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
          <b-card-body style="overflow-y: auto;">
            <ul id="announcements-ul">
              <li
                v-for="announcement in this.dashboardData.announcementsArray"
                v-bind:key="announcement"
              >{{ announcement.message }}</li>
            </ul>
          </b-card-body>
        </b-card>
      </b-col>
    </b-row>

    <b-row>
      <b-col md="12">
        <b-card header="Quick Report Analysis">
          <b-row>
            <b-col sm="12" lg="6">
              <vue-dropzone
                ref="myVueDropzone"
                id="dropzone"
                :options="dropzoneOptions"
                v-on:vdropzone-complete="startLoader"
                v-on:vdropzone-file-added="validateFile"
              ></vue-dropzone>
            </b-col>
            <b-col sm="12" lg="6">
              <h5>Generate Report</h5>
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>

    <b-row>
      <b-col md="12">
        <b-card header="Last Report Summary">
          <b-row>
            <b-col sm="12" lg="6">
              <b-card>
                <b-row>
                  <b-col sm="5">
                    <h5 id="traffic" class="card-title mb-0">Report Visualizer</h5>
                    <div class="small text-muted">Report Name</div>
                    <div class="small text-muted">Generated: 10/10/2050</div>
                  </b-col>
                  <b-col sm="7" class="d-none d-md-block">
                    <b-button type="button" variant="primary" class="float-right">
                      <i class="icon-cloud-download"></i>
                    </b-button>
                    <b-button-toolbar class="float-right" aria-label="Toolbar with buttons group">
                      <b-form-radio-group
                        class="mr-3"
                        id="radiosBtn"
                        buttons
                        button-variant="outline-secondary"
                        name="radiosBtn"
                      >
                        <b-form-radio class="mx-0" value="Day">Day</b-form-radio>
                        <b-form-radio class="mx-0" value="Month">Month</b-form-radio>
                        <b-form-radio class="mx-0" value="Year">Year</b-form-radio>
                      </b-form-radio-group>
                    </b-button-toolbar>
                  </b-col>
                </b-row>
                <main-chart-example
                  chartId="main-chart-01"
                  class="chart-wrapper"
                  style="height:300px;margin-top:40px;"
                  height="300"
                ></main-chart-example>
                <div slot="footer">
                  <b-row class="text-center">
                    <b-col class="mb-sm-2 mb-0">
                      <div class="text-muted">Field 1</div>
                      <strong>201 (40%)</strong>
                      <b-progress
                        height="{}"
                        class="progress-xs mt-2"
                        :precision="1"
                        variant="success"
                        :value="40"
                      ></b-progress>
                    </b-col>
                    <b-col class="mb-sm-2 mb-0 d-md-down-none">
                      <div class="text-muted">Field 2</div>
                      <strong>24 (20%)</strong>
                      <b-progress
                        height="{}"
                        class="progress-xs mt-2"
                        :precision="1"
                        variant="info"
                        :value="20"
                      ></b-progress>
                    </b-col>
                    <b-col class="mb-sm-2 mb-0">
                      <div class="text-muted">Field 3</div>
                      <strong>70 (60%)</strong>
                      <b-progress
                        height="{}"
                        class="progress-xs mt-2"
                        :precision="1"
                        variant="warning"
                        :value="60"
                      ></b-progress>
                    </b-col>
                    <b-col class="mb-sm-2 mb-0">
                      <div class="text-muted">Field 4</div>
                      <strong>22 (80%)</strong>
                      <b-progress
                        height="{}"
                        class="progress-xs mt-2"
                        :precision="1"
                        variant="danger"
                        :value="80"
                      ></b-progress>
                    </b-col>
                  </b-row>
                </div>
              </b-card>
            </b-col>
            <b-col sm="12" lg="6">
              <b-row>
                <b-col sm="12" lg="6">
                  <b-row>
                    <b-col sm="6">
                      <Callout variant="info">
                        <small class="text-muted">New Clients</small>
                        <br>
                        <strong class="h4">9,123</strong>
                        <div class="chart-wrapper" :style="{ top: '-10px'}">
                          <!--<callout-chart-example :data="[35, 23, 56, 22, 97, 23, 64]" variant="#20a8d8" width="80" height="30" />-->
                          <callout-chart-example
                            chartId="callout-chart-01"
                            :data="[35, 23, 56, 22, 97, 23, 64]"
                            variant="info"
                            width="80"
                            height="30"
                          />
                        </div>
                      </Callout>
                    </b-col>
                    <b-col sm="6">
                      <Callout variant="danger">
                        <small class="text-muted">Clients</small>
                        <br>
                        <strong class="h4">223</strong>
                        <div class="chart-wrapper" :style="{ top: '-10px'}">
                          <callout-chart-example
                            chartId="callout-chart-02"
                            :data="[65, 59, 84, 84, 51, 55, 40]"
                            variant="danger"
                            width="80"
                            height="30"
                          />
                        </div>
                      </Callout>
                    </b-col>
                  </b-row>
                  <hr class="mt-0">
                  <div class="progress-group mb-4">
                    <div class="progress-group-prepend">
                      <span class="progress-group-text">Monday</span>
                    </div>
                    <div class="progress-group-bars">
                      <b-progress class="progress-xs" variant="info" :value="34" height="{}"/>
                      <b-progress class="progress-xs" variant="danger" :value="78" height="{}"/>
                    </div>
                  </div>
                  <div class="progress-group mb-4">
                    <div class="progress-group-prepend">
                      <span class="progress-group-text">Tuesday</span>
                    </div>
                    <div class="progress-group-bars">
                      <b-progress height="{}" class="progress-xs" :value="56" variant="info"></b-progress>
                      <b-progress height="{}" class="progress-xs" :value="94" variant="danger"></b-progress>
                    </div>
                  </div>
                  <div class="progress-group mb-4">
                    <div class="progress-group-prepend">
                      <span class="progress-group-text">Wednesday</span>
                    </div>
                    <div class="progress-group-bars">
                      <b-progress height="{}" class="progress-xs" :value="12" variant="info"></b-progress>
                      <b-progress height="{}" class="progress-xs" :value="67" variant="danger"></b-progress>
                    </div>
                  </div>
                  <div class="progress-group mb-4">
                    <div class="progress-group-prepend">
                      <span class="progress-group-text">Thursday</span>
                    </div>
                    <div class="progress-group-bars">
                      <b-progress height="{}" class="progress-xs" :value="43" variant="info"></b-progress>
                      <b-progress height="{}" class="progress-xs" :value="91" variant="danger"></b-progress>
                    </div>
                  </div>
                  <div class="progress-group mb-4">
                    <div class="progress-group-prepend">
                      <span class="progress-group-text">Friday</span>
                    </div>
                    <div class="progress-group-bars">
                      <b-progress height="{}" class="progress-xs" :value="22" variant="info"></b-progress>
                      <b-progress height="{}" class="progress-xs" :value="73" variant="danger"></b-progress>
                    </div>
                  </div>
                  <div class="progress-group mb-4">
                    <div class="progress-group-prepend">
                      <span class="progress-group-text">Saturday</span>
                    </div>
                    <div class="progress-group-bars">
                      <b-progress height="{}" class="progress-xs" :value="53" variant="info"></b-progress>
                      <b-progress height="{}" class="progress-xs" :value="82" variant="danger"></b-progress>
                    </div>
                  </div>
                  <div class="progress-group mb-4">
                    <div class="progress-group-prepend">
                      <span class="progress-group-text">Sunday</span>
                    </div>
                    <div class="progress-group-bars">
                      <b-progress height="{}" class="progress-xs" :value="9" variant="info"></b-progress>
                      <b-progress height="{}" class="progress-xs" :value="69" variant="danger"></b-progress>
                    </div>
                  </div>
                  <div class="legend text-center">
                    <small>
                      <sup>
                        <b-badge pill variant="info">&nbsp;</b-badge>
                      </sup>
                      New clients
                      &nbsp;&nbsp;
                      <sup>
                        <b-badge pill variant="danger">&nbsp;</b-badge>
                      </sup>
                      Recurring clients
                    </small>
                  </div>
                </b-col>
                <b-col sm="12" lg="6">
                  <b-row>
                    <b-col sm="6">
                      <Callout variant="warning">
                        <small class="text-muted">Pageviews</small>
                        <br>
                        <strong class="h4">78,623</strong>
                        <div class="chart-wrapper" :style="{ top: '-10px'}">
                          <callout-chart-example
                            chartId="callout-chart-03"
                            :data="[35, 23, 56, 22, 97, 23, 64]"
                            variant="#f8cb00"
                            width="80"
                            height="30"
                          />
                        </div>
                      </Callout>
                    </b-col>
                    <b-col sm="6">
                      <Callout variant="success">
                        <small class="text-muted">Organic</small>
                        <br>
                        <strong class="h4">49,123</strong>
                        <div class="chart-wrapper" :style="{ top: '-10px'}">
                          <callout-chart-example
                            chartId="callout-chart-04"
                            :data="[65, 59, 84, 84, 51, 55, 40]"
                            variant="#4dbd74"
                            width="80"
                            height="30"
                          />
                        </div>
                      </Callout>
                    </b-col>
                  </b-row>
                  <hr class="mt-0">
                  <ul class="horizontal-bars type-2">
                    <div class="progress-group">
                      <div class="progress-group-header">
                        <i class="icon-user progress-group-icon"></i>
                        <span class="title">Male</span>
                        <span class="ml-auto font-weight-bold">43%</span>
                      </div>
                      <div class="progress-group-bars">
                        <b-progress height="{}" class="progress-xs" :value="43" variant="warning"></b-progress>
                      </div>
                    </div>
                    <div class="progress-group mb-5">
                      <div class="progress-group-header">
                        <i class="icon-user-female progress-group-icon"></i>
                        <span class="title">Female</span>
                        <span class="ml-auto font-weight-bold">37%</span>
                      </div>
                      <div class="progress-group-bars">
                        <b-progress height="{}" class="progress-xs" :value="37" variant="warning"></b-progress>
                      </div>
                    </div>
                    <div class="progress-group">
                      <div class="progress-group-header">
                        <i class="icon-globe progress-group-icon"></i>
                        <span class="title">Organic Search</span>
                        <span class="ml-auto font-weight-bold">
                          191,235
                          <span class="text-muted small">(56%)</span>
                        </span>
                      </div>
                      <div class="progress-group-bars">
                        <b-progress height="{}" class="progress-xs" :value="56" variant="success"></b-progress>
                      </div>
                    </div>
                    <div class="progress-group">
                      <div class="progress-group-header">
                        <i class="icon-social-facebook progress-group-icon"></i>
                        <span class="title">Facebook</span>
                        <span class="ml-auto font-weight-bold">
                          51,223
                          <span class="text-muted small">(15%)</span>
                        </span>
                      </div>
                      <div class="progress-group-bars">
                        <b-progress height="{}" class="progress-xs" :value="15" variant="success"></b-progress>
                      </div>
                    </div>
                    <div class="progress-group">
                      <div class="progress-group-header">
                        <i class="icon-social-twitter progress-group-icon"></i>
                        <span class="title">Twitter</span>
                        <span class="ml-auto font-weight-bold">
                          37,564
                          <span class="text-muted small">(11%)</span>
                        </span>
                      </div>
                      <div class="progress-group-bars">
                        <b-progress height="{}" class="progress-xs" :value="11" variant="success"></b-progress>
                      </div>
                    </div>
                    <div class="progress-group">
                      <div class="progress-group-header">
                        <i class="icon-social-linkedin progress-group-icon"></i>
                        <span class="title">LinkedIn</span>
                        <span class="ml-auto font-weight-bold">
                          27,319
                          <span class="text-muted small">&nbsp;(8%)</span>
                        </span>
                      </div>
                      <div class="progress-group-bars">
                        <b-progress height="{}" class="progress-xs" :value="8" variant="success"></b-progress>
                      </div>
                    </div>
                    <div class="divider text-center">
                      <b-button variant="link" size="sm" class="text-muted">
                        <i class="icon-options"></i>
                      </b-button>
                    </div>
                  </ul>
                </b-col>
              </b-row>
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>

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
import { RotateSquare5 } from "vue-loading-spinner";

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
    RotateSquare5
  },
  data: function() {
    return {
      userLogged: false,
      displayDropZone: true,
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
      dropzoneOptions: {
        url: "https://httpbin.org/post",
        acceptedFiles: ".sav,.pdf,.csv,.xlxs,.xls",
        dictDefaultMessage:
          "<i class='fa fa-cloud-upload'></i> Upload Files (.sav,.pdf,.csv,.xlsx,.xls)",
        thumbnailWidth: 150,
        maxFilesize: 10,
        headers: { "My-Awesome-Header": "header value" }
      }
    };
  },
  methods: {
    startLoader() {
      this.displayDropZone = false;
    },
    validateFile(file, xhr, formData) {
      let acceptedfilelist = this.dropzoneOptions.acceptedFiles;
      let allow = false;

      acceptedfilelist.split(",").forEach(function(fileExtension) {
        if (file.name.includes(fileExtension)) {
          console.log(file);
          allow = true;
        }
      });

      if (!allow) {
        this.$refs.myVueDropzone.removeFile(file);
        alert("This operation is not allowed");
      }
    },
    variant(value) {
      let $variant;
      if (value <= 25) {
        $variant = "info";
      } else if (value > 25 && value <= 50) {
        $variant = "success";
      } else if (value > 50 && value <= 75) {
        $variant = "warning";
      } else if (value > 75 && value <= 100) {
        $variant = "danger";
      }
      return $variant;
    },
    flag(value) {
      return "flag-icon flag-icon-" + value;
    }
  },
  mounted() {
    /** Check User Logged In */
    let self = this;
    axios
      .post("/o/user")
      .then(response => {
        self.$set(this, "user", response.data);
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
            this.dashboardData.totalFilesUploaded =
              response.data.totalFileUploads;
            this.dashboardData.totalReportsGenerated =
              response.data.totalReportUploads;
            this.dashboardData.announcementsArray = response.data.announcements;
            this.dashboardData.lastReportSummary =
              response.data.lastReportSummary;
          })
          .catch(errors => {
            this.$toaster.error("Session Expired. Please Login Again.");
            router.push("/login");
          });
      })
      .catch(errors => {
        this.$toaster.error("Session Expired. Please Login Again.");
        router.push("/login");
      });
  }
};
</script>

<style>
/* IE fix */
#card-chart-01,
#card-chart-02 {
  width: 100% !important;
}
</style>
