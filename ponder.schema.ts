import { createSchema } from "@ponder/core";

export default createSchema((p) => ({
  Delegate: p.createTable({
    id: p.hex(),
    address: p.hex(),
    votingPower: p.bigint(),
    ensName: p.string().optional(),
    ensAvatar: p.string().optional(),
    votes: p.many("Vote.delegateId"),
  }),
  Vote: p.createTable({
    id: p.hex(),
    delegateId: p.hex().references("Delegate.id"),
    proposalId: p.bigint().references("Proposal.id"),
    blockNum: p.bigint(),
    withReason: p.boolean(),
  }),
  Proposal: p.createTable({
    id: p.bigint(),
    proposer: p.hex(),
    description: p.string(),
    votes: p.many("Vote.proposalId"),
    for: p.bigint(),
    against: p.bigint(),
    abstain: p.bigint(),
  }),
}));
