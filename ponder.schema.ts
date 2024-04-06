import { createSchema } from "@ponder/core";

export default createSchema((p) => ({
  Delegate: p.createTable({
    id: p.string(),
    address: p.string(),
    votingPower: p.bigint(),
    votes: p.many("Vote.delegateId"),
  }),
  Vote: p.createTable({
    id: p.string(),
    delegateId: p.string().references("Delegate.id"),
    proposalId: p.bigint(),
    blockNum: p.bigint(),
    withReason: p.boolean(),
  }),
}));
