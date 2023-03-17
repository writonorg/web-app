import TonConnect from "@tonconnect/sdk";
import TonConnectUI from "@tonconnect/ui";
import { useWalletStore } from "@/stores/wallet";
import { useConfigStore } from "../stores/config";

export default {
  install: async (app, options) => {
    const connector = new TonConnect({
      manifestUrl: "https://writon.org/tonconnect-manifest.json",
    });
    connector.restoreConnection();

    const tonConnectUI = new TonConnectUI({
      connector,
    });

    const walletStore = useWalletStore();
    const configStore = useConfigStore();

    const unsubscribe = connector.onStatusChange((walletInfo) => {
      console.log("walletInfo: ", walletInfo);
      console.log("configStoreBefore: ", configStore.config);


      walletStore.setWallet(walletInfo);
      if(walletInfo) {      
        configStore.setConfig(walletInfo?.account?.chain);
        walletStore.setWalletInfo();
      }

      console.log("configStore: ", configStore.config);

    });

    app.config.globalProperties.$tonC = connector;
    app.provide("tonC", connector);

    app.config.globalProperties.$tonUI = tonConnectUI;
    app.provide("tonUI", tonConnectUI);
  },
};
