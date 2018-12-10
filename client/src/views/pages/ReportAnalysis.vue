<template>
  <div class="wrapper">
    <div v-if="firstStepDisplayForm">
      <div class="row">
        <div class="animated fadeIn col-9">
          <b-card-group>
            <b-card header="Upload Report File">
              <b-form v-on:submit="UploadDataFilesToServer">
                <b-form-group
                  description="Enter The Name Of Report"
                  label="Report Name"
                  label-for="nameOfReport"
                  :label-cols="4"
                  :horizontal="true"
                >
                  <b-form-input
                    id="basicName"
                    type="text"
                    v-model="nameOfReport"
                    autocomplete="name"
                  ></b-form-input>
                </b-form-group>

                <b-form-group
                  label="File Upload"
                  description="(.sav, .xls, .xlsx)"
                  label-for="fileInput"
                  :label-cols="4"
                  :horizontal="true"
                >
                  <input
                    type="file"
                    id="file"
                    ref="file"
                    accept=".sav, .xls, .xlsx"
                    v-on:change="handleFileUpload"
                    :plain="true"
                  >
                </b-form-group>
                
                <div slot="footer" class="mt-5 float-right">
                  <b-button
                    :disabled="secondStepShowLoader"
                    id="submit-btn"
                    type="submit"
                    size="sm"
                    variant="primary"
                  >
                    <i class="fa fa-dot-circle-o"></i> Generate Report Analysis
                  </b-button>
                  <!-- <b-button type="reset" size="sm" variant="danger"><i class="fa fa-ban"></i> Reset</b-button> -->
                </div>
              </b-form>
            </b-card>
          </b-card-group>
        </div>
        <div v-if="secondStepShowLoader" class="animated fadeIn col-4">
          <b-card-group>
            <div style="position: absolute;top: 45%;left: 70%;">
              <rotate-square5></rotate-square5>
            </div>
            <span style="position: absolute;top: 65%;left: 55%;">Generating Report Analysis</span>
          </b-card-group>
        </div>
      </div>
      
    </div>
    <div v-if="thirdStepDisplayAnalysis">
      <b-form-checkbox-group stacked id="fileColumns" v-model="fileColumns" name="fileColumns" :checked="[2,3]">
        <b-form-checkbox v-for="(value, key) in JSONObject" :value="{key:value}" :key="key" >{{key}} :: 
          <b-card-group columns class="card-columns">
            <!-- 1 -->
            <b-card header="Bar Chart">
              <div class="chart-wrapper">
                <BarCharts :datasetBar="returnFrequency(value)" chartId="chart-bar-01"/>
              </div>
            </b-card>
            <!-- 2 -->
            <b-card header="Pie Chart">
              <div class="chart-wrapper">
                <PieCharts :datasetPie="returnFrequency(value)" chartId="chart-pie-01"/>
              </div>
            </b-card>
          </b-card-group>
        </b-form-checkbox>
      </b-form-checkbox-group>
     *****************************<br>
     {{fileColumns}}
    </div>
    
  </div>
</template>

<script>
//import vue2Dropzone from "vue2-dropzone";
//import "vue2-dropzone/dist/vue2Dropzone.min.css";
import { RotateSquare5 } from "vue-loading-spinner";
import router from "../../router";
import axios from "axios";
//import BarChart from "@/views/pages/ChartComponent/BarChart"
import BarCharts from '@/views/pages/ChartComponent/BarCharts'
import PieCharts from  '@/views/pages/ChartComponent/PieCharts'

