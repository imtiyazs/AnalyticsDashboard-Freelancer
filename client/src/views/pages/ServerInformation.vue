<template>
  <div class="wrapper">
    <div class="animated fadeIn">
      <b-row>
        <b-col cols="12">
          <div class="card">
            <div class="card-header">Server Information</div>
            <div class="card-body">
              <b-row>
                <b-col cols="6">
                  <div class="card">
                    <div class="card-body">
                      <h5 class="card-title mb-4">System Statistics</h5>
                      <ul class="list-group">
                        <li class="list-group-item">
                          Server Operating System:
                          <strong>
                            <span id="server-os">Linux</span>
                          </strong>
                        </li>
                        <li class="list-group-item">
                          Server RAM:
                          <strong>
                            <span id="server-ram">Linux</span>
                          </strong>
                        </li>
                        <li class="list-group-item">
                          Disk Storage:
                          <strong>
                            <span id="server-disk">Linux</span>
                          </strong>
                        </li>
                        <li class="list-group-item">
                          NGINX Version:
                          <strong>
                            <span id="server-nginx">Linux</span>
                          </strong>
                        </li>
                        <li class="list-group-item">
                          PM2 Version:
                          <strong>
                            <span id="server-pm2">Linux</span>
                          </strong>
                        </li>
                      </ul>
                    </div>
                  </div>
                </b-col>
                <b-col cols="6">
                  <div class="card">
                    <div class="card-body">
                      <h5 class="card-title mb-4">Database Statistics</h5>
                      <ul class="list-group">
                        <li class="list-group-item">
                          Database Name:
                          <strong>
                            <span id="db-name">Linux</span>
                          </strong>
                        </li>
                        <li class="list-group-item">
                          Database Collections:
                          <strong>
                            <span id="db-collections">Linux</span>
                          </strong>
                        </li>
                        <li class="list-group-item">
                          Database Size:
                          <strong>
                            <span id="db-size">Linux</span>
                          </strong>
                        </li>
                        <li class="list-group-item">
                          File Upload Size:
                          <strong>
                            <span id="db-files">Linux</span>
                          </strong>
                        </li>
                      </ul>
                    </div>
                  </div>
                </b-col>
              </b-row>
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
        serverOs: '',
        serverRam: '',
        serverDisk: '',
        serverNginx: '',
        serverPm2: '',
        databaseName: '',
        databaseCollection: '',
        databaseSize: '',
        databaseUploads: ''
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
