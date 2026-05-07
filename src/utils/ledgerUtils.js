export function truncateHash(hash, start = 8, end = 8) {
  if (!hash || typeof hash !== "string") return "—";
  if (hash.length <= start + end + 3) return hash;
  return `${hash.slice(0, start)}...${hash.slice(-end)}`;
}

export function normalizeVerificationDepth(depth) {
  if (!depth) return "PRESENCE_ONLY";
  return depth.toUpperCase().replace(/-/g, "_");
}

export function computeProofStatus(checkpoint) {
  if (!checkpoint) return "LEDGER_ONLY";
  if (checkpoint.anchor_id) return "ANCHORED";
  return "CHECKPOINTED";
}

export function proofStatusColor(status) {
  if (status === "ANCHORED") return "#00ff88";
  if (status === "CHECKPOINTED") return "#00d4ff";
  return "#f59e0b";
}

export function verificationDepthColor(depth) {
  const d = normalizeVerificationDepth(depth);
  if (d === "ANCHOR_VERIFIED") return "#00ff88";
  if (d === "CHAIN_VERIFIED" || d === "SIGNATURE_VERIFIED") return "#00d4ff";
  return "#f59e0b";
}
