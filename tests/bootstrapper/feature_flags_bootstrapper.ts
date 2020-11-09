import FeatureFlagReader from "../../lib/FeatureFlagReader.ts";

export default async () => {
    await FeatureFlagReader.readAll();
};
