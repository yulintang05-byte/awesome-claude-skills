import { Composition } from "remotion";
import { CoatOfArms } from "./CoatOfArms";
import { LionCross } from "./LionCross";
import { HeraldDuo } from "./HeraldDuo";

export const RemotionRoot = () => (
  <>
    <Composition
      id="CoatOfArms"
      component={CoatOfArms}
      durationInFrames={180}
      fps={30}
      width={600}
      height={720}
    />
    <Composition
      id="LionCross"
      component={LionCross}
      durationInFrames={180}
      fps={30}
      width={600}
      height={600}
    />
    <Composition
      id="HeraldDuo"
      component={HeraldDuo}
      durationInFrames={300}
      fps={30}
      width={1280}
      height={720}
    />
  </>
);
