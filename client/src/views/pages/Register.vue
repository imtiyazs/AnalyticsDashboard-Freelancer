<template>
  <div class="app flex-row align-items-center body">
    <div class="container">
      <b-row class="justify-content-center">
        <b-col md="6" sm="8">
          <b-card no-body class="mx-4">
            <b-card-body class="p-4">
              <b-form v-on:submit="Register">
                <h1 class="text-center">Register</h1>
                <p class="text-muted text-center">Create your account</p>
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
                    autocomplete="username"
                    v-model="username"
                    required
                  />
                </b-input-group>

                <b-input-group class="mb-3">
                  <b-input-group-prepend>
                    <b-input-group-text>@</b-input-group-text>
                  </b-input-group-prepend>
                  <b-form-input
                    type="email"
                    class="form-control"
                    placeholder="Email"
                    autocomplete="email"
                    v-model="email"
                    required
                  />
                </b-input-group>

                <b-input-group class="mb-3">
                  <b-input-group-prepend>
                    <b-input-group-text>
                      <i class="icon-lock"></i>
                    </b-input-group-text>
                  </b-input-group-prepend>
                  <b-form-input
                    type="password"
                    class="form-control"
                    placeholder="Password"
                    autocomplete="new-password"
                    v-model="password"
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
                    placeholder="Repeat password"
                    autocomplete="new-password"
                    v-model="repeatPassword"
                    required
                  />
                </b-input-group>
                <b-row>
                  <b-col cols="4">
                    <b-button @click="BackToLogin" type="button" variant="light" block>Back to login</b-button>
                  </b-col>
                  <b-col cols="8">
                    <b-button type="submit" variant="success" block>Create Account</b-button>
                  </b-col>
                </b-row>
              </b-form>
            </b-card-body>
          </b-card>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import router from "../../router";

export default {
  name: "Register",
  data() {
    return {
      username: "",
      email: "",
      password: "",
      repeatPassword: ""
    };
  },
  methods: {
    BackToLogin() {
      router.push("/login");
    },
    Register: function(e) {
      e.preventDefault();
      if (this.password === this.repeatPassword) {
        let userData = {
          username: this.username,
          password: this.password,
          email: this.email
        };

        axios
          .post("/o/register", userData)
          .then(response => {
            this.$toaster.success(
              "Registration Successful. Redirecting to login..."
            );
            setTimeout(() => {
              router.push("/login");
            }, 2000);
          })
          .catch(err => {
            this.$toaster.error(err.response.data);
          });
      } else {
        this.$toaster.error("Passwords do not match! Try Again.");
      }
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
