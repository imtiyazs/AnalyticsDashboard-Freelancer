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
                  >
                    <tab-content
                      title="Upload Report File"
                      :before-change="UploadDataFilesToServer"
                    >
                      <!-- <form v-on:submit="UploadDataFilesToServer"> -->
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
                          <label class="custom-file-label">Choose Report File (.sav, .xls, .xlsx)</label>
                        </div>
                      </div>
                      <!-- <div slot="footer" class="mt-5 float-right">
                          <b-button
                            :disabled="(nameOfReport=='' || nameOfReport== undefined) || (fileObject == null || fileObject == {})"
                            id="submit-btn"
                            type="submit"
                            variant="primary"
                          >
                            <i class="fa fa-dot-circle-o"></i> Generate Report Analysis
                          </b-button>
                      </div>-->
                      <!-- </form> -->
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
                startIndex="1"
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
      <b-button hidden @click="showModal">Open Modal</b-button>
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
                startIndex="2"
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
                    style="position: absolute;right: 6%;bottom: 81%;"
                    @click="showModal"
                  >
                    <i class="fa fa-download"></i> Download Report PDF
                  </b-button>
                  <div class="card-body">
                    <div class="row">
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
      //JSONObject: {"DepT1gp2":["0.0","0.0","0.0","0.0","0.0","0.0","0.0","1.0","0.0","1.0","0.0","0.0","1.0","0.0","1.0","1.0","0.0","1.0","0.0","0.0","0.0","0.0","0.0","0.0","1.0","0.0","1.0","1.0","1.0","0.0"],"DepT2Gp2":["0.0","0.0","0.0","0.0","1.0","0.0","0.0","1.0","0.0","1.0","0.0","0.0","1.0","0.0","1.0","0.0","0.0","1.0","0.0","0.0","0.0","0.0","0.0","0.0","1.0","0.0","0.0","1.0","0.0","0.0"],"DepT3gp2":["0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","1.0","0.0","0.0","1.0","0.0","1.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","1.0","0.0","0.0"],"age":["23.0","21.0","25.0","30.0","45.0","22.0","22.0","26.0","23.0","21.0","23.0","19.0","23.0","19.0","21.0","20.0","24.0","27.0","23.0","22.0","46.0","19.0","22.0","37.0","32.0","30.0","25.0","21.0","45.0","21.0"],"confid1":["15.0","14.0","12.0","11.0","16.0","13.0","21.0","17.0","22.0","20.0","28.0","20.0","21.0","24.0","29.0","16.0","14.0","15.0","13.0","22.0","21.0","13.0","28.0","29.0","17.0","20.0","24.0","12.0","22.0","21.0"],"confid2":["16.0","15.0","18.0","16.0","16.0","20.0","22.0","20.0","23.0","25.0","27.0","25.0","26.0","28.0","30.0","14.0","14.0","13.0","20.0","18.0","19.0","20.0","22.0","22.0","26.0","28.0","28.0","20.0","35.0","30.0"],"confid3":["14.0","18.0","19.0","20.0","20.0","22.0","23.0","26.0","26.0","27.0","29.0","30.0","30.0","32.0","34.0","18.0","19.0","20.0","22.0","22.0","23.0","23.0","26.0","27.0","28.0","29.0","30.0","30.0","32.0","32.0"],"depress1":["44.0","42.0","40.0","43.0","44.0","43.0","37.0","46.0","37.0","50.0","39.0","44.0","47.0","38.0","50.0","45.0","42.0","49.0","39.0","39.0","44.0","43.0","33.0","39.0","47.0","38.0","45.0","50.0","45.0","34.0"],"depress2":["44.0","42.0","40.0","43.0","45.0","42.0","36.0","47.0","37.0","48.0","36.0","43.0","47.0","35.0","47.0","44.0","40.0","49.0","30.0","38.0","44.0","39.0","33.0","40.0","45.0","30.0","40.0","48.0","40.0","30.0"],"depress3":["40.0","40.0","38.0","43.0","43.0","38.0","35.0","42.0","35.0","46.0","34.0","40.0","47.0","35.0","45.0","40.0","39.0","44.0","30.0","36.0","44.0","37.0","32.0","40.0","42.0","29.0","38.0","50.0","42.0","32.0"],"exam":["52.0","55.0","58.0","60.0","58.0","62.0","59.0","70.0","60.0","70.0","72.0","82.0","79.0","80.0","90.0","56.0","53.0","59.0","64.0","63.0","64.0","63.0","67.0","71.0","73.0","80.0","83.0","85.0","78.0","84.0"],"fost1":["50.0","47.0","44.0","47.0","46.0","39.0","32.0","44.0","40.0","47.0","38.0","32.0","39.0","36.0","37.0","41.0","38.0","42.0","44.0","32.0","39.0","42.0","37.0","41.0","43.0","46.0","30.0","33.0","40.0","39.0"],"fost2":["48.0","45.0","39.0","42.0","45.0","40.0","33.0","37.0","40.0","45.0","37.0","28.0","35.0","32.0","36.0","40.0","37.0","41.0","39.0","31.0","40.0","38.0","38.0","40.0","36.0","40.0","28.0","29.0","30.0","36.0"],"fost3":["45.0","44.0","36.0","41.0","43.0","39.0","32.0","32.0","40.0","46.0","32.0","23.0","35.0","30.0","34.0","38.0","35.0","40.0","34.0","32.0","38.0","36.0","36.0","40.0","34.0","37.0","25.0","25.0","25.0","30.0"],"group":["2.0","2.0","1.0","1.0","2.0","1.0","2.0","1.0","2.0","1.0","2.0","1.0","1.0","1.0","2.0","1.0","1.0","1.0","2.0","1.0","1.0","2.0","1.0","1.0","2.0","2.0","2.0","2.0","2.0","2.0"],"id":["4.0","10.0","9.0","3.0","12.0","11.0","6.0","5.0","8.0","13.0","14.0","1.0","15.0","7.0","2.0","27.0","25.0","19.0","18.0","23.0","21.0","26.0","29.0","17.0","20.0","28.0","22.0","24.0","16.0","30.0"],"mah_1":["0.5699841856180975","1.6594030523640948","3.5404715296679132","2.454214336946473","0.9443035774539884","1.6257057755287583","4.174471731634222","1.0261058941319283","1.7053103413369513","3.087321393332276","2.914016344284633","0.34699776947198","1.5886240601451136","1.5076581612072992","10.240180362635149","1.1776466899748874","1.0564668233584227","3.874891021926158","2.7101640508965827","3.5488594177535093","0.500719166169066","1.4739117918895877","9.129575796885938","6.206584194486002","1.7190980705117975","1.5015533464444877","1.9240376343782855","7.557641133774945","1.1884922349412206","6.045590110850241"],"sex":["1.0","1.0","1.0","1.0","1.0","1.0","1.0","1.0","1.0","1.0","1.0","1.0","1.0","1.0","1.0","2.0","2.0","2.0","2.0","2.0","2.0","2.0","2.0","2.0","2.0","2.0","2.0","2.0","2.0","2.0"]},
      //dashboardGeneratedData:{"fileName":"fileName - Reponse","reportName":"My Pillow Survey","userDetails":"fromStore","dashboardData":[ { "data": { "4.534498439556933e-05": 1, "0.015852389363875355": 1, "0.014042483113735044": 1, "0.0054038494713313625": 1, "0.0003755638492946378": 1, "0.01351416442949671": 1, "0.0023990697465923736": 1, "0.015902160376897446": 1, "0.008410372338932761": 1, "0.02586786482889496": 1, "0.0031414738765394522": 1, "0.04319952751936011": 1, "0.0008230486313564365": 2, "0.019913378213156255": 1, "0.00318284391206705": 1, "0.0004857985764822853": 1, "0.030894850471412643": 1, "0.03565627658718011": 1, "0.018358488296144473": 1, "0.0061438534224315606": 1, "0.010204610929408832": 1, "0.03501476738349707": 1, "0.001991027475930945": 1, "0.0017725158038427577": 1, "0.0002059886503267226": 1, "0.001448510983477224": 1, "0.0008759797012393136": 1, "0.0006054861975381485": 1, "0.0013831516254545252": 1, "nan": 13, "7.050506816639617e-09": 1, "0.0008547851113488733": 1, "0.006268356816208702": 1, "0.00170047657430261": 1, "0.000711367848936654": 1, "0.0005000611764950626": 1, "1.0712535180383798e-05": 1, "1.92758503114517e-07": 1, "0.003156935965171722": 1, "0.01498588910890879": 1, "0.011743878112129002": 1, "0.002887428884605515": 1, "0.003789709095602053": 1, "0.0023419969942979416": 1, "0.009681940886159358": 1, "0.0028932872894805606": 1, "0.0075441826904992255": 1, "0.01358443753617672": 1, "0.005605429577027091": 1, "0.0029832673504868296": 1, "0.008336095758645629": 1, "1.7271386835481156e-05": 1, "0.09448698060573754": 1, "0.053576416902436336": 1, "0.0006807980976351009": 1, "1.1146717292617013e-05": 1, "0.009982153316285245": 1, "0.00011213471575533023": 1, "0.0007360653319072269": 1, "8.354038507524807e-05": 1, "0.0001005955840160735": 1, "0.0002291269729383226": 2, "0.00576340704313631": 1, "0.0006077733546775979": 1, "7.487962981160663e-06": 1, "0.0004147322587661142": 1, "0.007621529556806266": 1, "0.008140481019981221": 1, "0.004240969186716101": 1, "0.007974530591165964": 1, "0.0003074130679695993": 3, "5.3080347859816744e-05": 1, "0.00018064940006693752": 1, "2.41166073422466e-05": 1, "0.013533523195025689": 1, "0.01645872530222506": 1, "0.0023368067888297275": 1, "0.0035013197978929146": 1, "0.00685546101355821": 1, "0.0007677553169336905": 1, "7.410645381330996e-10": 1, "0.0031989952804805794": 1, "0.012410918107543491": 1, "2.837016871566783e-05": 1, "0.0024989886967377575": 1, "0.0029975573530386895": 1, "0.001552944900145042": 1, "0.0002945288428550606": 2, "0.0008102541869546646": 1, "0.0029091064970764215": 1, "0.005841980115103888": 2, "0.004198568286440932": 1, "0.003918954768245285": 1, "0.0045809112288930105": 1, "3.935507179707166e-06": 1, "0.0010790299648710169": 1, "0.0019062545924490772": 1, "0.0023012433386300195": 1, "0.0024182184862611626": 1, "0.016024169404239806": 1, "0.0030580765006312737": 1, "0.0009013814347121667": 1, "0.0015694401249835956": 1, "3.5832601094390884e-06": 1, "0.000477590653885258": 1, "0.0046267868184229725": 1, "0.002390040269132612": 1, "0.001719543708845634": 1, "0.0014411341501883769": 1, "0.0013093331969360228": 1, "0.007945350782214812": 1, "1.3868108137675484e-06": 1, "0.0014993444605918625": 1, "0.00012896888142121512": 1, "0.002286600947813627": 1, "0.00029870277400716595": 1, "0.002476401869746889": 1, "4.551053923418134e-06": 1, "2.5856935574779857e-05": 2, "0.002057220024958845": 1, "5.087243538605825e-07": 1, "0.006344235698794156": 1, "0.002417257532403987": 1, "0.0045915939797123145": 1, "0.003180958775709934": 1, "0.0013037416069965361": 1, "0.0035110602903406264": 1, "5.107923361854142e-06": 1, "0.00010047330576680993": 1, "0.005470102044562048": 1, "9.954685763062565e-05": 1, "0.0007079224673835836": 1, "5.0087858751281575e-05": 1, "0.013947499123655322": 1, "0.0012201003771868985": 1, "0.05741228789438841": 1, "0.02333044273053611": 1, "0.00126009100686891": 1, "0.0003100937916021152": 1, "0.007542407242834017": 1, "0.0027968814488734117": 1, "0.00038563418050682074": 1, "1.9525234454141235e-05": 1, "0.0005004329482829486": 1, "0.0004232464906908701": 2, "0.00037352818036273156": 1, "0.01378956884800875": 1, "0.003974795372002709": 1, "0.00043349566293294665": 1, "0.0004424584643668585": 1, "0.0017508301075726078": 1, "0.005575370090547254": 1, "0.002006532496439192": 1, "0.0026093120517410276": 1, "0.0013978663967154927": 1, "0.0001360135502713873": 1, "6.28657691407975e-05": 1, "0.0016685091728142276": 1, "0.0020949591237022034": 1, "2.9013923904844525e-05": 1, "1.820828243877438e-05": 2, "0.0024004478117980858": 1, "0.00023231251218268958": 1, "0.0015101493189731104": 1, "0.0050085576221300205": 1, "0.0005324046489154359": 1, "6.047990213335832e-07": 1, "0.00013711590451839016": 1, "0.00043371474961584": 1, "0.0003010519653730643": 1, "7.741644828513181e-05": 1, "0.00014528342487529628": 1, "0.005373734090473819": 1, "0.0017267157261815931": 1, "0.0020541067670298797": 1, "0.0012573426070839984": 1, "0.0034779173587004223": 1, "0.00011349220492257526": 1, "0.001355268463180566": 1, "0.0014049578630014729": 1, "5.6903573696736e-05": 1, "7.518726340043998e-05": 1, "0.00014780513943066229": 1, "0.0019915094372222617": 1, "0.00019277868335113274": 1, "0.002032287386797998": 1, "0.0008467902161796414": 1, "0.00048260405955969103": 1, "0.0026720454386831294": 1, "0.0008986136291735814": 1, "0.003165114177382058": 1, "0.0032243921505687306": 1, "0.004429163133189812": 1, "0.0001389269751586221": 1, "0.010919550648613956": 1, "0.003388693508657095": 1, "8.165080857239146e-05": 1, "0.001311833536591702": 1, "0.0004907680269790767": 1, "0.0005224809569837804": 1, "3.104570481368925e-05": 2, "0.00045473994427255046": 1, "9.578825831335431e-05": 1, "0.006568274079880738": 1, "0.00010670312518605431": 1, "0.0014282798619625352": 1, "0.0018096845013154284": 1, "0.00027175544664036346": 1, "4.376245627047912e-05": 1, "0.0172230598885456": 1, "0.001301018656536421": 1, "0.0032343100324084663": 1, "0.001217648270391803": 1, "0.0005753163143416399": 1, "0.0013461352651752462": 1, "0.0019827240866237697": 1, "0.00017248060158318602": 1, "0.0004946570419923932": 1, "0.0005334352898469965": 2, "0.0017584690113576298": 1, "0.006235422592379773": 1, "0.0003464100394154728": 1, "0.00943315386838955": 1, "0.00023820243034105562": 1, "3.0961140708951952e-09": 2, "3.404683375148134e-06": 1, "4.395059512658447e-05": 1, "0.0013947637685139274": 1, "0.0001893480885936372": 1, "0.0019024918623440305": 1, "0.0007171277062007244": 1, "3.089240934762204e-05": 2, "0.00044831876782738925": 1, "0.008329872586151294": 1, "8.428300265679212e-05": 1, "0.00014363185686629655": 1, "0.00011431779683796254": 1, "2.8540486199467507e-06": 1, "0.0007870095516900076": 1, "0.0028056436195870965": 1, "4.765976497555513e-05": 1, "3.37055400515796e-05": 1, "0.0003201308652176757": 1, "0.00014264271293079476": 1, "0.0003883338537038338": 1, "1.3336419888912469e-06": 1, "3.81370322748871e-05": 1, "0.0019004254839102887": 1, "7.040462987908406e-09": 2, "0.0010895180039107984": 1, "0.0037691696762653898": 1, "0.0005672435643262954": 1, "0.000982532082787263": 1, "8.76573496796885e-05": 1, "0.001459321016571316": 1, "4.4980827517662954e-05": 1, "8.521667985231468e-07": 1, "0.0004096387013492274": 1, "0.0004040962746086485": 1, "0.0003278086073188565": 1, "0.00010169865160284698": 1, "0.0013647740738365376": 1, "6.0837253550553044e-05": 1, "0.0005144250824940869": 1, "2.53689676210276e-05": 1, "0.0001301353396212486": 1, "0.0002956137139160126": 1, "0.0002669483391319975": 1, "0.0056816011063689": 1, "0.0004189482655644864": 1, "0.00047128942540700054": 1, "0.003250609303374382": 1, "0.00022253777660975545": 1, "7.42947001174749e-05": 1, "0.0009652495794598751": 1, "0.007173881937800106": 1, "0.0004897196823838936": 1, "0.00012301919101962935": 1, "0.00030783639669004445": 1, "0.0005722918695814551": 1, "0.00023054590306733646": 1, "1.1622942516864058e-05": 2, "0.00014972273251826252": 1, "0.0012130433130873553": 1, "0.00029493101491207696": 1, "0.00031884250807471913": 1, "0.0004383658174491886": 1, "0.00026730563292070707": 1, "0.0005555720323080984": 1, "0.0007825215580073645": 1, "0.0007545074810974825": 1, "0.0005448025395357666": 1, "5.76864757039705e-05": 1, "9.618857470685804e-07": 1, "0.001080941121735568": 1, "0.0049054160204642224": 1, "2.46086238294058e-05": 1, "0.0017858813041056452": 1, "0.0003281210989530303": 1, "0.00039789743798637056": 1, "0.00023968899995135268": 1, "7.096887311290069e-07": 1, "1.015352981770113e-05": 1, "0.0002488516409696834": 1, "4.291870789767325e-06": 1, "0.00017400149309690978": 1, "0.0005122496888079246": 1, "2.819286522418429e-05": 1, "0.00048665700305792017": 1, "0.0009563482726902653": 1, "0.0017074451138780857": 1, "0.0018780757819255717": 1, "0.00028371518014405633": 1, "7.299783632315561e-06": 1, "4.5789091255570136e-05": 1, "0.0002075242544110512": 1, "0.0005980951962448941": 1, "0.0006182675376099609": 1, "0.0003036760300195532": 1, "0.0004626145100594274": 1, "0.0006918604005930169": 1, "0.001019855860473587": 1, "1.7392448039964483e-06": 1, "0.008545884782408503": 1, "4.856641930463161e-05": 1, "0.0012648603079338538": 1, "0.002113653016427774": 1, "0.0004259652442757445": 1, "8.159279882697267e-05": 2, "0.0009462526930049306": 1, "1.0316997065511561e-08": 1, "7.0725580155828905e-06": 1, "0.0031389255662539685": 1, "1.899341217679514e-05": 1, "0.00014835001793372463": 1, "0.0004923045675646058": 1, "0.0005599530182382699": 1, "0.004350076173211165": 1, "0.00023425955500278536": 1, "0.0007765954565548856": 1, "9.625011401601953e-07": 1, "0.00018676009696076026": 2, "0.0007784943065488342": 1, "4.437158158355925e-06": 1, "0.00018669810060069385": 1, "0.034474009218158644": 1, "1.0060045437534698e-05": 1, "0.005111683881085198": 1, "0.0006322386212430618": 1, "0.0001826425470357889": 1, "0.00013998230237501205": 1, "0.0003747021727599277": 1, "0.0008655257289621998": 1, "0.003083454470557123": 1, "0.0003522472024762732": 1, "1.916152413212826e-05": 1, "0.0004709695430857335": 1, "0.0006533980631723954": 1, "0.001731783629353015": 1, "9.19842297685087e-06": 1, "0.0012708439225076363": 1, "8.718849042485889e-05": 1, "0.0010844586019481237": 1, "0.0013810709001673865": 1, "8.376593456462299e-05": 1, "0.0012435926592974883": 1, "0.0013716210362187786": 1, "0.00017152092942454304": 1, "2.4919080607802896e-05": 1, "3.5700292938896277e-06": 1, "9.180852000815611e-05": 1, "0.002010840900972174": 1, "0.005191580386688548": 1, "0.00162885537318723": 1, "0.00023772677391557326": 1, "0.00023488088768802487": 1, "0.0011606594228631686": 1, "0.0010705399515260013": 1, "0.0026322540154473284": 1, "4.220009291908709e-06": 1, "7.676504020386688e-06": 1, "2.8627485063857992e-05": 1, "0.037616935314662356": 1, "0.00011197434047395922": 1, "0.000185232511703808": 1, "0.00013131659103771912": 1, "4.170349625587389e-05": 1, "0.00036078510148175564": 1, "4.912756766977389e-05": 1, "3.922031056990924e-06": 1, "0.0014275044763903241": 1, "1.0103056502891073e-05": 1, "0.0001521117690929228": 1, "3.914580429693587e-05": 1, "0.00021997863403914458": 1, "0.00037607548920511367": 1, "0.005350112205888032": 1, "1.486722924189773e-06": 1, "0.004356609369701397": 1, "0.00022309930523606753": 2, "0.0037363738614012575": 1, "6.374436143660718e-05": 1, "7.177535789082229e-06": 1, "4.080881085758578e-05": 1, "0.002997893298170226": 1, "0.00017346593633391373": 1, "0.0001189012824999272": 1, "0.0006447029777611105": 1, "0.00039855935169620915": 1 }, "typeOfGraph": "BarGraph", "columnName": "COO_1" }, { "data": { "3.0": 164, "2.0": 193, "5.0": 5, "4.0": 31, "1.0": 40, "nan": 6 }, "typeOfGraph": "BarGraph", "columnName": "Rpss8" }, { "data": { "3.0": 169, "1.0": 32, "2.0": 202, "4.0": 27, "5.0": 3, "nan": 6 }, "typeOfGraph": "PieGraph", "columnName": "Rpss7" }, { "data": { "0.0": 278, "1.0": 157, "nan": 4 }, "typeOfGraph": "PieGraph", "columnName": "m10" }, { "data": { "3.0": 95, "1.0": 170, "2.0": 125, "4.0": 46, "nan": 3 }, "typeOfGraph": "PieGraph", "columnName": "sest9" } ]},
      analyticsDashboardName: "",
      dashboardGeneratedData: {},
      JSONObject: {},
      userProfileData: {}
    };
  },
  methods: {
    CapitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    },
    selectGraph: function(e) {
      alert("clicl");
    },
    /** Upload File to server for data extraction */
    UploadDataFilesToServer: function() {
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
          console.log(response);
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

    /** Select Headers and analyze */
    // ChooseHeadersAndProcess() {
    //   alert("sss");
    // },

    // addFormData(file, xhr, formData) {
    //   formData.append("file", file);

    //   axios
    //     .post(
    //       "/o/uploadfiles",
    //       {
    //         files: file
    //       },
    //       { headers: { id: "5c0aa01ec37d373a111a2835" } }
    //     )
    //     .then(response => {
    //       console.log(response);
    //       router.push("/dashboard");
    //     })
    //     .catch(errors => {
    //       alert("Invalid Credentials: " + errors);
    //     });
    // },
    // uploadStatus(file, response) {
    //   console.log(response);
    //   console.log(file);
    // },
    // uploadStatusFailed(file, message, xhr) {
    //   console.log(file);
    //   console.log(message);
    //   console.log(xhr);
    // },
    // startLoader() {
    //   this.firstStepDisplayForm = false;
    // },
    // validateFile(file, xhr, formData) {

    //   let acceptedfilelist = this.dropzoneOptions.acceptedFiles;
    //   let allow = false;
    //   acceptedfilelist.split(",").forEach(function(fileExtension) {
    //     if (file.name.includes(fileExtension)) {
    //       allow = true;
    //     }
    //   });
    //   if (!allow) {
    //     this.$refs.myVueDropzone.removeFile(file);
    //     alert("This operation is not allowed");
    //   }
    // },
    handleFileUpload() {
      this.fileObject = this.$refs.file.files[0];
    },
    showModal() {
      this.$refs.myModalRef.show();
    },
    hideModal() {
      this.$refs.myModalRef.hide();
    },
    generateDashboard() {
      console.log("In generateDashboard ");

      //axios to record dashboard into mongo
      let dashboardDetails = {
        reportName: this.nameOfReport,
        fileName: "toBeChanges",
        userName: this.userProfileData.username,
        analyticsDashboardName: this.analyticsDashboardName,
        reportData: this.JSONObject,
        analyticsData: this.dashboardData
      };

      console.log("dashboardDetails :: ");
      console.log(dashboardDetails);
      this.thirdStepDisplayAnalysis = false;
      this.fourthStepShowLoader = true;

      axios
        .post("/o/uploadreport", dashboardDetails)
        // On receiving file data in JSON
        .then(response => {
          console.log(response.data);
          this.dashboardGeneratedData.fileName = "toBeChanges.asap";
          this.dashboardGeneratedData.reportName = this.nameOfReport;
          this.dashboardGeneratedData.dashboardData = this.dashboardData;

          // hide all & Show dashboard
          this.fourthStepShowLoader = false;
          this.fifthStepDisplayDashboard = true;
        })
        .catch(function(error) {
          console.log(error);
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
        //console.log(response.data)
        // this.userProfileData.username = response.data.username;
        // this.userProfileData.email = response.data.email;
        // this.userProfileData.role = response.data.role;
        // this.userProfileData.firstName = response.data.firstName;
        // this.userProfileData.lastName = response.data.lastName;
        // this.userProfileData.email = response.data.email;
        // this.userProfileData.phone = response.data.phone;
        // this.userProfileData.address1 = response.data.address1;
        // this.userProfileData.address2 = response.data.address2;
        // this.userProfileData.city = response.data.city;
        // this.userProfileData.state = response.data.state;
        // this.userProfileData.country = response.data.country;
        // this.userProfileData.zip = response.data.zip;

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
