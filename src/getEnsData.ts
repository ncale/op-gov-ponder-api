import { Address } from "viem";

async function resolveEns(address: string): Promise<EnsDataResponse> {
  const urlBase = "https://ensdata.net";
  const url = `${urlBase}/${address}`;
  const res = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  return (await res.json()) as EnsDataResponse;
}
type EnsDataResponse = {
  error?: boolean; // only when '404 not found'
  status?: number; // only when '404 not found'
  message?: string; // only when '404 not found'
  address?: string; // only when '200 found'
  ens_primary?: string; // only when '200 found'
  avatar_small?: string; // only when '200 found' and avatar exists
};

export async function getEnsData(
  address: string
): Promise<{ primaryName: string | null; avatar: string | null }> {
  try {
    const ensData = await resolveEns(address);
    if (ensData.error) {
      console.log(
        `Error resolving ENS Name\nstatus: ${ensData.status}\nmessage: ${ensData.message}`
      );
    }
    const primaryName = ensData.ens_primary ? ensData.ens_primary : null;
    const avatar = ensData.avatar_small ? ensData.avatar_small : null;
    return { primaryName, avatar };
  } catch (error) {
    console.log(`Error resolving ENS Name or Avatar for ${address}: ${error}`);
    return { primaryName: null, avatar: null };
  }
}
