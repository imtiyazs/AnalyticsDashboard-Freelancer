<template>
  <div class="wrapper">
    <div class="animated fadeIn">
      <b-row>
        <b-col cols="12">
          <b-card-group deck class="mb-3">
            <b-card border-variant="info" header="Dashboard Announcements" align="left">
              <b-row>
                <b-col cols="6">
                  <b-card style="height: 375px">
                    <h5 class="mb-4">Write An Announcement</h5>
                    <b-row>
                      <div class="col-12">
                        <b-form-textarea
                          v-model="announceText"
                          placeholder="Write An Announcement for dashboard"
                          :rows="3"
                          :max-rows="6"
                        ></b-form-textarea>
                      </div>
                    </b-row>
                    <div class="row mt-4">
                      <div class="col-12 text-right">
                        <b-button
                          @click="writeAnnouncement"
                          variant="success"
                        >Broadcast Announcement</b-button>
                      </div>
                    </div>
                  </b-card>
                </b-col>
                <b-col cols="6">
                  <b-card>
                    <h5 class="mb-4">Latest Announcements</h5>
                    <div style="height: 290px;overflow-y: overlay;padding: 5px;">
                      <p v-if="announcements.length === 0">No Previous Announcements Found</p>
                      <div v-for="(announcement, key) in announcements" :key="key">
                        <b-btn
                          v-b-toggle="announcement"
                          block
                          variant="primary"
                          class="mb-3 text-left"
                        >{{ new Date(announcement.creationDate).toDateString() }}: {{ announcement.message.substring(0, 40) + ' ...'}}</b-btn>
                        <b-collapse :id="announcement" class="mb-3">
                          <b-card>
                            <p class="card-text">{{announcement.message}}</p>
                          </b-card>
                          <div class="text-right">
                            <button
                              @click="DeleteAnnouncement(announcement.message)"
                              class="btn btn-sm btn-danger text-right mt-2"
                            >Delete</button>
                          </div>
                        </b-collapse>
                      </div>
                    </div>
                  </b-card>
                </b-col>
              </b-row>
            </b-card>
          </b-card-group>
        </b-col>
      </b-row>
    </div>
  </div>
</template>


<script>
import router from "../../router";
import axios from "axios";

export default {
  name: "Announcements",
  data() {
    return {
      announceText: "",
      announcements: []
    };
  },
  methods: {
    writeAnnouncement() {
      axios
        .post("/o/announce", {
          message: this.announceText,
          operation: 1
        })
        .then(response => {
          this.$toaster.success(response.data);
          // Get announcement data from DB
          axios
            .post("/o/announce", {
              message: "",
              operation: 3
            })
            .then(response => {
              this.announcements = response.data;
            })
            .catch(error => {
              this.$toaster.error(error.response.data);
            });
        })
        .catch(error => {
          this.$toaster.success(error.response.data);
        });
    },
    DeleteAnnouncement(anouncementMsg) {
      axios
        .post("/o/announce", {
          message: anouncementMsg,
          operation: 2
        })
        .then(response => {
          this.$toaster.success(response.data);
          // Get announcement data from DB
          axios
            .post("/o/announce", {
              message: "",
              operation: 3
            })
            .then(response => {
              this.announcements = response.data;
            })
            .catch(error => {
              this.$toaster.error(error.response.data);
            });
        })
        .catch(error => {
          this.$toaster.success(error.response.data);
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

        // Get announcement data from DB
        axios
          .post("/o/announce", {
            message: "",
            operation: 3
          })
          .then(response => {
            this.announcements = response.data;
          })
          .catch(error => {
            this.$toaster.error(error.response.data);
          });
      })
      .catch(errors => {
        router.push("/login");
      });
  }
};
</script>
<style>
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
</style>
