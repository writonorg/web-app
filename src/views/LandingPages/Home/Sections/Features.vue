<script setup>
import RotatingCard from "../../../../examples/cards/rotatingCards/RotatingCard.vue";
import RotatingCardFront from "../../../../examples/cards/rotatingCards/RotatingCardFront.vue";
import RotatingCardBack from "../../../../examples/cards/rotatingCards/RotatingCardBack.vue";
import DefaultInfoCard from "../../../../examples/cards/infoCards/DefaultInfoCard.vue";
</script>
<template>
  <section class="my-5 py-5">
    <div class="container">
      <div class="row align-items-center">
        <div class="col-lg-4 ms-auto me-auto p-lg-4 mt-lg-0 mt-4">
          <RotatingCard>
            <RotatingCardFront
              image="https://images.unsplash.com/photo-1569683795645-b62e50fbf103?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80"
              icon="touch_app"
              title="Feel the Writon"
              description="Immerse yourself in a new era of writing and publishing with our user-friendly platform that seamlessly integrates with the Web3 ecosystem, empowering creators to engage with their audience like never before."
            />

            <RotatingCardBack
              image="https://images.unsplash.com/photo-1498889444388-e67ea62c464b?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1365&q=80"
              title="Discover More"
              description="Discover more about Writon by exploring our comprehensive documentation and examples, where you can learn more about our platform, its features, and how to use it to create, publish, and engage with your community."
              :action="[
                {
                  route: './/sections/page-sections/hero-sections.html',
                  label: 'Start with Creating a Post',
                },
              ]"
            />
          </RotatingCard>
        </div>
        <div class="col-lg-6 ms-auto">
          <div class="row justify-content-start">
            <DefaultInfoCard
              icon="content_copy"
              title="Decentralize by TON & IPFS"
              description="You publish it. You own it. Writon is built using web3 technologies: log in with TON, store your writing on IPFS, and publish it without needing to rely on a centralized platform."
            />
            <!-- icon="flip_to_front" -->
            <DefaultInfoCard
              icon="library_add"
              title="Collectable posts"
              description="Writon is built on top of the TON blockchain, which means that your posts are NFTs. You can sell them, trade them, or even give them away."
            />
          </div>
          <div class="row justify-content-start mt-5">
            <DefaultInfoCard
              class="mt-3"
              icon="auto_awesome"
              title="Web3-worthy editor"
              description="Web3 ideas deserve a specially designed toolkit. Built from the ground up on web3, Writon’s powerful editor explodes the possibilities of writing, allowing you to embed NFTs and compose with web3 blocks from across the ecosystem."
            />

            <DefaultInfoCard
              class="mt-3"
              icon="wallet"
              title="Wallet subscriptions"
              description="Writon takes subscriptions a step further by centering them on a web3 wallet, creating social and economic links between your audience and project. Build a wallet-based community that can be used across web3."
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
