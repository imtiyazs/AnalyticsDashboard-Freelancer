<template>
  <div class="wrapper">
    <div class="animated fadeIn">
      <b-row>
        <b-col cols="12"></b-col>
      </b-row>
    </div>
  </div>
</template>


<script>
import router from "../../router";
import axios from "axios";

export default {
  name: "ReportHistory",
  data() {
    return {};
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
