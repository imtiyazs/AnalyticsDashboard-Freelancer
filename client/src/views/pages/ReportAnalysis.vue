<template>
  <div class="wrapper">
    <div v-if="firstStepDisplayForm">
      <div class="row">
        <div class="animated fadeIn col-12">
          <b-card-group>
            <b-card header="Upload Report File">
              <div class="card">
                <div class="card-body">
                  <form-wizard
                    title="Generate Report Analysis"
                    subtitle="Visualize Report Analysis In 3 Steps"
                    finishButtonText="Generate Report Visualization"
                    nextButtonText="Generate Report Analysis"
                    startIndex=0
                  >
                    <tab-content
                      title="Upload Report File"
                      :before-change="UploadDataFilesToServer"
                    >
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
                            accept=".sav, .xls, .xlsx, .csv"
                            class="custom-file-input"
                            v-on:change="handleFileUpload"
                            :plain="true"
                          >
                          <label class="custom-file-label">{{uploadInputLabel}}</label>
                        </div>
                      </div>
                    </tab-content>
                    <tab-content title="Select Data Columns"></tab-content>
                    <tab-content title="Generate Visual Report"></tab-content>
                  </form-wizard>
                </div>
              </div>
            </b-card>
          </b-card-group>
        </div>
      </div>
    </div>
    <center>
      <div v-if="secondStepShowLoader" class="animated fadeIn col-4">
        <b-card-group>
          <div style="position:fixed; left:50%; top:35%">
            <rotate-square5></rotate-square5>
          </div>
          <span style="position:fixed; left:45%; top:45%">Generating Report Analysis</span>
        </b-card-group>
      </div>
    </center>
    <div v-if="thirdStepDisplayAnalysis">
      <b-card-group>
        <b-card header="Upload Report File">
          <div class="card">
            <div class="card-body">
              <form-wizard
                title="Generate Report Analysis"
                subtitle="Visualize Report Analysis In 3 Steps"
                finishButtonText="Generate Report Visualization"
                nextButtonText="Generate Report Analysis"
                startIndex=1
              >
                <tab-content title="Upload Report File"></tab-content>
                <tab-content title="Select Data Columns">
                  <!-- Report File Name -->
                  <span>
                    Report Name:
                    <span
                      style="font-size: 20px;font-weight: 500;"
                    >{{CapitalizeFirstLetter(nameOfReport)}}</span>
                  </span>
                  <p class="card-text">Select Columns To Include In Visual Analysis Report:</p>

                  <!-- Iterate columns  -->
                  <b-form-checkbox-group
                    stacked
                    id="dashboardData"
                    v-model="dashboardData"
                    name="dashboardData"
                    :checked="[2,3]"
                  >
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
                                    <b-form-checkbox
                                      type="checkbox"
                                      :value="{data:value, 'typeOfGraph':'BarGraph' , 'columnName':key}"
                                      class="bar-chart-check"
                                    ></b-form-checkbox>
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
                                    <b-form-checkbox
                                      type="checkbox"
                                      :value="{data:value, 'typeOfGraph':'PieGraph', 'columnName':key}"
                                      class="bar-chart-check"
                                    ></b-form-checkbox>
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
                  </b-form-checkbox-group>
                </tab-content>
                <tab-content title="Generate Visual Report"></tab-content>
                <template slot="footer" slot-scope="props">
                  <div class="wizard-footer-left"></div>
                  <div class="wizard-footer-right"></div>
                </template>
              </form-wizard>
            </div>
          </div>
        </b-card>
      </b-card-group>

      <br>
      <!-- MODAL -->
      <!-- <b-button hidden @click="showModal">Open Modal</b-button> -->
      <b-modal ref="myModalRef" hide-footer title="Your report is almost ready...!">
        <label
          class="text-muted"
        >Enter the name of data report. The data report will be further available for download with the mentioned name.</label>
        <div class="d-block text-center">
          <b-form-input
            id="analyticsDashboardName"
            type="text"
            v-model="analyticsDashboardName"
            placeholder="Name Of Data Report"
          ></b-form-input>
        </div>
        <b-btn
          style="right:0in"
          class="mt-3"
          variant="outline-primary"
          @click="generateDashboard"
        >Generate Data Report</b-btn>
      </b-modal>

      <b-button
        variant="primary"
        style="position:fixed; bottom: 5%; right:62px;"
        @click="showModal"
        :disabled="dashboardData===undefined || (dashboardData.length)<=0"
      >
        <i class="fa fa-bar-chart-o"></i> Generate Visual Report
      </b-button>
    </div>
    <div v-if="fourthStepShowLoader" class="animated fadeIn col-4">
      <b-card-group>
        <div style="position:fixed; left:50%; top:35%">
          <rotate-square5></rotate-square5>
        </div>
        <span style="position:fixed; left:45%; top:45%">Generating Your Dashboard</span>
      </b-card-group>
    </div>
    <div v-if="fifthStepDisplayDashboard">
      <b-card-group>
        <b-card header="Upload Report File">
          <div class="card">
            <div class="card-body">
              <form-wizard
                title="Generate Report Analysis"
                subtitle="Visualize Report Analysis In 3 Steps"
                finishButtonText="Generate Report Visualization"
                nextButtonText="Generate Report Analysis"
                startIndex=2
              >
                <tab-content title="Upload Report File"></tab-content>
                <tab-content title="Select Data Columns"></tab-content>
                <tab-content title="Generate Visual Report">
                  <!-- Report File Name -->
                  <div style="padding-left: 20px">
                    <span>
                      Report Name:
                      <span
                        style="font-size: 20px;font-weight: 500;"
                      >{{CapitalizeFirstLetter(nameOfReport)}}</span>
                    </span>
                    <br>
                    <span class="mb-5">
                      Analytic Report Name:
                      <span
                        style="font-size: 20px;font-weight: 500;"
                      >{{CapitalizeFirstLetter(analyticsDashboardName)}}</span>
                    </span>
                  </div>
                  <b-button
                    variant="primary"
                    style="position:fixed; bottom: 5%; right:62px;z-index: 10;"
                    @click="createPDF"
                  >
                    <i class="fa fa-download"></i> Download Report PDF
                  </b-button>
                  <div class="card-body">
                    <div ref="printReport" class="row">
                      <div
                        v-for="(singleGraph,index) in dashboardGeneratedData.dashboardData"
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
                </tab-content>
                <template slot="footer" slot-scope="props">
                  <div class="wizard-footer-left"></div>
                  <div class="wizard-footer-right"></div>
                </template>
              </form-wizard>
            </div>
          </div>
        </b-card>
      </b-card-group>
    </div>
  </div>
