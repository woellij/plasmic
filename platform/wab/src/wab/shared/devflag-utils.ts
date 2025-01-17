import { DevFlagsType } from "@/wab/shared/devflags";

export function isCoreTeamEmail(
  email: string | undefined | null,
  devflags: DevFlagsType
): boolean {
  return !!email && email.endsWith("@" + devflags.coreTeamDomain);
}

export function isGoogleAuthRequiredEmailDomain(
  email: string,
  devflags: DevFlagsType
): boolean {
  return !!devflags.googleAuthRequiredEmailDomains.find((dom) =>
    email.endsWith("@" + dom)
  );
}
