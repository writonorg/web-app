<script setup>
import { onMounted } from "vue";

// example components
import DefaultNavbar from "@/examples/navbars/NavbarDefault.vue";
import Header from "@/examples/Header.vue";

//Vue Material Kit 2 components
import MaterialInput from "@/components/MaterialInput.vue";
import MaterialButton from "@/components/MaterialButton.vue";
import MaterialTextArea from "@/components/MaterialTextArea.vue";

import { useWalletStore } from "@/stores/wallet";


// external
import axios from "axios";
import router from "@/router";
import { waitForSeqno } from "../../../utils/utils";


// material-input
import setMaterialInput from "@/assets/js/material-input";

const walletStore = useWalletStore();


onMounted(() => {
  setMaterialInput();
});
</script>

<script>
import TonWeb from "tonweb-fix";
const { NftCollection, NftItem } = TonWeb.token.nft;

// store
import { useConfigStore } from "@/stores/config";
import { useWalletStore } from "@/stores/wallet";


export default {
  setup() {
  },
  inject: ["tonC", "tonUI"],

  data() {
    return {
      royalty: null,
      title: null,
      contentData: null,
      imageHash: null,
      ipfsHash: null,
      collectionAddress: null,
      nftItemAddress: null,
      NftItemHash: null,
      loading: {
        ipfsUpload: false,
        mintCollection: false,
        mintNFT: false,
        uploadImage: false,
        confirming: false,
      },
      tonweb: null
    };
  },
  components: {
  },

  mounted() {

    const configStore = useConfigStore();
    this.configStore = configStore;
    
    let self = this;
    setTimeout(() => {
      self.tonweb = new TonWeb(
        new TonWeb.HttpProvider(configStore.config.tonweb.url, {
          apiKey: configStore.config.tonweb.apiKey,
        })
      );  
    }, 1000);


  },
  methods: {
    async getNFTCollection() {
      const walletStore = useWalletStore();

      const provider = this.tonweb.provider;

      const wallet = new TonWeb.utils.Address(walletStore.address);

      const createCollectionParams = {
        ownerAddress: wallet,
        royalty: parseFloat(this.royalty),
        royaltyAddress: wallet,
        collectionContentUri: `https://gateway.pinata.cloud/ipfs/${this.ipfsHash}`,
        nftItemContentBaseUri: "https://gateway.pinata.cloud/ipfs/",
        nftItemCodeHex: NftItem.codeHex,
      };

      const nftCollection = new NftCollection(provider, createCollectionParams);
      const nftCollectionAddress = await nftCollection.getAddress();
      console.log(
        "collection address=",
        nftCollectionAddress.toString(true, true, true)
      );

      return nftCollection;
    },

    async deployNFTCollection() {

      console.log(this.contentData);

      if (!this.title || !this.contentData) {
        alert("Please fill all fields");
        return;
      }

      if (this.collectionAddress) {
        alert("Collection already deployed");
        return;
      }

      if (this.loading.confirming) {
        alert("Wait for confirmation");
        return;
      }

      await this.uploadCollecionData();

      this.loading.mintCollection = true;

      const nftCollection = await this.getNFTCollection();
      const nftCollectionAddress = await nftCollection.getAddress();

      const walletStore = useWalletStore();

      const stateInit = (await nftCollection.createStateInit()).stateInit;
      const stateInitBoc = await stateInit.toBoc(false);
      const stateInitBase64 = TonWeb.utils.bytesToBase64(stateInitBoc);

      const wallet = this.tonweb.wallet.create({
        address: walletStore.address,
      });
      const seqno = await wallet.methods.seqno().call();

      const transaction = {
        validUntil: Math.floor(new Date() / 1000) + 360,
        seqno: seqno,
        messages: [
          {
            address: nftCollectionAddress.toString(true, true, true),
            amount: TonWeb.utils.toNano("0.1").toString(),
            payload: "",
            stateInit: stateInitBase64,
          },
        ],
      };

      try {
        const waiter = await waitForSeqno(wallet, seqno);

        const result = await this.tonC.sendTransaction(transaction);

        this.collectionAddress = nftCollectionAddress.toString(
          true,
          true,
          true
        );

        setTimeout(() => {
          walletStore.setWalletInfo();
        }, 5000);

        this.loading.confirming = true;
        await waiter();
        this.loading.confirming = false;

        this.deployNFTItem();

        console.log(result, "result");
      } catch (error) {
        console.log(error, "error");
      }

      this.loading.mintCollection = false;
    },

    async deployNFTItem() {
      if (!this.collectionAddress) {
        alert("Deploy collection first");
        return;
      }

      if (this.loading.confirming) {
        alert("Wait for confirmation");
        return;
      }

      await this.uploadNFTItemData();

      this.loading.mintNFT = true;

      const nftCollection = await this.getNFTCollection();
      const nftCollectionAddress = await nftCollection.getAddress();

      const walletStore = useWalletStore();

      const amount = TonWeb.utils.toNano("0.01").toString();

      const bodyJson = {
        amount: amount,
        itemIndex: 0,
        itemOwnerAddress: new TonWeb.utils.Address(walletStore.address),
        itemContentUri: `${this.NftItemHash}`,
      };

      const body = await nftCollection.createMintBody(bodyJson);

      const bodyBoc = await body.toBoc(false);
      const bodyBase64 = TonWeb.utils.bytesToBase64(bodyBoc);

      const wallet = this.tonweb.wallet.create({
        address: walletStore.address,
      });
      const seqno = await wallet.methods.seqno().call();

      const transaction = {
        validUntil: Math.floor(new Date() / 1000) + 360,
        seqno: seqno,
        messages: [
          {
            address: nftCollectionAddress.toString(true, true, true),
            amount: amount,
            payload: bodyBase64,
          },
        ],
      };

      try {
        const waiter = await waitForSeqno(wallet, seqno);

        const result = await this.tonC.sendTransaction(transaction);

        this.nftItemAddress = result.boc.toString(true, true, true);

        setTimeout(() => {
          walletStore.setWalletInfo();
        }, 5000);

        this.loading.confirming = true;
        await waiter();
        this.loading.confirming = false;
      } catch (error) {
        console.log(error, "error");
      }

      this.loading.mintNFT = false;
    },

    async getInfo() {
      console.log(nftCollection, "nftCollection");

      const nftCollection = await this.getNFTCollection();

      const data = await nftCollection.getCollectionData();
      console.log(data);

      data.ownerAddress = data.ownerAddress.toString(true, true, true);
      console.log(data);
      const royaltyParams = await nftCollection.getRoyaltyParams();
      royaltyParams.royaltyAddress = royaltyParams.royaltyAddress.toString(
        true,
        true,
        true
      );
      console.log(royaltyParams);
      const nftItemAddress0 = (
        await nftCollection.getNftItemAddressByIndex(0)
      ).toString(true, true, true);
      console.log(nftItemAddress0);

      const nftItem = new NftItem(provider, { address: nftItemAddress0 });
      const nftData = await nftCollection.methods.getNftItemContent(nftItem);
      nftData.collectionAddress = nftData.collectionAddress.toString(
        true,
        true,
        true
      );
      nftData.ownerAddress = nftData.ownerAddress?.toString(true, true, true);
      console.log(nftData);
    },

    async connectWallet() {
      await this.tonUI
        .connectWallet()
        .then((res) => {
          console.log(res, "res");
          return res;
        })
        .catch((err) => {
          console.log(err, "err");
          return err;
        });
    },
    async uploadCollecionData() {
      if (this.ipfsHash) {
        alert("Already uploaded, refresh page to upload again");
        return;
      }

      if (!this.title || !this.contentData) {
        alert("Please fill all fields");
        return;
      }

      this.loading.ipfsUpload = true;

      const walletStore = useWalletStore();

      const jsonData = {
        name: this.title,
        description: this.contentData
          .substring(0, 100)
          .replace(/(<([^>]+)>)/gi, ""),
        image: this.imageHash
          ? `https://gateway.pinata.cloud/ipfs/${this.imageHash}`
          : null,
        external_link: "https://writon.org",
        seller_fee_basis_points: 100,
        fee_recipient: walletStore.toUserFriendlyAddress,
        html: this.contentData,
      };

      var data = JSON.stringify({
        pinataOptions: {
          cidVersion: 0,
        },
        pinataMetadata: {
          name: this.title + " Collection Data",
        },
        pinataContent: jsonData,
      });

      var config = {
        method: "post",
        url: "https://api.pinata.cloud/pinning/pinJSONToIPFS",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.configStore.config.pinata.jwt,
        },
        data: data,
      };

      let self = this;

      const result = await axios(config)
        .then(function (response) {
          self.ipfsHash = response.data.IpfsHash;
          return response.data.IpfsHash;
        })
        .catch(function (error) {
          console.log(error, "error");
          return error;
        });

      self.loading.ipfsUpload = false;

      return result;
    },

    async uploadNFTItemData() {
      if (this.NftItemHash) {
        alert("Already uploaded, refresh page to upload again");
        return;
      }

      if (!this.title || !this.contentData) {
        alert("Please fill all fields");
        return;
      }

      this.loading.ipfsUpload = true;

      const walletStore = useWalletStore();

      const jsonData = {
        attributes: [
          {
            display_type: "number",
            trait_type: "Length",
            value: this.contentData.length,
          },
        ],
        description: this.contentData
          .substring(0, 100)
          .replace(/(<([^>]+)>)/gi, ""),
        external_url:
          "https://writon.org/" + walletStore.toUserFriendlyAddress,
        image: this.imageHash
          ? `https://gateway.pinata.cloud/ipfs/${this.imageHash}`
          : null,
        name: this.title,
        html: this.contentData,
      };

      var data = JSON.stringify({
        pinataOptions: {
          cidVersion: 0,
        },
        pinataMetadata: {
          name: this.title + " NFT Item",
        },
        pinataContent: jsonData,
      });

      var config = {
        method: "post",
        url: "https://api.pinata.cloud/pinning/pinJSONToIPFS",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.configStore.config.pinata.jwt,
        },
        data: data,
      };

      let self = this;

      const result = await axios(config)
        .then(function (response) {
          self.NftItemHash = response.data.IpfsHash;
          return response.data.IpfsHash;
        })
        .catch(function (error) {
          console.log(error, "error");
          return error;
        });
      self.loading.ipfsUpload = false;
      return result;
    },

    async uploadImage($event) {
      const file = $event.target.files[0];

      if (!file) {
        alert("Please select image");
        return;
      }

      this.loading.uploadImage = true;

      const formData = new FormData();

      const fileName = file.toString().split("\\").pop();
      const fileExt = fileName.split(".").pop();
      const fileType = `image/${fileExt.toLowerCase()}`;

      formData.append("file", file);

      const metadata = JSON.stringify({
        name: fileName,
      });
      formData.append("pinataMetadata", metadata);
      const options = JSON.stringify({
        cidVersion: 0,
      });
      formData.append("pinataOptions", options);

      let resFinal = null;
      try {
        const res = await axios.post(
          "https://api.pinata.cloud/pinning/pinFileToIPFS",
          formData,
          {
            maxBodyLength: "Infinity",
            headers: {
              "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
              Authorization: `Bearer ${this.configStore.config.pinata.jwt}`,
            },
          }
        );
        this.imageHash = res.data.IpfsHash;
        resFinal = res.data;
      } catch (error) {
        console.log(error);
        resFinal = null;
      }

      this.loading.uploadImage = false;
      return resFinal;
    },

    goToPost() {
      // router.push({ name: 'author', params: { username: 'eduardo' } })
      router.push({ name: "author" });
    },
  },
};
</script>

