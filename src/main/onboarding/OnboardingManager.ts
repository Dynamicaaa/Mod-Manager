import {existsSync} from "fs";
import {join as joinPath} from "path";
import Config from "../utils/Config";
import IntegrityCheck from "./IntegrityCheck";

export default class OnboardingManager {

    /**
     * Checks if onboarding is required (returns true if onboarding is needed, false if not)
     */
    public static isOnboardingRequired(): boolean {
        try {
            const path: string = joinPath(Config.readConfigValue("installFolder"), "ddlc.zip");
            console.log("OnboardingManager: Checking for DDLC at path:", path);

            const exists = existsSync(path);
            console.log("OnboardingManager: DDLC file exists:", exists);

            if (!exists) {
                console.log("OnboardingManager: Onboarding required - DDLC file does not exist");
                return true;
            }

            // File exists, but we should also check integrity in the background
            // For now, we'll assume it's valid if it exists
            console.log("OnboardingManager: DDLC file exists, onboarding not required");
            return false;
        } catch (error) {
            console.error("OnboardingManager: Error checking onboarding requirements:", error);
            return true; // If we can't check, assume onboarding is needed
        }
    }

    /**
     * Legacy method for compatibility - returns a promise that resolves if no onboarding needed
     */
    public static requiresOnboarding(): Promise<null> {
        return new Promise((ff, rj) => {
            if (this.isOnboardingRequired()) {
                rj("Onboarding is required");
            } else {
                ff(undefined);
            }
        });
    }

    /**
     * Validates the integrity of an existing DDLC file
     */
    public static async validateGameIntegrity(): Promise<boolean> {
        try {
            const path: string = joinPath(Config.readConfigValue("installFolder"), "ddlc.zip");
            if (!existsSync(path)) {
                return false;
            }

            await IntegrityCheck.checkGameIntegrity(path);
            return true;
        } catch (error) {
            console.warn("OnboardingManager: Game integrity check failed:", error);
            return false;
        }
    }
}