<script setup>
import CountTo from "vue-count-to/src";

defineProps({
  count: {
    type: Number,
    required: true,
  },
  suffix: {
    type: String,
    default: "",
  },
  prefix: {
    type: String,
    default: "",
  },
  duration: {
    type: Number,
    default: 4000,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  color: {
    validator(value) {
      return [
        "primary",
        "secondary",
        "info",
        "success",
        "warning",
        "error",
        "light",
        "dark",
      ].includes(value);
    },
  },
  divider: {
    validator(value) {
      return ["vertical", "horizontal"].includes(value);
    },
  },
});
</script>
<template>
  <div class="text-center">
    <h2 :class="`text-gradient text-${color ?? 'success'}`">
      {{
        prefix
      }}
      <CountTo :start-val="0" :end-val="count" :duration="duration" />{{
        suffix
      }}
    </h2>
    <h5 class="mt-3">{{ title }}</h5>
    <p class="text-sm font-weight-normal">
      {{ description }}
    </p>
  </div>
  <hr :class="`${divider ? divider : ''} dark`" />
</template>
