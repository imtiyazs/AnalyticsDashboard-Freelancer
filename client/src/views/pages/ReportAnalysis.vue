<template>
  <div class="wrapper">
    <div v-if="firstStepDisplayForm">
      <div class="row">
        <div class="animated fadeIn col-12">
          <b-card-group>
            <div class="card">
              <div class="card-body">
                <form-wizard
                  title="Generate Report Analysis"
                  subtitle
                  finishButtonText="Generate Report Visualization"
                  nextButtonText="Clear Your Data"
                  class="mt-3"
                >
                  <tab-content title="Upload Data" :before-change="UploadDataFilesToServer">
                    <div class="input-group mb-3">
                      <div class="input-group-prepend">
                        <span class="input-group-text">Raw Data Name</span>
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
                        <span class="input-group-text">Upload File</span>
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
                  <tab-content title="Data Cleaning"></tab-content>
                  <tab-content title="Visualize"></tab-content>
                  <tab-content title="Generate Report"></tab-content>
                </form-wizard>
              </div>
            </div>
          </b-card-group>
        </div>
      </div>
    </div>
    <div v-if="showDataVerification">
      <b-card-group>
        <div class="card">
          <div class="card-body">
            <form-wizard
              title="Generate Report Analysis"
              subtitle
              finishButtonText="Generate Report Visualization"
              nextButtonText="Generate Report Analysis"
              :startIndex="1"
            >
              <tab-content title="Upload Data"></tab-content>
              <tab-content title="Data Cleaning" :before-change="GoToDataGraphsSection">
                <!-- Report File Name -->
                <span>
                  Raw Data Name:
                  <span
                    style="font-size: 20px;font-weight: 500;"
                  >{{CapitalizeFirstLetter(nameOfReport)}}</span>
                </span>
                <div class="row">
                  <div class="col-8">
                    <p
                      class="card-text mt-9"
                      style="width: 100%;"
                    >Verify the raw data and filtered data from columns below:</p>
                  </div>
                  <div class="col-4">
                    <b-button
                      @click="DownloadCleanDataFile(nameOfReport)"
                      variant="success"
                      style="float: right;margin-right: 50px;"
                    >Download Clean Data</b-button>
                  </div>
                </div>

                <div class="row">
                  <div v-for="(value, key) in JSONObject" :key="key">
                    <b-card-group deck class="mb-3">
                      <div class="col-12">
                        <b-button
                          @click="showRawFilteredDataModal(key, value)"
                          class="card-btns text-left"
                          variant="primary"
                        >{{CapitalizeFirstLetter(key)}}</b-button>

                        <b-form-checkbox
                          type="checkbox"
                          class="bar-chart-check"
                          @change="verifyDataColumns(key, FilteredJSONObject[key])"
                          style="top:25px"
                        ></b-form-checkbox>
                      </div>
                    </b-card-group>
                  </div>
                </div>
                <b-modal
                  ref="dataModal"
                  size="lg"
                  hide-footer
                  :title="'Column name: '+ CapitalizeFirstLetter(RawVerificationData.columnName)"
                >
                  <!-- <b-card-header header-tag="header" class="p-1" role="tab">
                          <b-btn block href="#" v-b-toggle="1" variant="light">
                            <h5 class="text-left mb-0">
                              <span style="font-size: 12px;">Column Name:</span>
                              
                            </h5>
                  </b-btn>-->
                  <!-- </b-card-header> -->
                  <div class="card-body" style="height: 520px;overflow: hidden;">
                    <div class="row">
                      <div class="col-6">
                        <b-card
                          no-body
                          :header="'Raw Data Count: '+ RawVerificationData.RawData.length"
                        >
                          <div style="height: 440px;overflow: overlay;">
                            <b-list-group>
                              <div
                                v-for="(item, index) in RawVerificationData.RawData"
                                :key="index"
                              >
                                <b-list-group-item
                                  v-if="item.length != 0"
                                  style="height: 40px;"
                                >{{item}}</b-list-group-item>
                                <b-list-group-item
                                  v-else
                                  style="height: 40px;background-color: red;opacity: 0.2;"
                                >{{item}}</b-list-group-item>
                              </div>
                            </b-list-group>
                          </div>
                        </b-card>
                      </div>
                      <div class="col-6">
                        <b-card
                          no-body
                          :header="'Clean Data Count: ' + RawVerificationData.FilterData.length"
                        >
                          <div style="height: 440px;overflow: overlay;">
                            <b-list-group>
                              <div
                                v-for="(item, index) in RawVerificationData.FilterData"
                                :key="index"
                              >
                                <b-list-group-item style="height: 40px;">{{item}}</b-list-group-item>
                              </div>
                            </b-list-group>
                          </div>
                        </b-card>
                      </div>
                    </div>
                  </div>
                </b-modal>
              </tab-content>
              <tab-content title="Visualize"></tab-content>
              <tab-content title="Generate Report"></tab-content>
            </form-wizard>
          </div>
        </div>
      </b-card-group>
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
        <div class="card">
          <div class="card-body">
            <form-wizard
              title="Generate Report Analysis"
              subtitle
              finishButtonText="Generate Report Visualization"
              nextButtonText="Generate Report Analysis"
              :startIndex="2"
            >
              <tab-content title="Upload Data"></tab-content>
              <tab-content title="Data Cleaning"></tab-content>
              <tab-content title="Visualize">
                <!-- Report File Name -->
                <span>
                  Raw Data Name:
                  <span
                    style="font-size: 20px;font-weight: 500;"
                  >{{CapitalizeFirstLetter(nameOfReport)}}</span>
                </span>
                <p
                  class="card-text mt-3 mb-3"
                  style="width: 100%;"
                >Select the columns and choose the required graphs:</p>

                <div v-for="(value, key) in verifiedColumns" :value="{key:value}" :key="key">
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
                          <!-- Iterate columns  -->
                          <p
                            class="text-muted"
                            style="margin: 20px 20px 0 20px;"
                            v-if="value.length > 50"
                          >Note: The data legend will be hidden due to huge dataset. You can still hover the data graph to get Value & Count Ex: { 53.2:10 }</p>
                          <b-form-checkbox-group
                            stacked
                            :id="key"
                            v-model="dashboardData"
                            :checked="[2,3]"
                          >
                            <!-- <div class="collapse show" :id="key" > -->
                            <div class="card-body">
                              <div class="row">
                                <!-- Bar Chart Display -->
                                <div class="col-6">
                                  <b-form-checkbox
                                    type="checkbox"
                                    :value="{data:value, 'typeOfGraph':'BarGraph' , 'columnName':key}"
                                    class="bar-chart-check"
                                    style="top:0"
                                  ></b-form-checkbox>
                                  <b-card :header="'Bar Graph: ' + CapitalizeFirstLetter(key)">
                                    <div class="chart-wrapper">
                                      <BarCharts
                                        v-if="value.length > 50"
                                        :datasetBar="returnFrequency(value)"
                                        chartId="chart-bar-01"
                                        style="zoom: 80%;"
                                      />
                                      <BarCharts
                                        v-else
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
                                  <b-card :header="'Pie Graph: ' + CapitalizeFirstLetter(key)">
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
                            <!-- </div> -->
                          </b-form-checkbox-group>
                        </b-collapse>
                      </div>
                    </div>
                  </div>
                </div>
              </tab-content>
              <tab-content title="Generate Report"></tab-content>
              <template slot="footer">
                <div class="wizard-footer-left"></div>
                <div class="wizard-footer-right"></div>
              </template>
            </form-wizard>
          </div>
        </div>
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
          :disabled="analyticsDashboardName === '' || analyticsDashboardName === undefined"
          @click="generateDashboard"
        >Generate Data Report</b-btn>
      </b-modal>

      <b-button
        variant="primary"
        style="position:fixed; bottom: 5%; right:62px;"
        @click="showModal"
        :disabled="dashboardData===undefined || (dashboardData.length)<=0"
      >
        <i class="fa fa-bar-chart-o"></i> Generate Report
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
        <b-card header="Upload Data">
          <div class="card">
            <div class="card-body">
              <form-wizard
                title="Generate Report Analysis"
                subtitle
                finishButtonText="Generate Report Visualization"
                nextButtonText="Generate Report Analysis"
                :startIndex="3"
              >
                <tab-content title="Upload Data"></tab-content>
                <tab-content title="Data Cleaning"></tab-content>
                <tab-content title="Visualize"></tab-content>
                <tab-content title="Generate Report">
                  <!-- Report File Name -->
                  <div style="padding-left: 20px">
                    <span>
                      Raw Data Name:
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
                        class="col-6"
                      >
                        <div v-if="singleGraph.typeOfGraph ==='BarGraph'">
                          <b-card
                            :header="CapitalizeFirstLetter(singleGraph.columnName) + ' Bar Graph'"
                            style="font-weight:500"
                          >
                            <div class="chart-wrapper">
                              <BarCharts
                                v-if="singleGraph.data.length > 50"
                                :datasetBar="returnFrequency(singleGraph.data)"
                                :columnName="CapitalizeFirstLetter(singleGraph.columnName)"
                                chartId="chart-bar-01"
                                style="zoom: 80%"
                              />
                              <BarCharts
                                v-else
                                :datasetBar="returnFrequency(singleGraph.data)"
                                :columnName="CapitalizeFirstLetter(singleGraph.columnName)"
                                chartId="chart-bar-01"
                              />
                            </div>
                          </b-card>
                        </div>
                        <div v-if="singleGraph.typeOfGraph ==='PieGraph'">
                          <b-card
                            :header="CapitalizeFirstLetter(singleGraph.columnName)  + ' Doughnut Graph'"
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
                <template slot="footer">
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
import { Parser } from "json2csv";

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
      showDataVerification: false,
      fifthStepDisplayDashboard: false,
      self: this,
      verifiedColumns: {},
      dashboardData: [],
      analyticsDashboardName: "",
      dashboardGeneratedData: {},
      JSONObject: {},
      FilteredJSONObject: {},
      userProfileData: {},
      cleanJSONData: [],
      output: null,
      RawVerificationData: {
        columnName: "",
        RawData: [],
        FilterData: []
      }
    };
  },
  methods: {
    showRawFilteredDataModal(key, value) {
      this.RawVerificationData.columnName = key;
      this.RawVerificationData.RawData = value;
      this.RawVerificationData.FilterData = this.FilteredJSONObject[key];
      this.$refs.dataModal.show();
    },
    createPDF() {
      let self = this;

      html2canvas(this.$refs.printReport).then(function(canvas) {
        let pdfName =
            self.CapitalizeFirstLetter(self.nameOfReport) +
            "_" +
            self.CapitalizeFirstLetter(self.analyticsDashboardName) +
            ".pdf",
          pdfDate = new Date().toISOString();

        var doc = new jsPDF("p", "mm", "a4");

        doc.setFontSize(12);
        doc.text(
          "Raw Data Name: " + self.CapitalizeFirstLetter(self.nameOfReport),
          10,
          20
        );
        doc.text(
          "Analytics Report Name: " +
            self.CapitalizeFirstLetter(self.analyticsDashboardName),
          10,
          30
        );
        doc.text("Creation Date: " + pdfDate, 10, 40);

        doc.addImage(canvas.toDataURL("image/png"), "PNG", 10, 50, 190, 0);

        doc.save(pdfName);
      });
    },
    GoToDataGraphsSection() {
      this.secondStepShowLoader = true;
      this.showDataVerification = false;
      setTimeout(() => {
        this.secondStepShowLoader = false;
        this.thirdStepDisplayAnalysis = true;
      }, 2000);
    },
    CapitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    },
    DownloadCleanDataFile(nameOfReport) {
      let fields = Object.keys(this.JSONObject);
      const json2csvParser = new Parser({ fields, quote: "" }),
        csv = json2csvParser.parse(this.cleanJSONData);

      let csvContent = "data:text/csv;charset=utf-8,",
        encodedUri = encodeURI(csvContent + csv),
        link = document.createElement("a");

      link.setAttribute("href", encodedUri);
      link.setAttribute("download", nameOfReport + ".csv");
      document.body.appendChild(link); // Required for FF
      link.click();
    },
    /** Upload File to server for data extraction */
    UploadDataFilesToServer: function() {
      if (this.nameOfReport == "") {
        this.$toaster.error("Please Enter Raw Data Name");
        return;
      }

      if (this.fileObject == {} || this.fileObject == null) {
        this.$toaster.error("Please Upload A Data File");
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

          Object.keys(this.JSONObject).forEach((key, index) => {
            let tempArray = [];
            this.FilteredJSONObject[key] = null;
            this.JSONObject[key].forEach(value => {
              if (value !== null && value !== "" && value !== undefined) {
                tempArray.push(value);
              }
            });
            this.FilteredJSONObject[key] = tempArray;
            tempArray = [];
          });

          this.firstStepDisplayForm = false;
          this.secondStepShowLoader = false;
          this.showDataVerification = true;

          let fields = Object.keys(this.JSONObject);
          this.JSONObject[fields[0]].forEach((dataObj, i) => {
            let jsonObj = {};
            fields.forEach(field => {
              jsonObj[field] = this.JSONObject[field][i];
            });
            this.cleanJSONData.push(jsonObj);
          });

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
    verifyDataColumns(columnName, columnData) {
      var index = Object.keys(this.verifiedColumns).indexOf(columnName);
      if (index > -1) {
        delete this.verifiedColumns[columnName];
        return;
      }
      this.verifiedColumns[columnName] = columnData;
    },
    generateDashboard() {
      //axios to record dashboard into mongo
      let dashboardDetails = {
        reportName: this.nameOfReport,
        fileName: this.fileName,
        userName: this.userProfileData.username,
        analyticsDataName: this.analyticsDashboardName,
        reportData: this.verifiedColumns,
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
          this.$toaster.error(error.response.data);
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
*::-webkit-scrollbar {
  width: 10px;
}

*::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
}

*::-webkit-scrollbar-thumb {
  background-color: darkgrey;
  outline: 1px solid slategrey;
}
.bar-chart-check {
  position: absolute;
  z-index: 1;
  right: 25px;
  top: 0;
}

.card-btns {
  width: 230px;
  height: 50px;
  margin: 10px;
}
</style>
