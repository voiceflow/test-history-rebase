import * as Platform from '@voiceflow/platform-config';

/**
 * Some platforms don't allow slot values to be embedded within slot reprompts. Consequently, even if
 * my voice app is specifically designed to guarantee that slot value was captured, the platform won't
 * embed the value in a slot reprompt.
 *
 * For example, if I have required slots {fish} and {size} and I say "I would like a large", then {size}
 * is assigned the value "large", but I can't use slot reprompt "You have selected {size}, but the fish is
 * missing, what kind of fish?" to ask the user for the missing {fish} value. Platforms like Google will not
 * replace {size} with "large" (desired) and instead output garbage like {{[slot].d8723rns}} (undesired)
 *
 * @param platform The platform of the current project
 */
export const isSlotsInRepromptValid = (platform: Platform.Constants.PlatformType) => platform !== Platform.Constants.PlatformType.GOOGLE;
