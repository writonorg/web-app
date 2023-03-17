<script setup>
import { onMounted, onUnmounted } from "vue";

//example components
import DefaultNavbar from "../../../examples/navbars/NavbarDefault.vue";
import DefaultFooter from "../../../examples/footers/FooterDefault.vue";

//image
import bg0 from "@/assets/img/bg9.jpg";

//dep
import Typed from "typed.js";

const body = document.getElementsByTagName("body")[0];
//hooks
onMounted(() => {
  body.classList.add("about-us");
  body.classList.add("bg-gray-200");

  if (document.getElementById("typed")) {
    // eslint-disable-next-line no-unused-vars
    var typed = new Typed("#typed", {
      stringsElement: "#typed-strings",
      typeSpeed: 90,
      backSpeed: 90,
      backDelay: 200,
      startDelay: 500,
      loop: true,
    });
  }
});

onUnmounted(() => {
  body.classList.remove("about-us");
  body.classList.remove("bg-gray-200");
});
</script>
<template>
  <DefaultNavbar
    :action="{
      route: 'create',
      label: 'Get Started',
      color: 'btn-white',
    }"
    transparent
  />
  <header class="bg-gradient-dark">
    <div
      class="page-header min-vh-75"
      :style="{ backgroundImage: `url(${bg0})` }"
    >
      <span class="mask bg-gradient-dark opacity-6"></span>
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-8 text-center mx-auto my-auto">
            <h1 class="text-white">
              We are believe in <span class="text-white" id="typed"></span>
            </h1>
            <div id="typed-strings">
              <h1>TON</h1>
              <h1>Decentraliztion</h1>
              <h1>Open Data</h1>
            </div>
            <p class="lead mb-4 text-white opacity-8">
              We are working to make writon vision a reality.
            </p>
            <button type="submit" class="btn bg-white text-dark">
              Get Started
            </button>
            <h6 class="text-white mb-2 mt-5">Find us on</h6>
            <div class="d-flex justify-content-center">
              
              <a href="https://t.me/writonorg" target="_blank"
                ><i class="fab fa-telegram text-lg text-white me-4"></i
              ></a>
              <a href="https://twitter.com/writonorg" target="_blank"
                ><i class="fab fa-twitter text-lg text-white me-4"></i
              ></a>
              <a href="https://facebook.com/writonorg" target="_blank"
                ><i class="fab fa-facebook text-lg text-white me-4"></i>
              </a>
             
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>

  <DefaultFooter />
</template>
