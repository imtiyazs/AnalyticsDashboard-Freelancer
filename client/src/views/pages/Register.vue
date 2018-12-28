<template>
  <div class="app flex-row align-items-center body">
    <div class="container">
      <b-row class="justify-content-center">
        <b-col md="12">
          <div id="loginbody" style="margin-left: -15%;width: 125%;height: 100vh;"></div>
        </b-col>
        <b-col md="6" sm="8" style="position: absolute;top: 20%;width: 540px;">
          <b-card no-body class="mx-4">
            <b-card-body class="p-4">
              <div class="loader">
                <circle4 v-if="showLoader"></circle4>
              </div>
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
import { Circle4 } from "vue-loading-spinner";
import "particles.js";

export default {
  name: "Register",
  components: {
    Circle4
  },
  data() {
    return {
      showLoader: false,
      username: "",
      email: "",
      password: "",
      repeatPassword: "",
      isParticle: false
    };
  },
  methods: {
    initParticles() {
      window.particlesJS("loginbody", {
        particles: {
          number: {
            value: 80,
            density: {
              enable: true,
              value_area: 800
            }
          },
          color: {
            value: "#ffffff"
          },
          shape: {
            type: "circle",
            stroke: {
              width: 0,
              color: "#000000"
            },
            polygon: {
              nb_sides: 6
            }
          },
          opacity: {
            value: 0.5,
            random: false,
            anim: {
              enable: false,
              speed: 1,
              opacity_min: 0.1,
              sync: false
            }
          },
          size: {
            value: 5,
            random: true,
            anim: {
              enable: false,
              speed: 50,
              size_min: 0.1,
              sync: false
            }
          },
          line_linked: {
            enable: true,
            distance: 300,
            color: "#ffffff",
            opacity: 0.4,
            width: 2
          },
          move: {
            enable: true,
            speed: 9,
            direction: "none",
            random: false,
            straight: false,
            out_mode: "out",
            bounce: false,
            attract: {
              enable: false,
              rotateX: 600,
              rotateY: 1200
            }
          }
        },
        interactivity: {
          detect_on: "canvas",
          events: {
            onhover: {
              enable: false,
              mode: "repulse"
            },
            onclick: {
              enable: true,
              mode: "repulse"
            },
            resize: true
          },
          modes: {
            grab: {
              distance: 800,
              line_linked: {
                opacity: 1
              }
            },
            bubble: {
              distance: 800,
              size: 80,
              duration: 2,
              opacity: 8,
              speed: 3
            },
            repulse: {
              distance: 400,
              duration: 0.4
            },
            push: {
              particles_nb: 4
            },
            remove: {
              particles_nb: 2
            }
          }
        },
        retina_detect: true
      });
    },
    BackToLogin() {
      router.push("/login");
    },
    Register: function(e) {
      e.preventDefault();
      if (this.password === this.repeatPassword) {
        this.showLoader = true;

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
              this.showLoader = false;
              router.push("/login");
            }, 1000);
          })
          .catch(err => {
            this.$toaster.error(err.response.data);
            this.showLoader = false;
          });
      } else {
        this.$toaster.error("Passwords do not match! Try Again.");
        this.showLoader = false;
      }
    }
  },
  mounted() {
    if (!this.isParticle) {
      this.initParticles();
      this.isParticle = true;
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
.loader {
  width: 40px;
  height: 40px;
  position: absolute;
  top: 45%;
  left: 45%;
  z-index: 10;
}
</style>
