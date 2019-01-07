<template>
  <div class="row">
    <div class="col-3">
      <div class="card-group" style="height: 100%;">
        <div class="card" style="width: 18rem;">
          <img class="card-img-top" style="height:200px" src="img/avatars/1.jpg">
          <div class="card-body">
            <h5 class="card-title">{{ CapitalizeFirstLetter(userProfileData.username) }}</h5>
            <p
              class="card-text"
              style="font-size: 11px;"
            >Last Login: {{ new Date(userProfileData.lastlogin).toDateString()}}</p>
          </div>
          <ul class="list-group list-group-flush">
            <li class="list-group-item">
              User Priviledge:
              <strong>{{ CapitalizeFirstLetter(userProfileData.role)}}</strong>
            </li>
            <li class="list-group-item">
              Total File Uploads:
              <strong>{{dashboardData.totalFilesUploaded}}</strong>
            </li>
            <li class="list-group-item">
              Total Reports:
              <strong>{{dashboardData.totalReportsGenerated}}</strong>
            </li>
          </ul>
          <div class="card-body"></div>
        </div>
      </div>
    </div>
    <div class="col-9">
      <div class="card text-center" style="height:100%">
        <div class="card-header">
          <ul class="nav nav-tabs card-header-tabs">
            <li class="nav-item" @click="ToggleSection('section1')">
              <a id="section1-nav" class="nav-link active">Edit Profile</a>
            </li>
            <li class="nav-item" @click="ToggleSection('section2')">
              <a id="section2-nav" class="nav-link">Change Password</a>
            </li>
            <li class="nav-item" @click="ToggleSection('section3')">
              <a id="section3-nav" class="nav-link">Account Settings</a>
            </li>
          </ul>
        </div>
        <div class="card-body" v-if="section1" id="section1">
          <form class="mt-4" v-on:submit="UpdateProfile">
            <div class="form-row">
              <div class="input-group mb-3 col-md-6">
                <div class="input-group-prepend">
                  <span class="input-group-text" id="first-name-inp">First Name</span>
                </div>
                <input
                  type="text"
                  class="form-control"
                  aria-label="Default"
                  aria-describedby="first-name-inp"
                  v-model="userProfileData.firstName"
                >
              </div>

              <div class="input-group mb-3 col-md-6">
                <div class="input-group-prepend">
                  <span class="input-group-text" id="last-name-inp">Last Name</span>
                </div>
                <input
                  type="text"
                  class="form-control"
                  aria-label="Default"
                  aria-describedby="last-name-inp"
                  v-model="userProfileData.lastName"
                >
              </div>

              <div class="input-group mb-3 col-md-6">
                <div class="input-group-prepend">
                  <span class="input-group-text" id="email-inp">Email ID</span>
                </div>
                <input
                  type="email"
                  class="form-control"
                  aria-label="Default"
                  aria-describedby="email-inp"
                  v-model="userProfileData.email"
                >
              </div>

              <div class="input-group mb-3 col-md-6">
                <div class="input-group-prepend">
                  <span class="input-group-text" id="mobile-inp">Mobile / Phone no.</span>
                </div>
                <input
                  type="number"
                  class="form-control"
                  aria-label="Default"
                  aria-describedby="mobile-inp"
                  v-model="userProfileData.phone"
                >
              </div>

              <div class="input-group mb-3 col-md-6">
                <div class="input-group-prepend">
                  <span class="input-group-text" id="address-1-inp">Address Line 1</span>
                </div>
                <input
                  type="text"
                  class="form-control"
                  aria-label="Default"
                  aria-describedby="address-1-inp"
                  v-model="userProfileData.address1"
                >
              </div>

              <div class="input-group mb-3 col-md-6">
                <div class="input-group-prepend">
                  <span class="input-group-text" id="address-2-inp">Address Line 2</span>
                </div>
                <input
                  type="text"
                  class="form-control"
                  aria-label="Default"
                  aria-describedby="address-2-inp"
                  v-model="userProfileData.address2"
                >
              </div>

              <div class="input-group mb-3 col-md-6">
                <div class="input-group-prepend">
                  <span class="input-group-text" id="city-inp">City</span>
                </div>
                <input
                  type="text"
                  class="form-control"
                  aria-label="Default"
                  aria-describedby="city-inp"
                  v-model="userProfileData.city"
                >
              </div>

              <div class="input-group mb-3 col-md-6">
                <div class="input-group-prepend">
                  <span class="input-group-text" id="state-inp">State</span>
                </div>
                <input
                  type="text"
                  class="form-control"
                  aria-label="Default"
                  aria-describedby="state-inp"
                  v-model="userProfileData.state"
                >
              </div>

              <div class="input-group mb-3 col-md-6">
                <div class="input-group-prepend">
                  <span class="input-group-text" id="country-inp">Country</span>
                </div>
                <input
                  type="text"
                  class="form-control"
                  aria-label="Default"
                  aria-describedby="country-inp"
                  v-model="userProfileData.country"
                >
              </div>

              <div class="input-group mb-3 col-md-6">
                <div class="input-group-prepend">
                  <span class="input-group-text" id="zip-inp">Zip Code</span>
                </div>
                <input
                  type="text"
                  class="form-control"
                  aria-label="Default"
                  aria-describedby="zip-inp"
                  v-model="userProfileData.zip"
                >
              </div>
            </div>
            <button type="submit" class="btn btn-primary float-left mt-3">Update Profile</button>
          </form>
        </div>
        <div class="card-body" v-if="section2" id="section2">
          <b-alert show variant="warning">
            <h4 class="alert-heading text-left">Change Password</h4>
            <p class="text-left">Note: Please make sure you type passwords correctly.</p>
          </b-alert>
          <form v-on:submit="ChangePassword">
            <div class="row mt-4">
              <div class="input-group mb-3 col-md-6">
                <div class="input-group-prepend">
                  <span class="input-group-text" id="oldpass-1-inp">Old Password</span>
                </div>
                <input
                  type="password"
                  class="form-control"
                  aria-label="Default"
                  aria-describedby="address-1-inp"
                  v-model="userPassChange.oldPass"
                >
              </div>
            </div>
            <div class="row">
              <div class="input-group mb-3 col-md-6">
                <div class="input-group-prepend">
                  <span class="input-group-text" id="newpass-1-inp">New Password</span>
                </div>
                <input
                  type="password"
                  class="form-control"
                  aria-label="Default"
                  aria-describedby="address-1-inp"
                  v-model="userPassChange.newPass"
                >
              </div>
            </div>
            <div class="row">
              <div class="input-group mb-3 col-md-6">
                <div class="input-group-prepend">
                  <span class="input-group-text" id="confirmpass-1-inp">Repeat Password</span>
                </div>
                <input
                  type="password"
                  class="form-control"
                  aria-label="Default"
                  aria-describedby="address-1-inp"
                  v-model="userPassChange.confirmPass"
                >
              </div>
            </div>
            <b-button type="submit" class="btn btn-primary float-left mt-3" variant="primary">Change Password</b-button>
          </form>
        </div>
        <div class="card-body" v-if="section3" id="section3">
          <b-alert show variant="danger">
            <h4 class="alert-heading text-left">Account Deletion Alert</h4>
            <p class="text-left">
              Note: Please note all the user data i.e. files and reports will be deleted from the server after
              account deactivation. In case of reactivation, the account may restore the reports from server.
            </p>
            <hr>
            <p class="mb-0 text-left">Please enter the account password to proceed</p>
          </b-alert>
          <form v-on:submit="DeleteAccount">
            <div class="row">
              <div class="input-group mb-3 col-md-6">
                <div class="input-group-prepend">
                  <span class="input-group-text">Account Password</span>
                </div>
                <input
                  type="password"
                  class="form-control"
                  aria-label="Default"
                  v-model="deletionPassword"
                  required
                >
              </div>
            </div>
            <button type="submit" class="btn btn-danger float-left mt-3">Deactivate Account</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import router from "../router";

