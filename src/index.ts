import { EventNames, ponder } from "@/generated";
import { getEnsData } from "./getEnsData";
import { Address } from "viem";
import { logger } from "./logger";

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
          ensName: primaryName ? primaryName : undefined,
          ensAvatar: avatar ? avatar : undefined,
        },
      });
    }
  }
);

const proposalCreatedEvents = [
  "OptimismGovernorV6:ProposalCreated(uint256 indexed proposalId, address indexed proposer, address indexed votingModule, bytes proposalData, uint256 startBlock, uint256 endBlock, string description, uint8 proposalType)",
  "OptimismGovernorV6:ProposalCreated(uint256 indexed proposalId, address indexed proposer, address[] targets, uint256[] values, string[] signatures, bytes[] calldatas, uint256 startBlock, uint256 endBlock, string description, uint8 proposalType)",
  "OptimismGovernorV6:ProposalCreated(uint256 proposalId, address proposer, address[] targets, uint256[] values, string[] signatures, bytes[] calldatas, uint256 startBlock, uint256 endBlock, string description)",
  "OptimismGovernorV6:ProposalCreated(uint256 proposalId, address proposer, address votingModule, bytes proposalData, uint256 startBlock, uint256 endBlock, string description)",
] as const satisfies Array<EventNames>;

for (const eventName of proposalCreatedEvents) {
  ponder.on(eventName, async ({ event, context }) => {
    logger.trace("Event: ProposalId", event.args.proposalId);
    const { Proposal } = context.db;
    await Proposal.create({
      id: event.args.proposalId,
      data: {
        proposer: event.args.proposer,
        description: event.args.description,
        for: BigInt(0),
        against: BigInt(0),
        abstain: BigInt(0),
      },
    });
  });
}

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

    await Vote.upsert({
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
    });

    await Proposal.update({
      id: event.args.proposalId,
      data: ({ current }) => {
        return {
          // 0
          against:
            current.against +
            (event.args.support === 0 ? BigInt(1) : BigInt(0)),
          // 1
          for: current.for + (event.args.support === 1 ? BigInt(1) : BigInt(0)),
          // 2
          abstain:
            current.abstain +
            (event.args.support === 2 ? BigInt(1) : BigInt(0)),
        };
      },
    });
  });
}