</template>

<script>
import { RotateSquare5 } from "vue-loading-spinner";
import router from "../../router";
import axios from "axios";
//import BarChart from "@/views/pages/ChartComponent/BarChart"
import BarCharts from "@/views/pages/ChartComponent/BarCharts";
import PieCharts from "@/views/pages/ChartComponent/PieCharts";
import { FormWizard, TabContent } from "vue-form-wizard";
import "vue-form-wizard/dist/vue-form-wizard.min.css";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default {
  name: "ReportAnalysis",
  components: {
    RotateSquare5,
    BarCharts,
    PieCharts,
    FormWizard,
    TabContent
  },
  data() {
    return {
      uploadInputLabel: "Choose Report File (.sav, .xls, .xlsx)",
      nameOfReport: "",
      fileObject: null,
      fileName: "",
      fileType: "",
      /* Change to display form*/
      firstStepDisplayForm: true,
      secondStepShowLoader: false,
      thirdStepDisplayAnalysis: false,
      fourthStepShowLoader: false,
      fifthStepDisplayDashboard: false,
      self: this,
      dashboardData: [],
      analyticsDashboardName: "",
      dashboardGeneratedData: {},
      JSONObject: {},
      userProfileData: {},
      output: null
    };
  },
  methods: {
    createPDF() {
      let self = this;

      html2canvas(this.$refs.printReport).then(function(canvas) {
        let pdfName =
            self.CapitalizeFirstLetter(self.nameOfReport) + "_" + self.CapitalizeFirstLetter(self.analyticsDashboardName) + ".pdf",
          pdfDate = new Date().toISOString();

        var doc = new jsPDF("p", "mm", "a4");

        doc.setFontSize(12);
        doc.text("Report Name: " + self.CapitalizeFirstLetter(self.nameOfReport), 10, 20);
        doc.text(
          "Analytics Report Name: " + self.CapitalizeFirstLetter(self.analyticsDashboardName),
          10,
          30
        );
        doc.text("Creation Date: " + pdfDate, 10, 40);

        doc.addImage(canvas.toDataURL("image/png"), "PNG", 10, 50, 190, 0);

        doc.save(pdfName);
      });
    },
    CapitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    },
    /** Upload File to server for data extraction */
    UploadDataFilesToServer: function() {
      if (this.nameOfReport == "") {
        this.$toaster.error("Please Enter Report Name");
        return;
      }

      if (this.fileObject == {} || this.fileObject == null) {
        this.$toaster.error("Please Upload A Report File");
        return;
      }

      // e.preventDefault();
      this.firstStepDisplayForm = false;
      // Show Loader
      this.secondStepShowLoader = true;
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
          // console.log(response);
          this.fileName = response.data.fileName;
          this.fileType = response.data.fileType;
          this.JSONObject = response.data.dataValues;

          this.firstStepDisplayForm = false;
          this.secondStepShowLoader = false;
          this.thirdStepDisplayAnalysis = true;

          return true;
        })
        // On file reading error
        .catch(function(error) {
          console.log(error);
          return false;
          // this.secondStepShowLoader = false;
        });
    },
    returnFrequency(arrayObject) {
      let counts = {};
      for (let i = 0; i < arrayObject.length; i++) {
        let num = arrayObject[i];
        counts[num] = counts[num] ? counts[num] + 1 : 1;
      }
      return counts;
    },
    handleFileUpload() {
      this.fileObject = this.$refs.file.files[0];
      this.uploadInputLabel = this.$refs.file.files[0].name;
    },
    showModal() {
      this.$refs.myModalRef.show();
    },
    hideModal() {
      this.$refs.myModalRef.hide();
    },
    generateDashboard() {

      //axios to record dashboard into mongo
      let dashboardDetails = {
        reportName: this.nameOfReport,
        fileName: this.fileName,
        userName: this.userProfileData.username,
        analyticsDataName: this.analyticsDashboardName,
        reportData: this.JSONObject,
        analyticsData: this.dashboardData,
        creationDate: new Date().toISOString()
      };

      this.thirdStepDisplayAnalysis = false;
      this.fourthStepShowLoader = true;

      axios
        .post("/o/uploadreport", dashboardDetails)
        // On receiving file data in JSON
        .then(response => {
          this.dashboardGeneratedData.fileName = this.fileName;
          this.dashboardGeneratedData.reportName = this.nameOfReport;
          this.dashboardGeneratedData.dashboardData = this.dashboardData;

          // hide all & Show dashboard
          this.fourthStepShowLoader = false;
          this.fifthStepDisplayDashboard = true;
        })
        .catch(function(error) {
          this.$toaster.error(error.response.data)
        });
    }
  },
  mounted() {
    /** Get User data from database */
    axios
      .post("/o/user")
      .then(response => {
        //this.$set(this, "user", response.data);
        this.user = response.data;
        this.userLogged = true;

        // Replaced
        this.userProfileData = response.data;

        var b = response.data.lastlogin.split(/\D+/);
        this.userProfileData.lastlogin = new Date(
          Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6])
        );
      })
      .catch(error => {
        this.$toaster.error(error.response.data);
        router.push("/login");
      });
  }
};
</script>
<style>
.bar-chart-check {
  position: absolute;
  z-index: 1;
  right: 30px;
}
</style>
