import { Address } from "viem";

export async function getEnsData(client: any, address: string) {
  try {
    const primaryName: string | null = await client.getEnsName(address);
    const avatar: string | null = await client.getEnsAvatar(primaryName);
    return { primaryName, avatar };
  } catch (error) {
    console.log(`Error resolving ENS Name or Avatar for ${address}: ${error}`);
    return { primaryName: null, avatar: null };
  }
}
