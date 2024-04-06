import { ponder } from "@/generated";

ponder.on(
  "GovernanceToken:DelegateVotesChanged",
  async ({ event, context }) => {
    console.log(event.args);
    const { Delegate } = context.db;
    const delegateAddress = event.args.delegate.toLowerCase();
    await Delegate.upsert({
      id: delegateAddress,
      create: {
        address: delegateAddress,
      },
      update: {
        address: delegateAddress,
      },
    });
  }
);

ponder.on("OptimismGovernorV6:VoteCast", async ({ event, context }) => {
  console.log("event: VoteCast", event.args.voter, event.args.proposalId);
  const { Delegate, Vote } = context.db;
  const delegateAddress = event.args.voter.toLowerCase();
  await Delegate.upsert({
    id: delegateAddress,
    create: {
      address: delegateAddress,
    },
    update: {
      address: delegateAddress,
    },
  });
  await Vote.upsert({
    id: event.transaction.hash,
    create: {
      delegateId: delegateAddress,
      proposalId: event.args.proposalId,
      blockNum: event.transaction.blockNumber,
      withReason: !!event.args.reason,
    },
    update: {
      delegateId: delegateAddress,
      proposalId: event.args.proposalId,
      blockNum: event.transaction.blockNumber,
      withReason: !!event.args.reason,
    },
  });
});

ponder.on(
  "OptimismGovernorV6:VoteCastWithParams",
  async ({ event, context }) => {
    console.log("event: VoteCast", event.args.voter, event.args.proposalId);
    const { Delegate, Vote } = context.db;
    const delegateAddress = event.args.voter.toLowerCase();
    await Delegate.upsert({
      id: delegateAddress,
      create: {
        address: delegateAddress,
      },
      update: {
        address: delegateAddress,
      },
    });
    await Vote.upsert({
      id: event.transaction.hash,
      create: {
        delegateId: delegateAddress,
        proposalId: event.args.proposalId,
        blockNum: event.transaction.blockNumber,
        withReason: !!event.args.reason,
      },
      update: {
        delegateId: delegateAddress,
        proposalId: event.args.proposalId,
        blockNum: event.transaction.blockNumber,
        withReason: !!event.args.reason,
      },
    });
  }
);
