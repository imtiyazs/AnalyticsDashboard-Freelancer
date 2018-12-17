<template>
  <div class="wrapper">
    <div class="animated fadeIn">
      <b-row>
        <b-col cols="12">
          <div class="card">
            <div class="card-body">
              <b-container class="bv-example-row" fluid>
                <b-row>
                  <!-- {{usersHistory.reports}} -->
                  <b-table hover :items="usersHistory.reports" :fields="fields">
                    <template slot="analyticsDataName" slot-scope="data">
                      <div @click="displayDashboard(data.value)">
                        <b>{{data.value}}</b>
                      </div>
                    </template>
                  </b-table>
                </b-row>
              </b-container>
            </div>
          </div>
        </b-col>
      </b-row>

      <div>
        <b-modal
          id="displayMyDashboard"
          ref="displayMyDashboard"
          hide-footer
          :title="'Dashboard :: ' + this.dashboardDisplay.name"
          size="400"
        >
          <div v-if="dashboardDisplay.data!==null">
            <!-- Report File Name -->
            <div>
              <span>
                Report Name:
                <span>
                  <!-- {{CapitalizeFirstLetter(nameOfReport)}} -->
                  {{this.dashboardDisplay.data.reportName}}
                </span>
              </span>
              <br>
              <span>
                Analytic Report Name:
                {{this.dashboardDisplay.data.analyticsDataName}}
              </span>
            </div>
            <!-- **** -->
            <div class="card-body">
              <div class="row">
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

export default {
  name: "ReportHistory",
  components: {
    BarCharts,
    PieCharts
  },
  data() {
    return {
      user: {},
      //fields: ["fileName", "reportName", "analyticsDataName","creationDate"],
      fields: {
        "fileName": {
          "label": "File Name",
          "sortable": true
        },
        "reportName": {
          "label": "Report Name",
          "sortable": true
        },
        "analyticsDataName": {
          "label": "Dashboard Name",
          "sortable": true
        },
        "creationDate": {
          "label": "Creation",
          "sortable": true
        }
},
      dashboardDisplay: {
        name: "",
        data: null
      },
      usersHistory: {}
    };
  },
  methods: {
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
      //alert(DashboardName)
      this.dashboardDisplay.name = DashboardName;
      this.$refs.displayMyDashboard.show();
      this.dashboardDisplay.data = this.getDashboardDetails(DashboardName);
      //console.log(this.dashboardDisplay)
    },
    getDashboardDetails(DashboardName) {
      //listOfReports = this.usersHistory.reports
      let returnData = null;
      this.usersHistory.reports.forEach(element => {
        if (element.analyticsDataName === DashboardName) {
          console.log(element);
          returnData = element;
        }
      });
      return returnData;
    }
  },
  mounted() {
    /** Check User Logged In */
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
            console.log(response.data)
          })
          .catch(errors => {
            this.$toaster.error('Cannot Fetch Report History')
          });
      })
      .catch(errors => {
        router.push("/login");
      });
  }
};
</script>
<style scoped>
div.modal.displayMyDashboard .modal-dialog {
  width: 100%;
}
</style>
