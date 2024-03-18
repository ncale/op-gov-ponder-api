import { ponder } from "@/generated";

ponder.on("OptimismGovernorV6:AdminChanged", async ({ event, context }) => {
  console.log(event.args);
});

ponder.on("OptimismGovernorV6:BeaconUpgraded", async ({ event, context }) => {
  console.log(event.args);
});

ponder.on("OptimismGovernorV6:Upgraded", async ({ event, context }) => {
  console.log(event.args);
});

ponder.on("OptimismGovernorV6:Initialized", async ({ event, context }) => {
  console.log(event.args);
});