<template>
  <DefaultNavbar transparent />
  <Header>
    <div
      class="page-header align-items-start min-vh-100"
      :style="{
        backgroundImage:
          'url(https://images.unsplash.com/photo-1497294815431-9365093b7331?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1950&q=80)',
      }"
      loading="lazy"
    >
      <span class="mask bg-gradient-dark opacity-6"></span>
      <div class="container my-auto">
        <div class="row">
          <div class="col-lg-8 col-md-8 col-12 mx-auto">
            <div class="card z-index-0 fadeIn3 fadeInBottom">
              <div
                class="card-header p-0 position-relative mt-n4 mx-3 z-index-2"
              >
                <div
                  class="bg-gradient-primary shadow-primary border-radius-lg py-3 pe-1"
                >
                  <h4
                    class="text-white font-weight-bolder text-center mt-2 mb-0"
                  >
                    Write your first post
                  </h4>
                </div>
              </div>
              <div class="card-body">
                <form role="form" class="text-start" @submit.prevent="">
                  <MaterialInput
                    id="image"
                    class="input-group-outline my-3"
                    :label="{ text: 'Image', class: 'form-label' }"
                    type="file"
                    accept="image/jpeg, image/png, image/jpg"
                    @change="uploadImage"
                  />

                  <p v-if="loading.uploadImage">
                    {{ loading.uploadImage ? "Uploading..." : "" }}
                  </p>

                  <img
                    v-if="imageHash"
                    width="200"
                    :src="`https://gateway.pinata.cloud/ipfs/${imageHash}`"
                    :alt="imageHash"
                  />

                  <MaterialInput
                    id="title"
                    class="input-group-outline my-3"
                    :label="{ text: 'Title', class: 'form-label' }"
                    type="text"
                    :value="title"
                    @change="title = $event.target.value"
                  />

                  <MaterialInput
                    id="royalty"
                    class="input-group-outline my-3"
                    :label="{ text: 'Royalty(0.01 for 1%)', class: 'form-label' }"
                    type="text"
                    :value="royalty"
                    @change="royalty = $event.target.value"
                    max="1"
                  />



                  <MaterialTextArea
                    id="contentData"
                    class="input-group-outline my-3"
                    labelClass="form-label"
                    placeholder="Write your post here..."
                    @change="contentData = $event.target.value" >
                  </MaterialTextArea>

                  <div class="text-center">
                    <MaterialButton
                      v-if="walletStore && walletStore.wallet === null"
                      @click="connectWallet"
                      class="my-4 mb-2"
                      variant="gradient"
                      color="primary"
                      >Connect Wallet</MaterialButton
                    >

                    <MaterialButton
                      v-else
                      class="my-4 mb-2"
                      variant="gradient"
                      color="primary"
                      data-bs-toggle="modal"
                      data-bs-target="#stepperModal"
                      >Create POST and NFT</MaterialButton
                    >
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Modal -->
      <div
        class="modal fade z-index-9999"
        id="stepperModal"
        tabindex="-1"
        aria-labelledby="stepperModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="stepperModalLabel">
                Steps to complete the transaction
              </h5>
              <MaterialButton
                color="none"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
              </MaterialButton>
            </div>
            <div class="modal-body">
              <div class="row">
                <div class="col-12">
                  <!-- <MaterialButton variant="gradient" :color="ipfsHash ? 'success' : 'secondary' "  @click="uploadData"> -->
                  {{ loading.ipfsUpload ? "Uploading To IPFS..." : null }}
                  <!-- </MaterialButton> -->

                  {{ loading.confirming ? "Wait for confirmation..." : null }}
                </div>
              </div>

              <div class="row">
                <div class="col-12 bm-2">
                  <MaterialButton
                    variant="gradient"
                    :color="collectionAddress ? 'success' : 'secondary'"
                    @click="deployNFTCollection"
                  >
                    {{
                      loading.mintCollection
                        ? "1- Minting (confirm with wallet)..."
                        : "1- Mint Collection"
                    }}
                  </MaterialButton>

                  <p v-if="ipfsHash" class="text-sm">
                    IPFS:
                    <a
                      :href="`https://gateway.pinata.cloud/ipfs/${ipfsHash}`"
                      target="_blank"
                    >
                      {{ ipfsHash }}
                    </a>
                  </p>

                  <p v-if="collectionAddress" class="text-sm">
                    Collection:
                    <a
                      :href="`https://testnet.tonscan.org/nft/${collectionAddress}`"
                      target="_blank"
                    >
                      {{ collectionAddress }}
                    </a>
                  </p>
                </div>
              </div>

              <div class="row">
                <div class="col-12">
                  <MaterialButton
                    variant="gradient"
                    :color="nftItemAddress ? 'success' : 'secondary'"
                    @click="deployNFTItem"
                  >
                    {{ loading.mintNFT ? "2- Minting (confirm with wallet)..." : "2- Mint NFT Item" }}
                  </MaterialButton>

                  <p v-if="NftItemHash" class="text-sm">
                    IPFS:
                    <a
                      :href="`https://gateway.pinata.cloud/ipfs/${NftItemHash}`"
                      target="_blank"
                    >
                      {{ NftItemHash }}
                    </a>
                  </p>

                  <span v-if="nftItemAddress" class="text-sm">
                    NFT Item:
                    <a
                      :href="`https://testnet.tonscan.org/nft/${collectionAddress}`"
                      target="_blank"
                    >
                      {{ collectionAddress }}
                    </a>
                  </span>
                </div>
              </div>
            </div>
            <div class="modal-footer justify-content-between">
              <MaterialButton
                variant="gradient"
                data-bs-dismiss="modal"
                color="none"
              >
                Close
              </MaterialButton>

              <MaterialButton
                v-if="nftItemAddress"
                variant="gradient"
                color="success"
                class="mb-0"
                data-bs-dismiss="modal"
                @click="goToPost"
              >
                Done and go to the post
              </MaterialButton>
            </div>
          </div>
        </div>
      </div>
      <!-- END Modal -->

      <footer class="footer position-absolute bottom-2 py-2 w-100">
        <div class="container">
          <div class="row align-items-center justify-content-lg-between">
            <div class="col-12 col-md-6 my-auto">
              <div
                class="copyright text-center text-sm text-white text-lg-start"
              >
                © {{ new Date().getFullYear() }}, made with
                <i class="fa fa-heart" aria-hidden="true"></i> by
                <a href="/about-us" class="font-weight-bold text-white"
                  >Writon Team</a
                >
              </div>
            </div>
            <div class="col-12 col-md-6">
              <ul
                class="nav nav-footer justify-content-center justify-content-lg-end"
              >
                <li class="nav-item">
                  <a
                    href="https://writon.org"
                    class="nav-link text-white"
                    target="_blank"
                    >Writon</a
                  >
                </li>
                <li class="nav-item">
                  <a
                    href="https://writon.org/about-us"
                    class="nav-link text-white"
                    target="_blank"
                    >About Us</a
                  >
                </li>
                <li class="nav-item">
                  <a
                    href="https://writon.org/blog"
                    class="nav-link text-white"
                    target="_blank"
                    >Blog</a
                  >
                </li>
                <li class="nav-item">
                  <a
                    href="https://writon.org/license"
                    class="nav-link pe-0 text-white"
                    target="_blank"
                    >License</a
                  >
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  </Header>
</template>
