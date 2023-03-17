import { createRouter, createWebHistory } from "vue-router";

import HomeView from "../views/LandingPages/Home/HomeView.vue";
import AboutView from "../views/LandingPages/AboutUs/AboutView.vue";
import ContactView from "../views/LandingPages/ContactUs/ContactView.vue";
import AuthorView from "../views/LandingPages/Author/AuthorView.vue";
import CreatePostView from "../views/LandingPages/CreatePost/CreatePostView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/create",
      name: "create",
      component: CreatePostView,
    },
    
    {
      path: "/about-us",
      name: "about",
      component: AboutView,
    },
    {
      path: "/contact-us",
      name: "contactus",
      component: ContactView,
    },
    {
      path: "/author",
      name: "author",
      component: AuthorView,
    }
  ],
});

export default router;
