<template>
  <div class="wrapper">
    <div class="animated fadeIn">
      <b-row>
        <b-col cols="12">
          <div class="card">
            <div class="card-header">User Management</div>
            <div class="card-body">
              <!-- User Management Section -->
              <div id="UserManagementSection" class="row">
                <div class="col-lg-6 grid-margin stretch-card">
                  <div class="card">
                    <div class="card-body">
                      <h4 id="dashboard-title" class="card-title text-primary mb-3">Search User</h4>
                      <div class="form-group">
                        <input
                          class="form-control form-control-sm"
                          id="userSearchInp"
                          onkeyup="SearchUser()"
                          type="text"
                          placeholder="Search"
                        >
                      </div>
                      <ul id="admin-user-list" class="session-list">
                        <p
                          id="no-users-list"
                          class="mt-5"
                          style="margin-left: 26%;"
                        >No Users Registered</p>
                      </ul>
                    </div>
                  </div>
                </div>
                <div
                  id="umgmt-userInfo"
                  style="display:none"
                  class="col-lg-6 grid-margin stretch-card"
                >
                  <div class="card">
                    <div class="card-body">
                      <h2 class="card-title text-primary mb-3">Manage User</h2>
                      <div class="nav-item nav-profile">
                        <div class="user-wrapper">
                          <div class="profile-image text-center">
                            <!-- <img
                              src="./assets/images/blank-profile.png"
                              class="mb-3"
                              draggable="false"
                              alt="profile image"
                            > -->
                            <h4 id="umgmt-username" class="card-link mb-3">Administrator</h4>
                          </div>
                        </div>
                      </div>
                      <div class="form-group">
                        <span style="font-size: 12px;">User Role</span>
                        <div class="btn-group btn-group-toggle" data-toggle="buttons">
                          <label
                            onclick="ChangeRoleToStudent()"
                            id="umgmt-student-btn-label"
                            class="btn btn-secondary"
                          >
                            <input
                              type="radio"
                              name="options"
                              id="umgmt-student-btn"
                              autocomplete="off"
                            >Student
                          </label>
                          <label
                            onclick="ChangeRoleToPublisher()"
                            id="umgmt-publisher-btn-label"
                            class="btn btn-secondary"
                          >
                            <input
                              type="radio"
                              name="options"
                              id="umgmt-publisher-btn"
                              autocomplete="off"
                            >Publisher
                          </label>
                          <label
                            onclick="ChangeRoleToModerator()"
                            id="umgmt-moderator-btn-label"
                            class="btn btn-secondary"
                          >
                            <input
                              type="radio"
                              name="options"
                              id="umgmt-moderator-btn"
                              autocomplete="off"
                            >Moderator
                          </label>
                        </div>
                      </div>
                      <div class="form-group">
                        <span style="font-size: 12px;">Reset Password</span>
                        <span class="enable-select float-right">
                          <button
                            type="button"
                            style="width: 135px;"
                            class="btn btn-sm btn-inverse-primary btn-fw"
                          >
                            Reset
                            Password
                          </button>
                        </span>
                      </div>
                      <div class="form-group">
                        <span style="font-size: 12px;">Account State</span>
                        <span class="enable-select float-right">
                          <button
                            id="user-unblock-account-btn"
                            onclick="UnblockUserAccount()"
                            type="button"
                            style="width: 135px;"
                            class="btn btn-sm btn-inverse-warning btn-fw"
                          >
                            Unblock
                            User
                          </button>
                          <button
                            onclick="BlockUserAccount()"
                            id="user-block-account-btn"
                            type="button"
                            style="width: 135px;"
                            class="btn btn-sm btn-inverse-warning btn-fw"
                          >
                            Block
                            User
                          </button>
                        </span>
                      </div>
                      <div class="form-group">
                        <span style="font-size: 12px;">Delete User</span>
                        <span class="enable-select float-right">
                          <button
                            type="button"
                            style="width: 135px;"
                            data-toggle="modal"
                            data-target="#adminModal"
                            class="btn btn-sm btn-inverse-danger btn-fw"
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
  </div>
</template>


<script>
import router from "../../router";
import axios from "axios";

export default {
  name: "ServerInformation",
  data() {
    return {
      serverOs: "",
      serverRam: "",
      serverDisk: "",
      serverNginx: "",
      serverPm2: "",
      databaseName: "",
      databaseCollection: "",
      databaseSize: "",
      databaseUploads: ""
    };
  },
  mounted() {
    axios
      .post("/o/user")
      .then(response => {
        this.$set(this, "user", response.data.username);
        this.userLogged = true;
      })
      .catch(error => {
        this.$toaster.error(error.response.data);
        router.push("/login");
      });
  }
};
</script>
