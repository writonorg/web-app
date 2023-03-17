<script setup>
defineProps({
  socials: {
    type: Array,
    icon: String,
    link: String,
    default: () => [
      {
        icon: '<i class="fab fa-facebook text-lg opacity-8"></i>',
        link: "https://www.facebook.com/writonorg/",
      },
      {
        icon: '<i class="fab fa-twitter text-lg opacity-8"></i>',
        link: "https://twitter.com/writonorg",
      },
      {
        icon: '<i class="fab fa-telegram text-lg opacity-8"></i>',
        link: "https://t.me/writonorg",
      },
      {
        icon: '<i class="fab fa-github text-lg opacity-8"></i>',
        link: "https://github.com/writonorg",
      }
    ],
  },
  links: {
    type: Array,
    name: String,
    href: String,
    default: () => [
      { href: "https://writon.org/", name: "Company" },
      { href: "https://writon.org/about-us", name: "About Us" },
      { href: "https://writon.org/contact-us", name: "Contact Us" },
      {
        href: "https://writon.org/templates/vuejs",
        name: "Products",
      },
      { href: "https://writon.org/blog", name: "Blog" },
      { href: "https://writon.org/license", name: "License" },
    ],
  },
});
</script>
<template>
  <footer class="footer py-5">
    <div class="container">
      <div class="row">
        <div class="col-lg-8 mb-4 mx-auto text-center">
          <a
            v-for="{ name, href } of links"
            :key="name"
            :href="href"
            target="_blank"
            class="text-secondary me-xl-5 me-3 mb-sm-0 mb-2"
          >
            {{ name }}
          </a>
        </div>
        <div class="col-lg-8 mx-auto text-center mb-4 mt-2">
          <a
            v-for="{ icon, link } of socials"
            :key="link"
            :href="link"
            target="_blank"
            class="text-secondary me-xl-4 me-4"
            v-html="icon"
          >
          </a>
        </div>
      </div>
      <div class="row">
        <div class="col-8 mx-auto text-center mt-1">
          <p class="mb-0 text-secondary">
            Copyright © {{ new Date().getFullYear() }} Writon Team
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>
