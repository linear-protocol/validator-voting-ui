const config: App.AppConfig = {
  proposalContractId: 'mock-proposal.near', // 'reduce-inflation.near',
  validatorApi: 'https://validator-voting-api.linearprotocol.org',
  near: {
    network: {
      networkId: 'mainnet',
      nodeUrl: 'https://near.lava.build',
    },
  },
};

export default config;
