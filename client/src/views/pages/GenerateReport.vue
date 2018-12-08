<template>
  <div class="wrapper">
    <div v-if="displayDropZone">
      <b-col md="9">
        <b-card>
          <div slot="header">
            <strong>Creating your report</strong>
          </div>
          <b-form>
          <b-form-group
            description="Enter name of analysis report."
            label="Enter name of analysis report :- "
            label-for="nameOfReport"
            :label-cols="4"
            :horizontal="true">
            <b-form-input id="basicName" type="text"  v-model="nameOfReport" autocomplete="name"></b-form-input>
          </b-form-group>
          <!-- <b-form-group
            label="Static"
            label-for="basicStatic"
            :label-cols="3"
            :horizontal="true">
            <b-form-input plaintext id="basicStatic" type="text" value="Username"></b-form-input>
          </b-form-group>
          <b-form-group
            description="This is a help text"
            label="Text Input"
            label-for="basicText"
            :label-cols="3"
            :horizontal="true">
            <b-form-input id="basicText" type="text" placeholder="Text"></b-form-input>
          </b-form-group>
          <b-form-group
            label="Date" label-for="date"
            :label-cols="3"
            :horizontal="true">
            <b-form-input type="date" id="date"></b-form-input>
          </b-form-group>
          <b-form-group
            description="Please enter your email"
            label="Email Input"
            label-for="basicEmail"
            :label-cols="3"
            :horizontal="true">
            <b-form-input id="basicEmail" type="email" placeholder="Enter your email" autocomplete="email"></b-form-input>
          </b-form-group>
          <b-form-group
            description="Please enter a complex password"
            label="Password Input"
            label-for="basicPassword"
            :label-cols="3"
            :horizontal="true">
            <b-form-input id="basicPassword" type="password" placeholder="Enter your password" autocomplete="current-password"></b-form-input>
          </b-form-group>
          <b-form-group
            label="Disabled Input"
            label-for="basicInputDisabled"
            :label-cols="3"
            :horizontal="true">
            <b-form-input id="basicInputDisabled" type="text" :disabled="true" placeholder="Disabled"></b-form-input>
          </b-form-group>
          <b-form-group
            label="Textarea"
            label-for="basicTextarea"
            :label-cols="3"
            :horizontal="true">
            <b-form-input id="basicTextarea" :textarea="true" :rows="9" placeholder="Content.."></b-form-input>
          </b-form-group>
          <b-form-group
            label="Select"
            label-for="basicSelect"
            :label-cols="3"
            :horizontal="true">
            <b-form-select id="basicSelect"
              :plain="true"
              :options="['Please select','Option 1', 'Option 2', 'Option 3']"
              value="Please select">
            </b-form-select>
          </b-form-group>
          <b-form-group
            label="Select large"
            label-for="basicSelectLg"
            :label-cols="3"
            :horizontal="true">
            <b-form-select id="basicSelectLg"
              size="lg"
              :plain="true"
              :options="['Please select','Option 1', 'Option 2', 'Option 3']"
              value="Please select">
            </b-form-select>
          </b-form-group>
          <b-form-group
            label="Select small"
            label-for="basicSelectSm"
            :label-cols="3"
            :horizontal="true">
            <b-form-select id="basicSelectSm"
              size="sm"
              :plain="true"
              :options="['Please select','Option 1', 'Option 2', 'Option 3']"
              value="Please select">
            </b-form-select>
          </b-form-group>
          <b-form-group
            label="Disabled select"
            label-for="basicSelectDisabled"
            :label-cols="3"
            :horizontal="true">
            <b-form-select id="basicSelectDisabled"
              :plain="true"
              :options="['Please select','Option 1', 'Option 2', 'Option 3']"
              :disabled="true"
              value="Please select">
            </b-form-select>
          </b-form-group>
          <b-form-group
            label="Select"
            label-for="basicMultiSelect"
            :label-cols="3"
            :horizontal="true">
            <b-form-select id="basicMultiSelect"
              :plain="true"
              :multiple="true"
              :options="[
                {
                  text: 'Please select some item',
                  value: null
                },
                {
                  text: 'This is First option',
                  value: 'a'
                }, {
                  text: 'Default Selected Option',
                  value: 'b'
                }, {
                  text: 'This is another option',
                  value: 'c'
                }, {
                  text: 'This one is disabled',
                  value: 'd',
                  disabled: true
                }]"
              :value="[null,'c']">
            </b-form-select>
          </b-form-group>
          <b-form-group
            label="Radios"
            label-for="basicRadios"
            :label-cols="3"
            :horizontal="true">
            <b-form-radio-group id="basicRadios"
              :plain="true"
              :options="[
                {text: 'Option 1 ',value: '1'},
                {text: 'Option 2 ',value: '2'},
                {text: 'Option 3 ',value: '3'}
              ]"
              checked="2"
              stacked>
            </b-form-radio-group>
          </b-form-group>
          <b-form-group
            label="Inline radios"
            label-for="basicInlineRadios"
            :label-cols="3"
            :horizontal="true">
            <b-form-radio-group id="basicInlineRadios"
              :plain="true"
              :options="[
                {text: 'Option 1 ',value: '1'},
                {text: 'Option 2 ',value: '2'},
                {text: 'Option 3 ',value: '3'}
              ]"
              :checked="3">
            </b-form-radio-group>
          </b-form-group> -->

          <!-- <b-form-group
            label="Checkboxes"
            label-for="basicCheckboxes"
            :label-cols="3"
            horizontal>
            <b-form-checkbox-group stacked id="basicCheckboxes" name="Checkboxes" :plain="true" :checked="[2,3]">
              <b-form-checkbox value="1">Option 1</b-form-checkbox>
              <b-form-checkbox value="2">Option 2</b-form-checkbox>
              <b-form-checkbox value="3">Option 3</b-form-checkbox>
            </b-form-checkbox-group>
          </b-form-group> -->
          <!-- <b-form-group
            label="Inline checkboxes"
            label-for="basicInlineCheckboxes"
            :label-cols="3"
            :horizontal="true">
            <b-form-checkbox-group id="basicInlineCheckboxes" name="InlineCheckboxes" :plain="true" :checked="[1,3]">
              <b-form-checkbox :plain="true" value="1">Option 1</b-form-checkbox>
              <b-form-checkbox :plain="true" value="2">Option 2</b-form-checkbox>
              <b-form-checkbox :plain="true" value="3">Option 3</b-form-checkbox>
            </b-form-checkbox-group>
          </b-form-group> -->
          <!--custom controls - radios/checkboxes - temporary fix-->
          <!-- <b-form-group
            label="Radios - custom"
            label-for="basicRadiosCustom"
            :label-cols="3"
            :horizontal="true">
            <b-form-radio-group
              id="basicRadiosCustom"
              value="1"
              stacked>
              <div class="custom-control custom-radio">
                <input type="radio" id="customRadio1" name="customRadio" class="custom-control-input" value="1">
                <label class="custom-control-label" for="customRadio1">Option 1</label>
              </div>
              <div class="custom-control custom-radio">
                <input type="radio" id="customRadio2" name="customRadio" class="custom-control-input" value="2" checked>
                <label class="custom-control-label" for="customRadio2">Option 2</label>
              </div>
              <div class="custom-control custom-radio">
                <input type="radio" id="customRadio3" name="customRadio" class="custom-control-input" value="3">
                <label class="custom-control-label" for="customRadio3">Option 3</label>
              </div>
            </b-form-radio-group>
          </b-form-group> -->
          <!-- <b-form-group
            label="Inline radios - custom"
            label-for="basicCustomRadios1"
            :label-cols="3"
            :horizontal="true">
            <b-form-radio-group
              id="basicCustomRadios1"
              name="customRadioInline1">
              <div class="custom-control custom-radio custom-control-inline">
                <input type="radio" id="customRadioInline1" name="customRadioInline1" class="custom-control-input" value="1">
                <label class="custom-control-label" for="customRadioInline1">Option 1</label>
              </div>
              <div class="custom-control custom-radio custom-control-inline">
                <input type="radio" id="customRadioInline2" name="customRadioInline1" class="custom-control-input" value="2" checked>
                <label class="custom-control-label" for="customRadioInline2">Option 2</label>
              </div>
              <div class="custom-control custom-radio custom-control-inline">
                <input type="radio" id="customRadioInline3" name="customRadioInline1" class="custom-control-input" value="3">
                <label class="custom-control-label" for="customRadioInline3">Option 3</label>
              </div>
            </b-form-radio-group>
          </b-form-group> -->
          <!-- <b-form-group
            label="Checkboxes - custom"
            label-for="basicCustomCheckboxes"
            :label-cols="3"
            :horizontal="true">
            <b-form-checkbox-group stacked id="basicCustomCheckboxes">
              <div class="custom-control custom-checkbox">
                <input type="checkbox" class="custom-control-input" id="customChk1" value="1" checked>
                <label class="custom-control-label" for="customChk1">Option 1</label>
              </div>
              <div class="custom-control custom-checkbox">
                <input type="checkbox" class="custom-control-input" id="customChk2" value="2">
                <label class="custom-control-label" for="customChk2">Option 2</label>
              </div>
              <div class="custom-control custom-checkbox">
                <input type="checkbox" class="custom-control-input" id="customChk3" value="3">
                <label class="custom-control-label" for="customChk3">Option 3</label>
              </div>
            </b-form-checkbox-group>
          </b-form-group> -->
          <!-- <b-form-group
            label="Inline checkboxes - custom"
            label-for="basicInlineCustomCheckboxes"
            :label-cols="3"
            :horizontal="true">
            <b-form-checkbox-group id="basicInlineCustomCheckboxes">
              <div class="custom-control custom-checkbox custom-control-inline">
                <input type="checkbox" class="custom-control-input" id="customInChk1" value="1">
                <label class="custom-control-label" for="customInChk1">Option 1</label>
              </div>
              <div class="custom-control custom-checkbox custom-control-inline">
                <input type="checkbox" class="custom-control-input" id="customInChk2" value="2" checked>
                <label class="custom-control-label" for="customInChk2">Option 2</label>
              </div>
              <div class="custom-control custom-checkbox custom-control-inline">
                <input type="checkbox" class="custom-control-input" id="customInChk3" value="3">
                <label class="custom-control-label" for="customInChk3">Option 3</label>
              </div>
            </b-form-checkbox-group>
          </b-form-group> -->
          <b-form-group
            label="File input :- "
            label-for="fileInput"
            :label-cols="4"
            :horizontal="true">
              <!-- <b-form-file id="file" ref="file" v-on:change="handleFileUpload" :plain="true"></b-form-file> -->
              <input type="file" id="file" ref="file" v-on:change="handleFileUpload" :plain="true">
          </b-form-group>
          <!-- <b-form-group
            label="Multiple file input"
            label-for="fileInputMulti"
            :label-cols="3"
            :horizontal="true">
              <b-form-file id="fileInputMulti" :plain="true" :multiple="true"></b-form-file>
          </b-form-group> -->
          <div slot="footer">
            <b-button type="button" size="sm" variant="primary" @click="submitCreateReport" ><i class="fa fa-dot-circle-o"></i> Submit</b-button>
            <!-- <b-button type="reset" size="sm" variant="danger"><i class="fa fa-ban"></i> Reset</b-button> -->
          </div>
          </b-form>
        </b-card>
        
      </b-col>
     <!-- <vue-dropzone ref="myVueDropzone" id="dropzone" :options="dropzoneOptions"
     v-on:vdropzone-complete="startLoader"
     v-on:vdropzone-file-added="validateFile"
     v-on:vdropzone-sending="addFormData"
     v-on:vdropzone-success="uploadStatus"
     v-on:vdropzone-error="uploadStatusFailed"
     ></vue-dropzone> -->
    </div>
    <div v-if="!displayDropZone" style="position:fixed;top:50%;left:50%">
      <center>
      <rotate-square5></rotate-square5>
      <br>
      Generating Your Reports...
      </center>
    </div>
    <div class="animated fadeIn">
      <b-row>
        <b-col cols="12"></b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
