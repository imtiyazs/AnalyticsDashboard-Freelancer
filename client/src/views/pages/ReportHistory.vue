<template>
  <div class="wrapper">
    <div class="animated fadeIn">
      <b-row v-if="usersHistory.reports !== undefined">
        <b-col cols="12">
          <div class="card">
            <div class="card-body">
              <b-container class="bv-example-row" fluid>
                <b-row>
                  <!-- {{usersHistory.reports}} -->
                  <b-table
                    hover
                    :items="usersHistory.reports"
                    :fields="fields"
                    :current-page="currentPage"
                    :per-page="10"
                    class="table table-striped"
                  >
                    <template slot="analyticsDataName" slot-scope="data">
                      <div @click="displayDashboard(data.value)" style="cursor: pointer;">
                        <b>{{data.value}}</b>
                      </div>
                    </template>
                    <template slot="creationDate" slot-scope="data">
                      <div v-if="data.value!=undefined">{{(new Date(data.value)).toDateString()}}</div>
                    </template>
                  </b-table>
                </b-row>
                <b-row>
                  <b-col md="6" class="my-1">
                    <b-pagination
                      :total-rows="totalRows"
                      :per-page="10"
                      v-model="currentPage"
                      class="my-0"
                    />
                  </b-col>
                </b-row>
              </b-container>
            </div>
          </div>
        </b-col>
      </b-row>
      <div class="loader" v-else>
        <circle4 style="height:80px;width:80px;"></circle4>
      </div>
      <div>
        <b-modal
          id="displayMyDashboard"
          ref="displayMyDashboard"
          hide-footer
          size="lg"
          :title="'Report Analysis'"
        >
          <div v-if="dashboardDisplay.data!==null">
            <!-- Report File Name -->
            <div class="row mb-3" style="padding: 0 0 0 20px;">
              <div class="col-3">
                Report Name:
                <span
                  style="font-size: 14px;font-weight: 500;"
                >{{CapitalizeFirstLetter(this.dashboardDisplay.data.reportName)}}</span>
              </div>
              <div class="col-3">
                Analytic Name:
                <span
                  style="font-size: 14px;font-weight: 500;"
                >{{CapitalizeFirstLetter(this.dashboardDisplay.data.analyticsDataName)}}</span>
              </div>
              <div class="col-3">
                Date:
                <span
                  style="font-size: 14px;font-weight: 500;"
                >{{new Date(this.dashboardDisplay.data.creationDate).toDateString()}}</span>
              </div>
              <div class="col-3">
                <b-button @click="createPDF" class="btn btn-primary btn-sm" block>
                  <i class="fa fa-download"></i> Download Report PDF
                </b-button>
              </div>
            </div>

            <!-- **** -->
            <div class="card-body" style="overflow-y: scroll;overflow-x: hidden; height: 460px;">
              <div ref="printReport" class="row">
                <div
                  v-for="(singleGraph,index) in dashboardDisplay.data.analyticsData"
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
                          :columnName="singleGraph.columnName"
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
            <!-- **** -->
          </div>
        </b-modal>
      </div>
    </div>
  </div>
</template>


<script>
import router from "../../router";
import axios from "axios";
import BarCharts from "@/views/pages/ChartComponent/BarCharts";
import PieCharts from "@/views/pages/ChartComponent/PieCharts";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Circle4 } from "vue-loading-spinner";

export default {
  name: "ReportHistory",
  components: {
    BarCharts,
    PieCharts,
    Circle4
  },
  data() {
    return {
      user: {},
      //fields: ["fileName", "reportName", "analyticsDataName","creationDate"],
      fields: {
        fileName: {
          label: "File Name",
          sortable: true
        },
        reportName: {
          label: "Report Name",
          sortable: true
        },
        analyticsDataName: {
          label: "Dashboard Name",
          sortable: true
        },
        creationDate: {
          label: "Creation",
          sortable: true
        }
      },
      dashboardDisplay: {
        name: "",
        data: null
      },
      usersHistory: {},
      totalRows: 0,
      currentPage: 0,
      showLoader: false
    };
  },
  methods: {
    createPDF() {
      let self = this;
      html2canvas(this.$refs.printReport).then(function(canvas) {
        let pdfName =
            self.CapitalizeFirstLetter(self.dashboardDisplay.data.reportName) +
            "_" +
            self.CapitalizeFirstLetter(
              self.dashboardDisplay.data.analyticsDataName
            ) +
            ".pdf",
          pdfDate = new Date().toISOString();

        var doc = new jsPDF("p", "mm", "a4");

        doc.setFontSize(12);
        doc.text(
          "Report Name: " +
            self.CapitalizeFirstLetter(self.dashboardDisplay.data.reportName),
          10,
          20
        );
        doc.text(
          "Analytics Report Name: " +
            self.CapitalizeFirstLetter(
              self.dashboardDisplay.data.analyticsDataName
            ),
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
    returnFrequency(arrayObject) {
      let counts = {};
      for (let i = 0; i < arrayObject.length; i++) {
        let num = arrayObject[i];
        counts[num] = counts[num] ? counts[num] + 1 : 1;
      }
      return counts;
    },
    displayDashboard(DashboardName) {
      this.dashboardDisplay.name = DashboardName;
      this.$refs.displayMyDashboard.show();
      this.dashboardDisplay.data = this.getDashboardDetails(DashboardName);
    },
    getDashboardDetails(DashboardName) {
      let returnData = null;
      this.usersHistory.reports.forEach(element => {
        if (element.analyticsDataName === DashboardName) {
          returnData = element;
        }
      });
      return returnData;
    }
  },
  mounted() {
    /** Check User Logged In */
    this.showLoader = true;

    let self = this;
    axios
      .post("/o/user")
      .then(response => {
        self.user = response.data;
        this.userLogged = true;

        axios
          .post("/o/reporthistory", {
            username: self.user.username
          })
          .then(response => {
            self.usersHistory = response.data;
            self.totalRows = response.data.reports.length;
            self.currentPage = 0;
            //console.log(response.data);
          })
          .catch(errors => {
            this.$toaster.error("Cannot Fetch Report History");
          });
      })
      .catch(errors => {
        router.push("/login");
      });
  }
};
</script>
<style scoped>
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

div.modal.displayMyDashboard .modal-dialog {
  width: 100%;
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