export default {
  name: "Profile",
  data() {
    return {
      user: {},
      section1: true,
      section2: false,
      section3: false,
      deletionPassword: "",
      userPassChange: {
        oldPass: "",
        newPass: "",
        confirmPass: ""
      },
      userProfileData: {
        username: "",
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address1: "",
        address2: "",
        city: "",
        state: "",
        country: "",
        zip: "",
        role: "",
        lastlogin: ""
      },
      dashboardData: {
        totalFilesUploaded: null,
        totalReportsGenerated: null,
        announcementsArray: null,
        lastReportSummary: null
      }
    };
  },
  methods: {
    UpdateProfile: function(e) {
      e.preventDefault();
      /** Update Profile API */
      axios
        .post("/o/profile", {
          operation: 0,
          userId: this.userProfileData.username,
          profileData: this.userProfileData
        })
        .then(response => {
          this.$toaster.success(response.data.message);
          this.userProfileData.firstName = response.data.profileData.firstName;
          this.userProfileData.lastName = response.data.profileData.lastName;
          this.userProfileData.email = response.data.profileData.email;
          this.userProfileData.phone = response.data.profileData.phone;
          this.userProfileData.address1 = response.data.profileData.address1;
          this.userProfileData.address2 = response.data.profileData.address2;
          this.userProfileData.city = response.data.profileData.city;
          this.userProfileData.state = response.data.profileData.state;
          this.userProfileData.country = response.data.profileData.country;
          this.userProfileData.zip = response.data.profileData.zip;
        })
        .catch(error => {
          this.$toaster.error(error.response.data);
        });
    },

    // Change Password Function
    ChangePassword: function(e) {
      e.preventDefault();

      if (this.userPassChange.newPass === this.userPassChange.confirmPass) {
        axios
          .post("/o/profile", {
            operation: 1,
            userId: this.userProfileData.username,
            passObj: this.userPassChange
          })
          .then(response => {
            this.userPassChange.oldPass = "";
            this.userPassChange.newPass = "";
            this.userPassChange.confirmPass = "";
            this.$toaster.success(response.data);
          })
          .catch(error => {
            this.$toaster.error(error.response.data);
          });
      } else {
        this.$toaster.error("New Passwords do not match");
      }
    },

    // Delete functionally
    DeleteAccount: function(e) {
      e.preventDefault();
      axios
        .get("/o/logout")
        .then(response => {
          axios
            .post("/o/profile", {
              operation: 2,
              userId: this.userProfileData.username,
              password: this.deletionPassword
            })
            .then(response => {
              this.$toaster.success(response.data);
              router.push("/login");
            })
            .catch(error => {
              this.$toaster.error(error.response.data);
              router.push("/login");
            });
        })
        .catch(errors => {
          this.$toaster.error(error.response.data);
          router.push("/login");
        });
    },
    // Capitalize the first letter
    CapitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    },
    
    ToggleSection(id) {
      switch (id) {
        case "section1":
          this.section1 = true;
          this.section2 = false;
          this.section3 = false;
          document.getElementById("section1-nav").classList.add("active");
          document.getElementById("section2-nav").classList.remove("active");
          document.getElementById("section3-nav").classList.remove("active");
          break;

        case "section2":
          this.section1 = false;
          this.section2 = true;
          this.section3 = false;
          document.getElementById("section1-nav").classList.remove("active");
          document.getElementById("section2-nav").classList.add("active");
          document.getElementById("section3-nav").classList.remove("active");
          break;

        case "section3":
          this.section1 = false;
          this.section2 = false;
          this.section3 = true;
          document.getElementById("section1-nav").classList.remove("active");
          document.getElementById("section2-nav").classList.remove("active");
          document.getElementById("section3-nav").classList.add("active");
          break;
      }
    }
  },
  mounted() {
    /** Get File Upload Data from Dashboard API */
    axios
      .post("/o/getdashboardstats", {
        username: this.userProfileData.username
      })
      .then(response => {
        this.dashboardData.totalFilesUploaded = response.data.totalFileUploads;
        this.dashboardData.totalReportsGenerated =
          response.data.totalReportUploads;
        this.dashboardData.announcementsArray = response.data.announcements;
        this.dashboardData.lastReportSummary = response.data.lastReportSummary;
      })
      .catch(error => {
        this.$toaster.error(error.response.data);
        router.push("/login");
      });

    /** Get User data from database */
    axios
      .post("/o/user")
      .then(response => {
        //this.$set(this, "user", response.data);
        this.user = response.data;
        this.userLogged = true;
        this.userProfileData.username = response.data.username;
        this.userProfileData.email = response.data.email;
        this.userProfileData.role = response.data.role;
        this.userProfileData.firstName = response.data.firstName;
        this.userProfileData.lastName = response.data.lastName;
        this.userProfileData.email = response.data.email;
        this.userProfileData.phone = response.data.phone;
        this.userProfileData.address1 = response.data.address1;
        this.userProfileData.address2 = response.data.address2;
        this.userProfileData.city = response.data.city;
        this.userProfileData.state = response.data.state;
        this.userProfileData.country = response.data.country;
        this.userProfileData.zip = response.data.zip;

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
<style scoped>
</style>
