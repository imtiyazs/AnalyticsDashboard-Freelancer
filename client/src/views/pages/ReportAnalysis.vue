<template>
  <div class="wrapper">
    <div v-if="displayDropZone">
      <div class="row">
        <div class="animated fadeIn col-6">
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
                <!-- <b-form-group
            label="Multiple file input"
            label-for="fileInputMulti"
            :label-cols="3"
            :horizontal="true">
              <b-form-file id="fileInputMulti" :plain="true" :multiple="true"></b-form-file>
                </b-form-group>-->
                <div slot="footer" class="mt-5 float-right">
                  <b-button
                    :disabled="showLoader"
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
        <div v-if="showLoader" class="animated fadeIn col-4">
          <b-card-group>
            <div style="position: absolute;top: 45%;left: 70%;">
              <rotate-square5></rotate-square5>
            </div>
            <span style="position: absolute;top: 65%;left: 55%;">Generating Report Analysis</span>
          </b-card-group>
        </div>
      </div>
      <!-- <vue-dropzone ref="myVueDropzone" id="dropzone" :options="dropzoneOptions"
     v-on:vdropzone-complete="startLoader"
     v-on:vdropzone-file-added="validateFile"
     v-on:vdropzone-sending="addFormData"
     v-on:vdropzone-success="uploadStatus"
     v-on:vdropzone-error="uploadStatusFailed"
      ></vue-dropzone>-->
    </div>
  </div>
</template>

<script>
import vue2Dropzone from "vue2-dropzone";
import "vue2-dropzone/dist/vue2Dropzone.min.css";
import { RotateSquare5 } from "vue-loading-spinner";
import router from "../../router";
import axios from "axios";

export default {
  name: "ReportAnalysis",
  components: {
    vueDropzone: vue2Dropzone,
    RotateSquare5
  },
  data() {
    return {
      showLoader: false,
      nameOfReport: "",
      fileObject: null,
      displayDropZone: true,
      self: this
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
    /** Upload File to server for data extraction */
    UploadDataFilesToServer: function(e) {
      e.preventDefault();
      // Show Loader
      this.showLoader = true;
      // FormData to Post to server
      let formData = new FormData();
      formData.append("nameOfReport", this.nameOfReport);
      formData.append("file", this.fileObject);
      axios
        .post("/o/uploadfiles", formData, {
          headers: {
            username: "asd",
            "Content-Type": "application/x-www-form-urlencoded"
          }
        })
        // On receiving file data in JSON
        .then(response => {
          // this.showLoader = false;
          console.log(response.data);
        })
        // On file reading error
        .catch(function(error) {
          console.log(error);
          // this.showLoader = false;
        });
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
      this.displayDropZone = false;
    },
    validateFile(file, xhr, formData) {
      //alert(file.name)
      //console.log(this.dropzoneOptions.acceptedFiles)
      let acceptedfilelist = this.dropzoneOptions.acceptedFiles;
      let allow = false;
      // console.log(acceptedfilelist.split(","))
      // console.log(file.name.split(".")[1])
      acceptedfilelist.split(",").forEach(function(fileExtension) {
        //if (fileExtension == file.name.split(".")[1]){
        if (file.name.includes(fileExtension)) {
          // console.log(fileExtension)
          // console.log("Allowed")
          allow = true;
          //console.log(allow)
        }
      });
      if (!allow) {
        this.$refs.myVueDropzone.removeFile(file);
        alert("This operation is not allowed");
      }
    },
    handleFileUpload() {
      this.fileObject = this.$refs.file.files[0];
      console.log("In handleFileUpload");
      console.log(this.fileObject);
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
