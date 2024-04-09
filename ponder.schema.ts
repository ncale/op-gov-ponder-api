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
    proposalId: p.bigint(),
    blockNum: p.bigint(),
    withReason: p.boolean(),
  }),
}));
