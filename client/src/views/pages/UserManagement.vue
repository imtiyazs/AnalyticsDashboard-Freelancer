<template>
  <div class="wrapper">
    <div class="animated fadeIn" v-if="this.auth !== null">
      <b-row>
        <b-col cols="12">
          <div class="card">
            <div class="card-header">User Management</div>
            <div class="card-body">
              <!-- User Management Section -->
              <div id="UserManagementSection" class="row">
                <div class="col-lg-6 grid-margin stretch-card">
                  <div class="card">
                    <p class="card-header mb-3">Search User</p>
                    <div class="card-body">
                      <input
                        class="form-control mb-4"
                        v-model="search"
                        type="text"
                        placeholder="Search User"
                      >

                      <b-list-group v-for="user in filteredUsers" v-bind:key="user">
                        <b-list-group-item
                          class="mb-2"
                          href="#"
                          @click="LoadUserDetailsInPane(user)"
                        >{{ CapitalizeFirstLetter(user.username)}} - {{user.email}}</b-list-group-item>
                      </b-list-group>
                    </div>
                  </div>
                </div>
                <div v-if="isUserLoaded" class="col-lg-6 animate fadeIn grid-margin stretch-card">
                  <div class="card">
                    <p class="card-header mb-3">Manage User</p>
                    <div class="card-body">
                      <div class="nav-item nav-profile">
                        <div class="user-wrapper">
                          <div class="profile-image text-center">
                            <!-- <img
                              src="./assets/images/blank-profile.png"
                              class="mb-3"
                              draggable="false"
                              alt="profile image"
                            >-->
                            <h4
                              class="card-link mb-4"
                            >{{CapitalizeFirstLetter(this.userData.username)}}</h4>
                          </div>
                        </div>
                      </div>
                      <div class="form-group mb-4">
                        <span>
                          User Role:
                          <strong>{{ CapitalizeFirstLetter(userData.role)}}</strong>
                        </span>
                        <div
                          class="btn-group btn-group-toggle"
                          data-toggle="buttons"
                          style="position: absolute;right: 4%;"
                        >
                          <label
                            @click="ChangeUserRole(userData.username, 'normal')"
                            class="btn btn-secondary"
                          >
                            <input type="radio" name="options" autocomplete="off">Normal
                          </label>
                          <label
                            @click="ChangeUserRole(userData.username, 'superadmin')"
                            class="btn btn-secondary"
                          >
                            <input type="radio" name="options" autocomplete="off">Administrator
                          </label>
                        </div>
                      </div>
                      <div class="form-group mb-4">
                        <span>Reset Password</span>
                        <span class="enable-select float-right">
                          <button
                            type="button"
                            @click="ResetPassword(userData.username)"
                            class="btn btn-primary btn-fw"
                            style="width:181px"
                          >
                            Reset
                            Password (12346)
                          </button>
                        </span>
                      </div>
                      <div class="form-group mb-4">
                        <span>
                          Account State:
                          <strong>{{userData.isBlocked}}</strong>
                        </span>
                        <span class="enable-select float-right">
                          <button
                            type="button"
                            v-if="userData.isBlocked == 'Active'"
                            class="btn btn-warning btn-fw"
                            style="width:181px"
                            @click="BlockUnblockUser(userData.username, true)"
                          >
                            Block
                            User
                          </button>
                          <button
                            v-else
                            @click="BlockUnblockUser(userData.username, false)"
                            type="button"
                            class="btn btn-danger btn-fw"
                            style="width:181px"
                          >
                            Unblock
                            User
                          </button>
                        </span>
                      </div>
                      <div class="form-group mb-4">
                        <span>Delete User</span>
                        <span class="enable-select float-right">
                          <button
                            type="button"
                            @click="DeleteUser(userData.username)"
                            class="btn btn-danger btn-fw"
                            style="width:181px"
                          >
                            <i class="mdi mdi-alert-outline"></i>Delete
                            User
                          </button>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </b-col>
      </b-row>
    </div>
    <div class="loader" v-else>
      <circle4 style="height:80px;width:80px;"></circle4>
    </div>
  </div>
</template>


<script>
import router from "../../router";
import axios from "axios";
import { Circle4 } from "vue-loading-spinner";

export default {
  name: "ServerInformation",
  components: {
    Circle4
  },
  data() {
    return {
      showLoader: false,
      userListArray: [],
      isUserLoaded: false,
      auth: null,
      userData: {
        username: "",
        isBlocked: "",
        role: "",
        email: ""
      },
      search: ""
    };
  },
  methods: {
    CapitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    },
    ChangeUserRole(username, role) {
      axios
        .post("/o/user-mgmt", {
          username: username,
          operation: 1,
          role: role,
          auth: this.auth
        })
        .then(response => {
          this.$toaster.success(response.data);
          this.userData.role = this.CapitalizeFirstLetter(role);
        })
        .catch(error => {
          this.$toaster.error(error.response.data);
        });
    },

    ResetPassword(username) {
      axios
        .post("/o/user-mgmt", {
          username: username,
          operation: 2,
          auth: this.auth
        })
        .then(response => {
          this.$toaster.success(response.data);
        })
        .catch(error => {
          this.$toaster.error(error.response.data);
        });
    },

    BlockUnblockUser(username, state) {
      axios
        .post("/o/user-mgmt", {
          username: username,
          isBlocked: state,
          operation: 3,
          auth: this.auth
        })
        .then(response => {
          this.$toaster.success(response.data);
          if (state) {
            this.userData.isBlocked = "Suspended";
          } else {
            this.userData.isBlocked = "Active";
          }
        })
        .catch(error => {
          this.$toaster.error(error.response.data);
        });
    },

    DeleteUser(username) {
      axios
        .post("/o/user-mgmt", {
          username: username,
          operation: 4,
          auth: this.auth
        })
        .then(response => {
          this.$toaster.success(response.data);
        })
        .catch(error => {
          this.$toaster.error(error.response.data);
        });
    },

    LoadUserDetailsInPane(userData) {
      this.isUserLoaded = true;
      this.userData.username = userData.username;
      this.userData.role = userData.role;
      this.userData.email = userData.email;

      if (userData.isBlocked) {
        this.userData.isBlocked = "Suspended";
      } else {
        this.userData.isBlocked = "Active";
      }
    }
  },
  computed: {
    filteredUsers: function() {
      var self = this;
      return this.userListArray.filter(function(user) {
        return (
          user.username.toLowerCase().indexOf(self.search.toLowerCase()) >= 0
        );
      });
    }
  },
  mounted() {
    axios
      .post("/o/user")
      .then(response => {
        this.$set(this, "user", response.data.username);
        this.userLogged = true;
        this.auth = response.data.role;
        axios
          .post("/o/getusers", {
            auth: response.data.role
          })
          .then(response => {
            this.userListArray = response.data;
          })
          .catch(error => {
            this.$toaster.error(error.response.data);
          });
      })
      .catch(error => {
        this.$toaster.error(error.response.data);
        router.push("/login");
      });
  }
};
</script>
<style scoped>
*::-webkit-scrollbar {
  width: 3px;
}

*::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
}

*::-webkit-scrollbar-thumb {
  background-color: darkgrey;
  outline: 1px solid slategrey;
}

div.modal.displayMyDashboard .modal-dialog {
  width: 100%;
}
.loader {
  width: 80px;
  height: 80px;
  height: 8;
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 10;
}
</style>
