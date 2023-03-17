<script setup>
// example component
import DefaultCounterCard from "../../../../examples/cards/counterCards/DefaultCounterCard.vue";
</script>
<template>
  <section class="pt-4 pb-6" id="count-stats">
    <div class="container">
      <div class="row justify-content-center text-center">
        <div class="col-md-3">
          <DefaultCounterCard
            color="primary"
            title="Created Posts"
            description="Total number of posts created"
            :count="29992"
            suffix=" Posts"
            :duration="3000"
          />
        </div>
        <div class="col-md-3">
          <DefaultCounterCard
            color="primary"
            title="Collected NFTs"
            description="Total number of NFTs collected"
            :count="212546"
            suffix=" NFTs"
            :duration="4000"
          />
        </div>
        <div class="col-md-3">
          <DefaultCounterCard
            color="primary"
            title="Creators"
            description="Total number of creators"
            :count="95"
            :duration="5000"
          />
        </div>
      </div>
    </div>
  </section>
</template>
