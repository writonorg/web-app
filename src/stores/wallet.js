import { defineStore } from "pinia";
import { toUserFriendlyAddress } from '@tonconnect/sdk';
import { useFetch } from "../utils/UseFetch";
import { useConfigStore } from "./config";
import axios from "axios";

export const useWalletStore = defineStore("walletID", {
  state: () => ({ wallet: null, walletInfo: {
    balance: 0
  }, timer: 0 }),
  getters: {
    getWallet() {
      return this.wallet;
    },
    toUserFriendlyAddress() {
      return toUserFriendlyAddress(this.wallet.account.address);
    },
    toTrimmedUserFriendlyAddress() {
      let address = toUserFriendlyAddress(this.wallet.account.address);
      return address.slice(0, 6) + "..." + address.slice(-6);
    },
    address() {
      return this.wallet.account.address;
    },
    chain() {
      return this.wallet.account.chain;
    },
    toTextChain() {
      return this.wallet.account.chain === "-239" ? "Mainnet" : "Testnet";
    },
    balance() {
      return this.walletInfo?.balance;
    },
    balanceUserFriendly() {
      return (this.walletInfo?.balance / 1000000000).toFixed(2);
    }
  },
  actions: {
    setWallet(wallet) {
      this.wallet = wallet;
    },
    async setWalletInfoFetch() {
      
      const now = Date.now();
      if(now < this.timer) {
        console.log("walletinfo exists on store, timer: ", this.timer - now);
        return;
      }

      const configStore = useConfigStore();
      console.log(`${configStore.config.tonAPIUrl}/v1/account/getInfo?account=${this.wallet.account.address}}`);

      const { data, error } = useFetch(
        `${configStore.config.tonAPIUrl}/v1/account/getInfo?account=${this.wallet.account.address}}`
      );
      console.log("data: ", data);
      console.log("error: ", error);
      console.log("data._value: ", data._value);
      console.log("error.value: ", error.value);

      if(data.value && !error.value) {
        this.walletInfo = data;
        this.timer = now + 1000;
      }
      
    },
    setWalletInfo() {

      const now = Date.now();
      if(now < this.timer) {
        console.log("walletinfo exists on store, timer: ", this.timer - now);
        return;
      }
      
      let self = this;
      const configStore = useConfigStore();

      axios.get(`${configStore.config.tonAPIUrl}/v1/account/getInfo?account=${this.wallet.account.address}}`)
      .then((response) => {
        console.log(response.data)
        self.walletInfo = response.data;
        self.timer = now + 100;
      }).catch((error) => {
        console.log(error)
      });


    }

  },
});
