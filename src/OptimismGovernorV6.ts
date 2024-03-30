import { ponder } from "@/generated";

ponder.on("OptimismGovernorV6:VoteCast", async ({ event, context }) => {
  console.log("event: VoteCast", event.args.voter, event.args.proposalId);
  const { Delegate, Vote } = context.db;
  await Delegate.upsert({
    id: event.args.voter,
    create: {
      address: event.args.voter,
    },
    update: {
      address: event.args.voter,
    },
  });
  await Vote.upsert({
    id: event.transaction.hash,
    create: {
      delegateId: event.args.voter,
      proposalId: event.args.proposalId,
      blockNum: event.transaction.blockNumber,
    },
    update: {
      delegateId: event.args.voter,
      proposalId: event.args.proposalId,
      blockNum: event.transaction.blockNumber,
    },
  });
});

ponder.on(
  "OptimismGovernorV6:VoteCastWithParams",
  async ({ event, context }) => {
    console.log("event: VoteCast", event.args.voter, event.args.proposalId);
    const { Delegate, Vote } = context.db;
    await Delegate.upsert({
      id: event.args.voter,
      create: {
        address: event.args.voter,
      },
      update: {
        address: event.args.voter,
      },
    });
    await Vote.upsert({
      id: event.transaction.hash,
      create: {
        delegateId: event.args.voter,
        proposalId: event.args.proposalId,
        blockNum: event.transaction.blockNumber,
      },
      update: {
        delegateId: event.args.voter,
        proposalId: event.args.proposalId,
        blockNum: event.transaction.blockNumber,
      },
    });
  }
);
