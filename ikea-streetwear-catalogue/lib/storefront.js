export const gratitudeRewardTiers = [
  { quantity: 2, percentage: 10 },
  { quantity: 4, percentage: 20 },
  { quantity: 6, percentage: 30 },
  { quantity: 8, percentage: 40 }
];

export function calculateGratitudeReward(itemCount) {
  let activeTier = null;

  for (const tier of gratitudeRewardTiers) {
    if (itemCount >= tier.quantity) {
      activeTier = tier;
    }
  }

  const nextTier = gratitudeRewardTiers.find((tier) => itemCount < tier.quantity) ?? null;

  return {
    activeTier,
    nextTier,
    unlocked: Boolean(activeTier),
    percentage: activeTier?.percentage ?? 0
  };
}
