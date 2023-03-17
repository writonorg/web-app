import { defineStore } from "pinia";

const mainnetConfig = {
    tonAPIUrl: import.meta.env.VITE_MAINNET_TON_API_URL,
    tonAPIKey: import.meta.env.VITE_MAINNET_TON_API_KEY,
    pinata: {
        apiKey: import.meta.env.VITE_MAINNET_PINATA_API_KEY,
        secret: import.meta.env.VITE_MAINNET_PINATA_API_SECRET,
        jwt: import.meta.env.VITE_MAINNET_PINATA_JWT
    },
    tonweb: {
        url: import.meta.env.VITE_MAINNET_TONWEB_URL,
        apiKey: import.meta.env.VITE_MAINNET_TONWEB_API_KEY
    }
}

const testnetConfig = {
    tonAPIUrl: import.meta.env.VITE_TESTNET_TON_API_URL,
    tonAPIKey: import.meta.env.VITE_TESTNET_TON_API_KEY,
    pinata: {
      apiKey: import.meta.env.VITE_TESTNET_PINATA_API_KEY,
      secret: import.meta.env.VITE_TESTNET_PINATA_API_SECRET,
      jwt: import.meta.env.VITE_TESTNET_PINATA_JWT
  }, 
    tonweb: {
        url: import.meta.env.VITE_TESTNET_TONWEB_URL,
        apiKey: import.meta.env.VITE_TESTNET_TONWEB_API_KEY
    }
}

const defaultConfig = import.meta.env.VITE_DEFAULT_ENV === "testnet" ? testnetConfig : mainnetConfig

export const useConfigStore = defineStore("configID", {
  state: () => ({ config: defaultConfig }),
  getters: {},
  actions: {
    setConfig(chain) {
      if(chain === "-3") {
        this.config = testnetConfig
      } else {
        this.config = mainnetConfig
      }
    },
  },
});
