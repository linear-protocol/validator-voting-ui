export const article = `
# Proposal: Dynamic Inflation Model for NEAR Protocol

## Context: NEAR’s Current Inflation and Drawbacks

NEAR’s token economics currently rely on a **fixed 5% annual inflation rate** on the total token supply. This rate was set at mainnet launch with the expectation that high network usage (and fee burns) would bring net inflation down to \~2-3%. In reality, **fee burns have been minimal (only \~0.1% of supply burned over the past year)**, so nearly the full 5% inflation is hitting the supply. This translates to **over 60 million new NEAR tokens minted each year**, significantly expanding the supply. Such **excess inflation dilutes existing holders and gradually devalues the NEAR token price**.

Key issues with the status quo include:

* **Excessive Net Inflation:** With low fees burned, net inflation remains \~4.9% (out of 5%), far above the intended 2-3% range. This adds tens of millions of NEAR to circulation yearly, outpacing network growth.
* **Token Dilution:** Continual 5% supply growth (vs. only 0.1% burned) means holders’ proportional ownership is diluted over time, potentially putting downward pressure on the token’s value.
* **Uncompetitive Tokenomics:** Other proof-of-stake chains (e.g. **Polkadot, Solana, Aptos**) have recently recognized similar issues and proposed **inflation reductions**. NEAR risks lagging behind if we don’t adjust our inflation model to align with industry best practices.

In summary, the current **5% fixed inflation** is **too high relative to usage**, causing unnecessary token supply growth and dilution. The NEAR community needs a more **sustainable inflation model** that curbs inflation while still rewarding stakers and securing the network.

## Proposed Inflation Change

**Proposal Summary:** *Change NEAR’s maximum inflation from 5% to 2.5%*

**Rationale:** With \~0.1% of total supply burnt in transaction fees every year, 2.5% maximum inflation would result in an actual inflation of 2.4%, which is much healthier than the 4.9% we have today and make the economics of the protocol more sustainable. In addition, the current \~9% staking yield makes it unattractive for token holders to use NEAR Defi.

Maintaining a fixed maximum inflation rate makes it easy for the community to understand how tokenomics works and adjustment can be done on a regular basis through voting when the House of Stake is properly set up.

**Inflation Impact:** Inflation will be reduced to roughly 2.4%. Staking yield will be reduced to 4.5% assuming 50% of the total supply is staked. If some stakers decided to withdraw their stake due to lower yield, the staking yield will increase accordingly. There will be a much stronger incentive for NEAR token holders to put $NEAR into Defi.

## Urgency and Path to Execution

**Why Now?** Reducing NEAR’s inflation is an urgent priority. Every additional month of the status quo means **millions of new NEAR entering circulation**, which is not only dilutive but also unnecessary given the low fee burn. **High inflation without high usage is unsustainable.** Furthermore, with **multiple other networks already taking action to lower inflation**, it’s crucial for NEAR to **move quickly** or risk having a less attractive token economy for investors and users. This proposal addresses a core economic concern and aligns NEAR with a healthier, leaner inflation level sooner rather than later.

**Governance Process:** To enact this change, the proposal will proceed through NEAR’s governance framework, albeit with some adaptations given current limitations:

* **Community-Driven Initiative:** This idea originates from community and ecosystem discussions about improving NEAR’s economics. We encourage well-known ecosystem participants (major validators, projects, or investors) to **sponsor and champion** the proposal when it goes up for a vote, demonstrating broad support.
* **Validator Vote:** Because NEAR’s on-chain governance (e.g. the **House of Stake** framework) is still in development and **won’t be fully operational for \~6 months**, we will use an **interim voting mechanism** for this decision. The plan is to implement a **special smart contract for delegated voting by validators** . In practice, each validator (and by extension their delegators) can cast a vote on the proposal through this contract, weighted by stake. A simple web frontend or dashboard will be provided to track votes and allow validators to participate easily . This method leverages our validator community’s consensus as the decision-making process, until formal governance is available. After the House of Stake is properly set up, it will conduct review and voting for changes to the maximum inflation on a regular basis.
* **Timeline:** The targeted timeline is as follows (subject to community feedback):
1. **Discussion (Now-Next Few Weeks):** Open community discussion on this forum post. We will incorporate feedback, address questions, and refine the proposal details.
2. **Final Proposal & Off-Chain Vote Setup (June 2025):** Based on community consensus, finalize the proposal text and technical implementation plan. Simultaneously, deploy the validator voting smart contract and prepare the voting interface.
3. **Validator Voting Period (Summer 2025):** Conduct a formal **validator vote** (over a predefined period, e.g. 1-2 weeks) on adopting the dynamic inflation model. This would be well **before the House of Stake launch**, to not delay the benefits of inflation reduction.
4. **Result & Implementation:** If the vote **passes with the required majority**, core developers will include the new inflation logic in the next protocol upgrade release. The change could be **activated in the network by late Q3 2025**, assuming a smooth voting process and technical rollout. (If the proposal is rejected, the community can discuss further refinements or alternatives.)

Throughout this process, we will also be raising awareness and educating the community. Expect **announcements, AMAs, and documentation** explaining the proposal’s details. Validator and community buy-in is crucial, so we want to ensure everyone understands **why this change is beneficial for NEAR’s future**.

## Conclusion and Call to Action

In conclusion, **adopting a change to the inflation model is a critical upgrade to NEAR’s economics**. It will **substantially reduce inflation** (from the current effective \~5% down to \~2.5%) while **preserving strong staking incentives** and network security.

Such a change puts NEAR in line with other leading blockchains that are optimizing their tokenomics, and it showcases our community’s proactiveness in responding to economic realities. **Lower inflation and controlled token issuance will enhance confidence in NEAR**, benefiting all stakeholders by reducing unnecessary dilution and potentially supporting a more robust token value.

**Call to Action:** We urge all NEAR community members, validators, and token holders to **support this proposal**. Engage in the discussion, ask questions, and help us fine-tune the details. Your feedback is valuable to ensure we get this right. If you agree that NEAR’s inflation should be made dynamic and reduced, please voice your support.

With consensus, we aim to move to the formal validator vote soon. **Let’s work together to implement this improvement to NEAR’s economics, strengthening the network’s viability and competitiveness for years to come.**

*Thank you for your consideration, and we look forward to your input on this proposal.*

To read more about the proposal and join the discussion, please visit the <a href="https://gov.near.org" target="_blank">post</a>.
`;
