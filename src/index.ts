import { ponder } from "@/generated";
import { getEnsData } from "./getEnsData";
import { Address } from "viem";

ponder.on(
  "GovernanceToken:DelegateVotesChanged",
  async ({ event, context }) => {
    console.log(
      "Event: DelegateVotesChanged",
      event.args.delegate,
      event.args.newBalance
    );

    const delegateAddress = event.args.delegate.toLowerCase() as Address;
    const { Delegate } = context.db;

    const delegate = await Delegate.findUnique({
      id: delegateAddress,
    });

    if (delegate) {
      await Delegate.update({
        id: delegateAddress,
        data: {
          votingPower: event.args.newBalance,
        },
      });
    } else {
      const { primaryName, avatar } = await getEnsData(delegateAddress);
      await Delegate.create({
        id: delegateAddress,
        data: {
          address: delegateAddress,
          votingPower: event.args.newBalance,
          ensName: primaryName ? primaryName : undefined,
          ensAvatar: avatar ? avatar : undefined,
        },
      });
    }
  }
);

ponder.on("OptimismGovernorV6:VoteCast", async ({ event, context }) => {
  console.log("event: VoteCast", event.args.voter, event.args.proposalId);

  const delegateAddress = event.args.voter.toLowerCase() as Address;
  const { Vote } = context.db;

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

    const delegateAddress = event.args.voter.toLowerCase() as Address;
    const { Vote } = context.db;

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
