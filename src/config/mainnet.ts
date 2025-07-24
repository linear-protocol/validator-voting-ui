const config: App.AppConfig = {
  proposalContractId: 'test-proposal.near',
  // validatorApi: 'https://validator-voting-api.linearprotocol.org',
  validatorApi: "https://validator-voting-api-dev-7d3e8c25989f.herokuapp.com",
  near: {
    network: {
      networkId: 'mainnet',
      nodeUrl: 'https://free.rpc.fastnear.com',
    },
  },
};

export default config;
