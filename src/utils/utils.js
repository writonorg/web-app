export async function sleep(time) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}

export async function waitForSeqno(wallet, seqno) {
  const seqnoBefore =
    seqno === null ? await wallet.methods.seqno().call() : seqno;

  return async () => {
    for (let attempt = 0; attempt < 25; attempt++) {
      await sleep(3000);
      const seqnoAfter = await wallet.methods.seqno().call();
      console.log("seqnoBefore: ", seqnoBefore);
      console.log("seqnoAfter: ", seqnoAfter);
      if (seqnoAfter > seqnoBefore) {
        alert("Transaction is confirmed");
        return;
      }
    }
    throw new Error("Timeout");
  };
}
