import { Address } from "viem";
import { logger } from "./logger";

async function resolveEns(address: Address): Promise<EnsDataResponse> {
  const urlBase = "https://ensdata.net";
  const url = `${urlBase}/${address}`;
  return fetch(url).then((res) => res.json() as Promise<EnsDataResponse>);
}
type EnsDataResponse =
  | {
      // only when '404 not found'
      error: boolean;
      status: number;
      message: string;
    }
  | {
      // only when '200 found'
      address: Address;
      ens_primary: string;
      avatar_small?: string; // only when '200 found' and avatar exists
    };

export async function getEnsData(
  address: Address
): Promise<{ primaryName: string | null; avatar: string | null }> {
  try {
    const ensData = await resolveEns(address);
    if ("error" in ensData) {
      logger.warn(
        `Error resolving ENS Name\nstatus: ${ensData.status}\nmessage: ${ensData.message}`
      );
      return { primaryName: null, avatar: null };
    }
    const primaryName = ensData.ens_primary;
    const avatar = ensData.avatar_small;
    return { primaryName, avatar: avatar || null };
  } catch (error) {
    logger.error(`Error resolving ENS Name or Avatar for ${address}: ${error}`);
    return { primaryName: null, avatar: null };
  }
}
