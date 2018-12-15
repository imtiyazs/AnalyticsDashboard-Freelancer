<template>
  <div class="wrapper">
    <div class="animated fadeIn">
      <b-container class="bv-example-row" fluid>
        <b-row>
          <b-table hover :items="usersHistory" >
            <template slot="reportName" slot-scope="data">
              <a href="#">{{data.value}}</a>
            </template>
            <template slot="analyticDashboard" slot-scope="data">
              <b-row v-for="(singleEntry,index) in data.value" :key="index"> 
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
      usersHistory : [{"reportName":"Exam Report","analyticDashboard":["Sex Ratio","No of Passing Students","Leaked Paper","Failed Marks"]},{"reportName":"Survey","analyticDashboard":["Food Samples Sold","Food Samples Spoilt"]},{"reportName":"Survey 500","analyticDashboard":[]},{"reportName":"Survey100"}]
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