export default {
  name: "ReportAnalysis",
  components: {
    // vueDropzone: vue2Dropzone,
    RotateSquare5,
    BarCharts,
    PieCharts
  },
  data() {
    return {
      nameOfReport: "",
      fileObject: null,
      /* Change to display form*/
      firstStepDisplayForm: true,
      secondStepShowLoader: false,
      thirdStepDisplayAnalysis : false,
      self: this,
      fileColumns:[],
      //JSONObject: {"DepT1gp2":["0.0","0.0","0.0","0.0","0.0","0.0","0.0","1.0","0.0","1.0","0.0","0.0","1.0","0.0","1.0","1.0","0.0","1.0","0.0","0.0","0.0","0.0","0.0","0.0","1.0","0.0","1.0","1.0","1.0","0.0"],"DepT2Gp2":["0.0","0.0","0.0","0.0","1.0","0.0","0.0","1.0","0.0","1.0","0.0","0.0","1.0","0.0","1.0","0.0","0.0","1.0","0.0","0.0","0.0","0.0","0.0","0.0","1.0","0.0","0.0","1.0","0.0","0.0"],"DepT3gp2":["0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","1.0","0.0","0.0","1.0","0.0","1.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","1.0","0.0","0.0"],"age":["23.0","21.0","25.0","30.0","45.0","22.0","22.0","26.0","23.0","21.0","23.0","19.0","23.0","19.0","21.0","20.0","24.0","27.0","23.0","22.0","46.0","19.0","22.0","37.0","32.0","30.0","25.0","21.0","45.0","21.0"],"confid1":["15.0","14.0","12.0","11.0","16.0","13.0","21.0","17.0","22.0","20.0","28.0","20.0","21.0","24.0","29.0","16.0","14.0","15.0","13.0","22.0","21.0","13.0","28.0","29.0","17.0","20.0","24.0","12.0","22.0","21.0"],"confid2":["16.0","15.0","18.0","16.0","16.0","20.0","22.0","20.0","23.0","25.0","27.0","25.0","26.0","28.0","30.0","14.0","14.0","13.0","20.0","18.0","19.0","20.0","22.0","22.0","26.0","28.0","28.0","20.0","35.0","30.0"],"confid3":["14.0","18.0","19.0","20.0","20.0","22.0","23.0","26.0","26.0","27.0","29.0","30.0","30.0","32.0","34.0","18.0","19.0","20.0","22.0","22.0","23.0","23.0","26.0","27.0","28.0","29.0","30.0","30.0","32.0","32.0"],"depress1":["44.0","42.0","40.0","43.0","44.0","43.0","37.0","46.0","37.0","50.0","39.0","44.0","47.0","38.0","50.0","45.0","42.0","49.0","39.0","39.0","44.0","43.0","33.0","39.0","47.0","38.0","45.0","50.0","45.0","34.0"],"depress2":["44.0","42.0","40.0","43.0","45.0","42.0","36.0","47.0","37.0","48.0","36.0","43.0","47.0","35.0","47.0","44.0","40.0","49.0","30.0","38.0","44.0","39.0","33.0","40.0","45.0","30.0","40.0","48.0","40.0","30.0"],"depress3":["40.0","40.0","38.0","43.0","43.0","38.0","35.0","42.0","35.0","46.0","34.0","40.0","47.0","35.0","45.0","40.0","39.0","44.0","30.0","36.0","44.0","37.0","32.0","40.0","42.0","29.0","38.0","50.0","42.0","32.0"],"exam":["52.0","55.0","58.0","60.0","58.0","62.0","59.0","70.0","60.0","70.0","72.0","82.0","79.0","80.0","90.0","56.0","53.0","59.0","64.0","63.0","64.0","63.0","67.0","71.0","73.0","80.0","83.0","85.0","78.0","84.0"],"fost1":["50.0","47.0","44.0","47.0","46.0","39.0","32.0","44.0","40.0","47.0","38.0","32.0","39.0","36.0","37.0","41.0","38.0","42.0","44.0","32.0","39.0","42.0","37.0","41.0","43.0","46.0","30.0","33.0","40.0","39.0"],"fost2":["48.0","45.0","39.0","42.0","45.0","40.0","33.0","37.0","40.0","45.0","37.0","28.0","35.0","32.0","36.0","40.0","37.0","41.0","39.0","31.0","40.0","38.0","38.0","40.0","36.0","40.0","28.0","29.0","30.0","36.0"],"fost3":["45.0","44.0","36.0","41.0","43.0","39.0","32.0","32.0","40.0","46.0","32.0","23.0","35.0","30.0","34.0","38.0","35.0","40.0","34.0","32.0","38.0","36.0","36.0","40.0","34.0","37.0","25.0","25.0","25.0","30.0"],"group":["2.0","2.0","1.0","1.0","2.0","1.0","2.0","1.0","2.0","1.0","2.0","1.0","1.0","1.0","2.0","1.0","1.0","1.0","2.0","1.0","1.0","2.0","1.0","1.0","2.0","2.0","2.0","2.0","2.0","2.0"],"id":["4.0","10.0","9.0","3.0","12.0","11.0","6.0","5.0","8.0","13.0","14.0","1.0","15.0","7.0","2.0","27.0","25.0","19.0","18.0","23.0","21.0","26.0","29.0","17.0","20.0","28.0","22.0","24.0","16.0","30.0"],"mah_1":["0.5699841856180975","1.6594030523640948","3.5404715296679132","2.454214336946473","0.9443035774539884","1.6257057755287583","4.174471731634222","1.0261058941319283","1.7053103413369513","3.087321393332276","2.914016344284633","0.34699776947198","1.5886240601451136","1.5076581612072992","10.240180362635149","1.1776466899748874","1.0564668233584227","3.874891021926158","2.7101640508965827","3.5488594177535093","0.500719166169066","1.4739117918895877","9.129575796885938","6.206584194486002","1.7190980705117975","1.5015533464444877","1.9240376343782855","7.557641133774945","1.1884922349412206","6.045590110850241"],"sex":["1.0","1.0","1.0","1.0","1.0","1.0","1.0","1.0","1.0","1.0","1.0","1.0","1.0","1.0","1.0","2.0","2.0","2.0","2.0","2.0","2.0","2.0","2.0","2.0","2.0","2.0","2.0","2.0","2.0","2.0"]}
      JSONObject:{}
    };
  },
  methods: {
    /** Upload File to server for data extraction */
    UploadDataFilesToServer: function(e) {
      e.preventDefault();
      // Show Loader
      this.secondStepShowLoader = true;
      // FormData to Post to server
      let formData = new FormData();
      formData.append("nameOfReport", this.nameOfReport);
      formData.append("file", this.fileObject);
      axios
        .post("/o/uploadfiles", formData, {
          headers: {
            username: "joel",
            "Content-Type": "application/x-www-form-urlencoded"
          }
        })
        // On receiving file data in JSON
        .then(response => {
          
          console.log(response.data);
          this.JSONObject = response.data
          this.firstStepDisplayForm = false
          this.secondStepShowLoader = false;
          this.thirdStepDisplayAnalysis = true
        })
        // On file reading error
        .catch(function(error) {
          console.log(error);
          // this.secondStepShowLoader = false;
        });
    },
    returnFrequency(arrayObject){
      let counts = {};
        for (let i = 0; i < arrayObject.length; i++) {
          let num = arrayObject[i];
          counts[num] = counts[num] ? counts[num] + 1 : 1;
        }
        return counts
    },

    /** Select Headers and analyze */
    ChooseHeadersAndProcess() {
      alert("sss");
    },

    addFormData(file, xhr, formData) {
      formData.append("file", file);

      axios
        .post(
          "/o/uploadfiles",
          {
            files: file
          },
          { headers: { id: "5c0aa01ec37d373a111a2835" } }
        )
        .then(response => {
          console.log(response);
          router.push("/dashboard");
        })
        .catch(errors => {
          alert("Invalid Credentials: " + errors);
        });
    },
    uploadStatus(file, response) {
      console.log(response);
      console.log(file);
    },
    uploadStatusFailed(file, message, xhr) {
      console.log(file);
      console.log(message);
      console.log(xhr);
    },
    startLoader() {
      //alert("Complete")
      this.firstStepDisplayForm = false;
    },
    validateFile(file, xhr, formData) {

      let acceptedfilelist = this.dropzoneOptions.acceptedFiles;
      let allow = false;
      acceptedfilelist.split(",").forEach(function(fileExtension) {
        if (file.name.includes(fileExtension)) {
          allow = true;
        }
      });
      if (!allow) {
        this.$refs.myVueDropzone.removeFile(file);
        alert("This operation is not allowed");
      }
    },
    handleFileUpload() {
      this.fileObject = this.$refs.file.files[0];
    }
  },
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