import vue2Dropzone from 'vue2-dropzone'
import 'vue2-dropzone/dist/vue2Dropzone.min.css'
import {RotateSquare5} from 'vue-loading-spinner'
import router from "../../router";
import axios from "axios";

export default {
  name: "GenerateReport",
  components:{
    vueDropzone: vue2Dropzone,
    RotateSquare5
  },
  data() {
    return {
      nameOfReport:"",
      fileObject : null,
      displayDropZone :true,
      // dropzoneOptions: {
      //     url: '/o/uploadfiles',
      //     acceptedFiles:'.sav,.pdf,.csv,.xlxs',
      //     thumbnailWidth: 150,
      //     maxFilesize: 1,
      //     headers: { 'id': '5c0aa01ec37d373a111a2835' }
      // }
    };
  },
  methods: {
    addFormData(file, xhr, formData){
      formData.append('file', file)

      axios
        .post("/o/uploadfiles", {
          "files":file
        },
        {headers : { 'id': '5c0aa01ec37d373a111a2835' }})
        .then(response => {
          console.log(response);
          router.push("/dashboard");
        })
        .catch(errors => {
          alert("Invalid Credentials: " + errors);
        });
    },
    uploadStatus(file, response){
      console.log(response)
      console.log(file)
    },
    uploadStatusFailed(file, message, xhr){
      console.log(file)
      console.log(message)
      console.log(xhr)
    },
    startLoader(){
      //alert("Complete")
      this.displayDropZone = false
    },
    validateFile(file, xhr, formData){
      //alert(file.name)
      //console.log(this.dropzoneOptions.acceptedFiles)
      let acceptedfilelist = this.dropzoneOptions.acceptedFiles 
      let allow = false
      // console.log(acceptedfilelist.split(","))
      // console.log(file.name.split(".")[1])
      acceptedfilelist.split(",").forEach(function(fileExtension) {
        //if (fileExtension == file.name.split(".")[1]){
        if (file.name.includes(fileExtension)){
          // console.log(fileExtension)
          // console.log("Allowed")
          allow = true
          //console.log(allow)
        }
      });
      if (!allow) {
        this.$refs.myVueDropzone.removeFile(file)
        alert("This operation is not allowed")
      }
      
    },
    handleFileUpload(){
      this.fileObject = this.$refs.file.files[0];
      console.log("In handleFileUpload")
      console.log(this.fileObject)
    },
    submitCreateReport(){
      let formData = new FormData();
      formData.append('nameOfReport', this.nameOfReport);
      formData.append('file', this.fileObject);
      axios.post('/o/uploadfiles',
      formData, 
      {
        headers: { 
          'id': '5c0aa01ec37d373a111a2835' ,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then(function(){
          console.log('SUCCESS!!');
        })
        .catch(function(){
          console.log('FAILURE!!');
        });
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
