<template>
  <AppHeaderDropdown right no-caret>
    <template slot="header">
      <img src="img/avatars/6.jpg" class="img-avatar" alt="admin@bootstrapmaster.com">
    </template>\
    <template slot="dropdown">
      <b-dropdown-header tag="div" class="text-center">
        <strong>Account</strong>
      </b-dropdown-header>
      <b-dropdown-item @click="profile">
        <i class="fa fa-user"/> Profile
      </b-dropdown-item>
      <b-dropdown-item @click="logout">
        <i class="fa fa-lock"/> Logout
      </b-dropdown-item>
    </template>
  </AppHeaderDropdown>
</template>

<script>
import { HeaderDropdown as AppHeaderDropdown } from "@coreui/vue";
import axios from "axios";
import router from "../router";

export default {
  name: "DefaultHeaderDropdownAccnt",
  components: {
    AppHeaderDropdown
  },
  data: () => {
    return { itemsCount: 42 };
  },
  methods: {
    profile() {
      router.push('/profile')
    },
    logout() {
      axios
        .get("/o/logout")
        .then(response => {
          router.push("/login");
        })
        .catch(errors => {
          router.push("/login");
        });
    }
  }
};
</script>
