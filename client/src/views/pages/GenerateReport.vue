<template>
  <div class="wrapper">
    <div v-if="displayDropZone">
      
     <vue-dropzone ref="myVueDropzone" id="dropzone" :options="dropzoneOptions"
     v-on:vdropzone-complete="startLoader"
     v-on:vdropzone-file-added="validateFile"
     v-on:vdropzone-sending="addFormData"
     v-on:vdropzone-success="uploadStatus"
     v-on:vdropzone-error="uploadStatusFailed"
     ></vue-dropzone>
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
      displayDropZone :true,
      dropzoneOptions: {
          url: '/o/uploadfiles',
          acceptedFiles:'.sav,.pdf,.csv,.xlxs',
          thumbnailWidth: 150,
          maxFilesize: 1,
          headers: { 'id': '5c0aa01ec37d373a111a2835' }
      }
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
