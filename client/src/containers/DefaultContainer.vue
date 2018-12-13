<template>
  <div class="app">
    <AppHeader fixed>
      <SidebarToggler class="d-lg-none" display="md" mobile/>
      <b-link class="navbar-brand" to="#">
        <img class="navbar-brand-full" src="img/logo.png" width="89" height="25" alt="CoreUI Logo">
        <img
          class="navbar-brand-minimized"
          src="img/logo-symbol.png"
          width="30"
          height="30"
          alt="CoreUI Logo"
        >
      </b-link>
      <SidebarToggler class="d-md-down-none" display="lg"/>
      <b-navbar-nav class="d-md-down-none">
        <b-nav-item class="px-3" to="/dashboard">Dashboard</b-nav-item>
        <!-- <b-nav-item class="px-3">Reports History</b-nav-item> -->
      </b-navbar-nav>
      <b-navbar-nav class="ml-auto">
        <div class="small text-muted" style="text-align: right">
          Last Login: {{userProfileInfo.lastLogin}}
          <br>
          <strong
            v-if="userProfileInfo.firstName!==''"
          >{{CapitalizeFirstLetter(userProfileInfo.firstName)}} {{CapitalizeFirstLetter(userProfileInfo.lastName)}} -  </strong>
          <strong>{{ CapitalizeFirstLetter(userProfileInfo.username)}}</strong>
        </div>

        <!-- <b-nav-item class="d-md-down-none">
          <i class="icon-bell"></i>
          <b-badge pill variant="danger">5</b-badge>
        </b-nav-item>
        <b-nav-item class="d-md-down-none">
          <i class="icon-list"></i>
        </b-nav-item>
        <b-nav-item class="d-md-down-none">
          <i class="icon-location-pin"></i>
        </b-nav-item>-->
        <DefaultHeaderDropdownAccnt/>
      </b-navbar-nav>
      <AsideToggler class="d-none d-lg-block"/>
      <!--<AsideToggler class="d-lg-none" mobile />-->
    </AppHeader>
    <div class="app-body">
      <AppSidebar fixed>
        <SidebarHeader/>
        <SidebarForm/>
        <SidebarNav :navItems="nav"></SidebarNav>
        <SidebarNav v-if="isAdmin" :navItems="adminnav"></SidebarNav>
        <SidebarFooter/>
        <SidebarMinimizer/>
      </AppSidebar>
      <main class="main">
        <Breadcrumb :list="list"/>
        <div class="container-fluid">
          <router-view></router-view>
        </div>
      </main>
      <AppAside fixed>
        <!--aside-->
        <DefaultAside/>
      </AppAside>
    </div>
    <TheFooter>
      <!--footer-->
      <div>
        <a href="#">Analytics Dashboard</a>
        <span class="ml-1">&copy; 2018.</span>
      </div>
      <!-- <div class="ml-auto">
        <span class="mr-1">Powered by</span>
        <a href="https://coreui.io">CoreUI</a>
      </div>-->
    </TheFooter>
  </div>
</template>

<script>
import nav from "@/_nav";
import adminnav from "@/_admin-nav";
import {
  Header as AppHeader,
  SidebarToggler,
  Sidebar as AppSidebar,
  SidebarFooter,
  SidebarForm,
  SidebarHeader,
  SidebarMinimizer,
  SidebarNav,
  Aside as AppAside,
  AsideToggler,
  Footer as TheFooter,
  Breadcrumb
} from "@coreui/vue";
import DefaultAside from "./DefaultAside";
import DefaultHeaderDropdownAccnt from "./DefaultHeaderDropdownAccnt";
import axios from "axios";
import router from "../router";

export default {
  name: "DefaultContainer",
  components: {
    AsideToggler,
    AppHeader,
    AppSidebar,
    AppAside,
    TheFooter,
    Breadcrumb,
    DefaultAside,
    DefaultHeaderDropdownAccnt,
    SidebarForm,
    SidebarFooter,
    SidebarToggler,
    SidebarHeader,
    SidebarNav,
    SidebarMinimizer
  },
  data() {
    return {
      nav: nav.items,
      adminnav: adminnav.items,
      isAdmin: false,
      userProfileInfo: {
        username: "",
        firstName: "",
        lastName: "",
        lastLogin: ""
      }
    };
  },
  methods: {
    CapitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }
  },
  mounted() {
    axios
      .post("/o/user")
      .then(response => {
        this.$set(this, "user", response.data);
        if (response.data.role == "superadmin") {
          this.isAdmin = true;
        }

        this.userProfileInfo.username = response.data.username;
        this.userProfileInfo.firstName = response.data.firstName;
        this.userProfileInfo.lastName = response.data.lastName;
        this.userProfileInfo.lastLogin = response.data.lastlogin;
      })
      .catch(errors => {
        this.$toaster.error(errors.response.data);
      });
  },
  computed: {
    name() {
      return this.$route.name;
    },
    list() {
      return this.$route.matched.filter(
        route => route.name || route.meta.label
      );
    }
  }
};
</script>
