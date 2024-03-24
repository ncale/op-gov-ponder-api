import { ponder } from "@/generated";

// Create a delegate on DelegateVotesChanged, if one doesn't exist
ponder.on("GovernanceToken:DelegateVotesChanged", async ({ event, context }) => {
	console.log("event: DelegateVotesChanged", event.args.delegate, "\nnew balance:", event.args.newBalance)
	const { Delegate } = context.db
	await Delegate.upsert({
		id: event.args.delegate,
		create: {
			address: event.args.delegate,
			votingPower: event.args.newBalance,
		},
		update: {
			votingPower: event.args.newBalance,
		},
	})
})

// Create a vote on VoteCast or VoteCastWithParams
ponder.on("OptimismGovernorV6:VoteCast", async ({ event, context }) => {
	console.log("event: VoteCast", event.args.voter, event.args.proposalId)
	const { Vote } = context.db
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
	})
});
ponder.on("OptimismGovernorV6:VoteCastWithParams", async ({ event, context }) => {
	console.log("event: VoteCast", event.args.voter, event.args.proposalId)
	const { Vote } = context.db
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
	})
});