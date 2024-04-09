import { Address } from "viem";

async function resolveEns(address: string): Promise<EnsIdeasData> {
  const urlBase = "https://api.ensideas.com/ens/resolve";
  const url = `${urlBase}/${address}`; // address can be in checksum
  const res = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  return (await res.json()) as EnsIdeasData;
}
type EnsIdeasData = {
  address: Address;
  name: string | null;
  displayName: string;
  avatar: string | null;
};

async function verifyAvatarExists(avatarUrl: string): Promise<boolean> {
  const res = await fetch(avatarUrl, { method: "GET" });
  if (res.status === 200) {
    return true;
  }
  return false;
}

export async function getEnsData(
  address: string
): Promise<{ primaryName: string | null; avatar: string | null }> {
  try {
    const ensData = await resolveEns(address);
    if (!ensData.name || !ensData.avatar)
      return { primaryName: null, avatar: null };
    const primaryName: string | null = ensData.name;
    const avatarExists = await verifyAvatarExists(ensData.avatar);
    if (avatarExists) {
      const avatar: string | null = ensData.avatar;
      return { primaryName, avatar };
    } else {
      return { primaryName, avatar: null };
    }
  } catch (error) {
    console.log(`Error resolving ENS Name or Avatar for ${address}: ${error}`);
    return { primaryName: null, avatar: null };
  }
}
