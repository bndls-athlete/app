import { AthleteRegistrationType } from "@/types/athleteRegisterationTypes";
import { AthleteTierManager } from "@/helpers/stripeAthleteManager";
import { TeamTierManager } from "@/helpers/stripeTeamManager";

export function getTierManager(
  registrationType: AthleteRegistrationType | undefined
): AthleteTierManager | TeamTierManager {
  if (registrationType === AthleteRegistrationType.Team) {
    return TeamTierManager.getInstance();
  } else {
    // If registrationType is undefined or any other value, default to AthleteTierManager
    return AthleteTierManager.getInstance();
  }
}
