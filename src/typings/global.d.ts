namespace App {
  export interface AppConfig {
    proposalContractId: string;
    validatorApi: string;
    near: {
      network: {
        networkId: string;
        nodeUrl: string;
      };
    };
  }
}
