<template>
  <div class="app flex-row align-items-center body">
    <div class="container">
      <b-row class="justify-content-center">
        <b-col md="4">
          <b-card-group>
            <b-card no-body class="p-4">
              <b-card-body>
                <b-form v-on:submit="login">
                  <h1 class="text-center">Login</h1>
                  <p class="text-muted text-center">Sign In to your account</p>
                  <b-input-group class="mb-3">
                    <b-input-group-prepend>
                      <b-input-group-text>
                        <i class="icon-user"></i>
                      </b-input-group-text>
                    </b-input-group-prepend>
                    <b-form-input
                      type="text"
                      class="form-control"
                      placeholder="Username"
                      autocomplete="username email"
                      v-model="username"
                      required
                    />
                  </b-input-group>
                  <b-input-group class="mb-4">
                    <b-input-group-prepend>
                      <b-input-group-text>
                        <i class="icon-lock"></i>
                      </b-input-group-text>
                    </b-input-group-prepend>
                    <b-form-input
                      type="password"
                      class="form-control"
                      placeholder="Password"
                      autocomplete="current-password"
                      v-model="password"
                      required
                    />
                  </b-input-group>
                  <b-row>
                    <b-col cols="12">
                      <b-button type="submit" variant="primary" class="px-4" block>Login</b-button>
                    </b-col>
                  </b-row>
                  <b-row class="mt-2">
                    <b-col cols="6">
                      <b-button
                        variant="link"
                        class="px-0"
                        @click="register"
                        style="font-size: 12px;"
                      >Create New Account</b-button>
                    </b-col>
                     <b-col cols="6">
                      <b-button
                        variant="link"
                        class="px-0"
                        style="font-size: 12px;"
                      >Forgot password?</b-button>
                    </b-col>
                  </b-row>
                </b-form>
                <!-- <b-row>
                  <b-col cols="6">
                    <b-button block class="btn btn-facebook" disabled>
                      <span>facebook</span>
                    </b-button>
                  </b-col>
                  <b-col cols="6">
                    <b-button block class="btn btn-twitter" type="button" disabled>
                      <span>twitter</span>
                    </b-button>
                  </b-col>
                </b-row>-->
              </b-card-body>
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
  name: "Login",
  data() {
    return {
      username: null,
      password: null
    };
  },
  methods: {
    login: function(e) {
      e.preventDefault();
      axios
        .post("/o/login", {
          username: this.username,
          password: this.password
        })
        .then(response => {
          router.push("/dashboard");
        })
        .catch(errors => {
          this.$toaster.error("Incorrect Username/Password. Try Again.");
        });
    },
    register() {
      router.push("/register");
    }
  }
};
</script>

<style>
@font-face {
  font-family: Poppins-Regular;
  src: url("../../../public/fonts/poppins/Poppins-Regular.ttf");
}

@font-face {
  font-family: Poppins-Medium;
  src: url("../../../public/fonts/poppins/Poppins-Medium.ttf");
}

@font-face {
  font-family: Poppins-Bold;
  src: url("../../../public/fonts/poppins/Poppins-Bold.ttf");
}

@font-face {
  font-family: Poppins-SemiBold;
  src: url("../../../public/fonts/poppins/Poppins-SemiBold.ttf");
}

.body {
  background-image: url("../../../public/img/bg-01.jpg");
  background-size: cover;
  font-family: Poppins-Regular, sans-serif;
}
</style>
