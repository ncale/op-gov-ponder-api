import { EventNames, ponder } from "@/generated";
import { Address } from "viem";
import { getEnsData } from "./getEnsData";
import { logger } from "./logger";

const proposalCreatedEvents = [
  "OptimismGovernorV6:ProposalCreated(uint256 indexed proposalId, address indexed proposer, address indexed votingModule, bytes proposalData, uint256 startBlock, uint256 endBlock, string description, uint8 proposalType)",
  "OptimismGovernorV6:ProposalCreated(uint256 indexed proposalId, address indexed proposer, address[] targets, uint256[] values, string[] signatures, bytes[] calldatas, uint256 startBlock, uint256 endBlock, string description, uint8 proposalType)",
  "OptimismGovernorV6:ProposalCreated(uint256 proposalId, address proposer, address[] targets, uint256[] values, string[] signatures, bytes[] calldatas, uint256 startBlock, uint256 endBlock, string description)",
  "OptimismGovernorV6:ProposalCreated(uint256 proposalId, address proposer, address votingModule, bytes proposalData, uint256 startBlock, uint256 endBlock, string description)",
] as const satisfies Array<EventNames>;

for (const eventName of proposalCreatedEvents) {
  ponder.on(eventName, async ({ event, context }) => {
    logger.trace("Event: ProposalCreated", event.args.proposalId);
    const { Proposal } = context.db;
    await Proposal.create({
      id: event.args.proposalId,
      data: {
        proposer: event.args.proposer,
        description: event.args.description,
        startBlock: event.args.startBlock,
        endBlock: event.args.endBlock,
        canceled: false,
        executed: false,
      },
    });
  });
}

ponder.on("OptimismGovernorV6:ProposalExecuted", async ({ event, context }) => {
  const { proposalId } = event.args;
  logger.trace("Event: ProposalExecuted", event.args.proposalId);
  const { Proposal } = context.db;
  await Proposal.update({
    id: proposalId,
    data: ({ current }) => {
      return {
        executed: true,
      };
    },
  });
});

ponder.on("OptimismGovernorV6:ProposalCanceled", async ({ event, context }) => {
  const { proposalId } = event.args;
  logger.trace("Event: ProposalCanceled", event.args.proposalId);
  const { Proposal } = context.db;
  await Proposal.update({
    id: proposalId,
    data: ({ current }) => {
      return {
        canceled: true,
      };
    },
  });
});

ponder.on(
  "OptimismGovernorV6:ProposalDeadlineUpdated",
  async ({ event, context }) => {
    logger.trace("Event: ProposalDeadlineUpdated", event.args.proposalId);
    const { Proposal } = context.db;
    await Proposal.update({
      id: event.args.proposalId,
      data: ({ current }) => {
        return {
          endBlock: event.args.deadline,
        };
      },
    });
  }
);

const voteCastEvents = [
  "OptimismGovernorV6:VoteCast",
  "OptimismGovernorV6:VoteCastWithParams",
] as const satisfies Array<EventNames>;

for (const eventName of voteCastEvents) {
  ponder.on(eventName, async ({ event, context }) => {
    logger.trace("event: VoteCast", event.args.proposalId);

    const delegateAddress = event.args.voter.toLowerCase() as Address;
    const { Vote } = context.db;
    const { Proposal } = context.db;

    const proposal = await Proposal.findUnique({
      id: event.args.proposalId,
    });

    // if proposal doesn't exist, skip entirely
    if (!proposal) {
      return;
    }
    await Promise.all([
      Vote.upsert({
        id: event.transaction.hash,
        create: {
          delegateId: delegateAddress,
          proposalId: event.args.proposalId,
          blockNum: event.transaction.blockNumber,
          withReason: !!event.args?.reason,
        },
        update: {
          delegateId: delegateAddress,
          proposalId: event.args.proposalId,
          blockNum: event.transaction.blockNumber,
          withReason: !!event.args.reason,
        },
      }),
    ]);
  });
}

ponder.on(
  "GovernanceToken:DelegateVotesChanged",
  async ({ event, context }) => {
    logger.trace(
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
          ensName: primaryName || undefined,
          ensAvatar: avatar || undefined,
        },
      });
    }
  }
);
