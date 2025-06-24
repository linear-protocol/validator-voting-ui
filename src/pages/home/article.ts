/* eslint-disable no-useless-escape */
export const PROPOSAL_URL = 'https://gov.near.org/t/reduce-inflation-for-near-protocol/41140';

export const article = `
## **Context: NEAR’s Current Inflation Rate and Drawbacks**

NEAR’s token economics currently relies on a fixed 5% annual inflation rate on the total token supply. This rate was set at mainnet launch with the expectation that high network usage (and fee burns) would bring net inflation down to 2-3%. In reality, there has been minimal burning of fees (only \~0.1% of supply burned over the past year), so almost the entire 5% inflation is being added to the token supply. This translates to over 60 million new NEAR tokens minted each year, significantly increasing the number of tokens in circulation. This fixed 5% inflation also exacerbates over the years as it compounds. This excessive inflation dilutes existing holders and gradually devalues the NEAR token price.

The NEAR community needs a more sustainable inflation model that reduces inflation,  while still rewarding stakers and securing the network.

## **Inflation Change Proposal for Sustainable NEAR Economics**

Proposal Summary: Lower [*NEAR’s maximum inflation from 5% to 2.5%*](${PROPOSAL_URL}) *now, with flexibility to adjust in the future*

Rationale: Assuming \~0.1% of total supply burnt in transaction fees every year, 2.5% maximum inflation would result in an actual inflation of 2.4%, which is much healthier than the 4.9% we have today and make the economics of the protocol more sustainable. In addition, the current \~9% staking yield makes it unattractive for token holders to participate in DeFi on NEAR.

Maintaining a fixed maximum inflation rate makes it easy for the community to understand how tokenomics works. Adjustment to inflation can be done on a regular basis through voting, after [House of Stake](https://www.gauntlet.xyz/resources/near-house-of-stake-governance-proposal) is properly set up.

**Inflation Impact**: Inflation will be reduced to roughly 2.4%. Staking yield will be reduced to 4.5% assuming 50% of the total supply is staked. If some stakers decided to withdraw their stake due to lower yield, the staking yield will increase accordingly. There will be a much stronger incentive for NEAR token holders to put $NEAR into DeFi.

Why Now? Reducing NEAR’s inflation is an urgent priority. Every additional month of the status quo means millions of new NEAR entering into circulation, which is not only dilutive but also unnecessary due to limited burning of fees. High inflation without high usage is unsustainable. Furthermore, with multiple other layer 1 networks already taking action to lower inflation, it’s crucial for NEAR to move quickly, and not to take the risk of having a less attractive token economy for investors and users. This proposal addresses a core economic concern and aligns NEAR with a healthier, leaner inflation level.

## **Call to Action**

In conclusion, reducing inflation is a critical upgrade to NEAR’s token economics. It  substantially reduces inflation (from the current effective \~5% down to \~2.5%),  while preserving strong staking incentives and network security.

Such a change puts NEAR in line with other leading blockchains that are optimizing their tokenomics, and it showcases our community’s proactiveness in responding to economic realities. Lower inflation and controlled token issuance will enhance confidence in NEAR, benefiting all stakeholders by reducing unnecessary dilution and potentially supporting a more robust token value.

*Thank you for your consideration, and we look forward to your input on this proposal.*

To read more about the proposal and join the discussion, please visit the [post](${PROPOSAL_URL}).
`;
