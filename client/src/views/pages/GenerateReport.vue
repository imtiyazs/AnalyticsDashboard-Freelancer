<template>
  <div class="wrapper">
    <div v-if="displayDropZone">
     <vue-dropzone ref="myVueDropzone" id="dropzone" :options="dropzoneOptions"
     v-on:vdropzone-complete="startLoader"
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
          url: 'https://httpbin.org/post',
          thumbnailWidth: 150,
          maxFilesize: 0.5,
          headers: { "My-Awesome-Header": "header value" }
      }
    };
  },
  methods: {
    startLoader(){
      //alert("Complete")
      this.displayDropZone = false
    }
  },
  mounted() {
    /** Check User Logged In */
    let self = this;
    axios
      .get("/o/user")
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
