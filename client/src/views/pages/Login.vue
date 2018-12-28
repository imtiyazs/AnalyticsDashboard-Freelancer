<template>
  <div class="app flex-row align-items-center body">
    <div class="container">
      <b-row class="justify-content-center">
        <b-col md="12">
          <div id="loginbody" style="margin-left: -15%;width: 125%;height: 100vh;"></div>
        </b-col>
        <b-col md="4" style="position: absolute;top: 20%;width: 370px;">
          <b-card-group>
            <b-card no-body class="p-4">
              <b-card-body>
                <div class="loader">
                  <circle4 v-if="showLoader"></circle4>
                </div>
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
                      <b-button
                        type="submit"
                        :disabled="showLoader"
                        variant="primary"
                        class="px-4"
                        block
                      >Login</b-button>
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
import { Circle4 } from "vue-loading-spinner";
import "particles.js";

export default {
  name: "Login",
  components: {
    Circle4
  },
  data() {
    return {
      showLoader: false,
      username: null,
      password: null,
      isParticle: false
    };
  },
  methods: {
    login: function(e) {
      e.preventDefault();
      this.showLoader = true;
      axios
        .post("/o/login", {
          username: this.username,
          password: this.password
        })
        .then(response => {
          router.push("/dashboard");
          this.showLoader = false;
        })
        .catch(errors => {
          this.showLoader = false;
          this.$toaster.error(errors.response.data);
        });
    },
    register() {
      router.push("/register");
    },
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
    }
  },
  mounted() {
    if(!this.isParticle) {
      this.initParticles()
      this.isParticle = true
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
