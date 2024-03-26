import { ponder } from "@/generated";

// Create a delegate on DelegateVotesChanged, if one doesn't exist
ponder.on(
  "GovernanceToken:DelegateVotesChanged",
  async ({ event, context }) => {
    console.log(
      "event: DelegateVotesChanged",
      event.args.delegate,
      "\nnew balance:",
      event.args.newBalance
    );

    interface QueryResponse {
      address: `0x${string}`;
      name: `${string}.eth` | null;
      displayName: string;
      avatar: string | null;
    }
    const url = `https://api.ensideas.com/ens/resolve/${event.args.delegate}`;
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const ensInfo = (await res.json()) as QueryResponse;

    const { Delegate } = context.db;
    await Delegate.upsert({
      id: event.args.delegate,
      create: {
        address: event.args.delegate,
        votingPower: event.args.newBalance,
        ensName: ensInfo.name ?? undefined,
      },
      update: {
        votingPower: event.args.newBalance,
        ensName: ensInfo.name ?? undefined,
      },
    });
  }
);

// Create a vote on VoteCast or VoteCastWithParams
ponder.on("OptimismGovernorV6:VoteCast", async ({ event, context }) => {
  console.log("event: VoteCast", event.args.voter, event.args.proposalId);
  const { Vote } = context.db;
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
    const { Vote } = context.db;
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
