<template>
  <div class="wrapper">
    <div class="animated fadeIn">
      <!-- <b-row>
        <b-col >hi</b-col>
        <b-col >hi</b-col>
        <b-col >hi</b-col>
        <b-col >hi</b-col>
      </b-row>
      <b-row>
        
      </b-row> -->
      <b-container class="bv-example-row" fluid>
        <!-- <b-row > 
            <b-col cols="3"><h4>Sr. No</h4></b-col>
            <b-col> <h4> Name of Report </h4></b-col>
            <b-col> <h4> Analytic Dashboard </h4></b-col>
        </b-row> -->
        <!-- <b-row v-for="(singleEntry,index) in usersHistory" >
            <b-col cols="3">{{index+1}}</b-col>
            <b-col>{{singleEntry.reportName}}</b-col>
            <b-col>
              <div v-for="singleDashboard in singleEntry.analyticDashboard">
                {{singleDashboard}}
              </div>
            </b-col>
        </b-row> -->
        <b-row>
          <b-table hover :items="usersHistory" >
            <template slot="analyticDashboard" slot-scope="data">
              <b-row v-for="singleEntry in data.value" > 
                <b-col><a href="#">{{singleEntry}}</a></b-col>
              </b-row>
            </template>
          </b-table>
        </b-row>
    </b-container>
    </div>
  </div>
</template>


<script>
import router from "../../router";
import axios from "axios";

export default {
  name: "ReportHistory",
  data() {
    return {
      usersHistory : [{"reportName":"Exam Report","analyticDashboard":["Sex Ratio","No of Passing Students","Leaked Paper","Failed Marks"]},{"reportName":"Survey","analyticDashboard":["Food Samples Sold","Food Samples Spoilt"]},{"reportName":"Survey","analyticDashboard":[]},{"reportName":"Survey"}]
    };
  },
  methods: {},
  mounted() {
    /** Check User Logged In */
    let self = this;
    axios
      .post("/o/user")
      .then(response => {
        self.$set(this, "user", response.data.user);
        this.userLogged = true;
      })
      .catch(errors => {
        router.push("/login");
      });
  }
};
</script>
