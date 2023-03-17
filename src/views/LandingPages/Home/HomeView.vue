<script setup>
import { onMounted, onUnmounted } from "vue";

//example components
import DefaultNavbar from "../../../examples/navbars/NavbarDefault.vue";
import DefaultFooter from "../../../examples/footers/FooterDefault.vue";

//Vue Material Kit 2 components
import MaterialSocialButton from "@/components/MaterialSocialButton.vue";

//image
import homeBg from "@/assets/img/home-bg.jpeg";
import wavesWhite from "@/assets/img/waves-white.svg";

//sections
import Stats from "./Sections/HomeStats.vue";
import Features from "./Sections/Features.vue";


const body = document.getElementsByTagName("body")[0];
//hooks
onMounted(() => {});

onUnmounted(() => {});
</script>
<template>
  <DefaultNavbar
    :action="{
      route: 'create',
      label: 'Get started',
      color: 'btn-primary',
    }"
    transparent
  />
  <header class="bg-gradient-dark">
    <div
      class="page-header min-vh-75"
      :style="{ backgroundImage: `url(${homeBg})` }"
    >
      <span class="mask bg-gradient-dark opacity-6"></span>
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-8 text-center mx-auto my-auto">
            <h1 class="text-white">Where writing meets Web3.</h1>

            <p class="lead mb-4 text-white opacity-8">
              Create, publish, and engage with your community.
            </p>
            <RouterLink to="create" class="btn btn-lg bg-primary text-white">
              Get started
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </header>
  <div class="card card-body shadow-xl mx-3 mx-md-4 mt-n6">
    <Stats />
    <Features />

    <div
      class="container-fluid mt-sm-5 border-radius-xl"
      :style="{
        background: 'linear-gradient(195deg, rgb(66, 66, 74), rgb(25, 25, 25))'
      }"
    >
      <div
        class="page-header py-6 py-md-5 my-sm-3 mb-3 border-radius-xl"
        :style="{
          backgroundImage: `url(${wavesWhite})`
        }"
        loading="lazy"
      >
        <span class="mask bg-gradient-dark"></span>
        <div class="container">
          <div class="row">
            <div class="d-flex justify-content-center p-5">
              <div class="col-lg-8 ms-lg-5 text-center">
                <h3 class="text-white">
                  Start publishing on web3 in seconds.
                </h3>
                <p class="text-white text-md">
                  Create, publish, and engage with your community.
                </p>
                <a
                  href="#"
                  class="btn btn-sm mb-0 bg-gradient-primary px-5 py-3 mt-4"
                  >Let's go!</a
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="py-5">
      <div class="container">
        <div class="row">
          <div class="col-lg-5 ms-auto">
            <h4 class="mb-1">Thank you for your support!</h4>
            <p class="lead mb-0">
              Share this page with your friends. It means a lot to us.
            </p>
          </div>
          <div class="col-lg-5 me-lg-auto my-lg-auto text-lg-end mt-5">
            <MaterialSocialButton
              route="https://twitter.com/intent/tweet?text=Check%2FWriton&url=https%3A%2F%2Fwriton.org"
              component="twitter"
              color="twitter"
              label="Tweet"
            />
            <MaterialSocialButton
              route="https://www.facebook.com/sharer/sharer.php?u=https://writon.org"
              component="facebook-square"
              color="facebook"
              label="Share"
            />
          </div>
        </div>
      </div>
    </div>

  </div>
  <DefaultFooter />
</template>
