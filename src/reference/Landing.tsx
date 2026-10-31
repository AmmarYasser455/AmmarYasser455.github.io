import { type PropsWithChildren, type CSSProperties } from "react";
import "./styles/Landing.css";
import { config } from "./config";

function RollingRole({text,className}:{text:string;className:string}){
 return <div className={className+' rolling-role'} aria-label={text}>{Array.from(text).map((letter,i)=><span className="role-letter" key={i} aria-hidden="true" style={{'--letter-delay':i*.035+'s'} as CSSProperties}><span className="role-letter-track"><span>{letter===' '?' ':letter}</span><span>{letter===' '?' ':letter}</span></span></span>)}</div>;
}
const Landing = ({ children }: PropsWithChildren) => {
  const nameParts = config.developer.fullName.split(" ");
  const firstName = nameParts[0] || config.developer.name;
  const lastName = nameParts.slice(1).join(" ") || "";

  return (
    <>
      <div className="landing-section" id="landingDiv">
        <div className="landing-container">
          <div className="landing-intro">
            <span className="developer-mark" aria-hidden="true">&lt;/&gt;</span>
            <h2>Hello! I'm</h2>
            <h1>
              {firstName.toUpperCase()}
              {' '}
              <br />
              {lastName && <span>{lastName.toUpperCase()}</span>}
            </h1>
            <code className="hero-code" aria-label="Python: import geopandas as gpd"><span>import</span> geopandas <span>as</span> gpd</code>
          </div>
          <div className="landing-info">
            <h3>A</h3>
            <h2 className="landing-info-h2">
              <RollingRole className="landing-h2-1" text="GIS Developer"/>
            </h2>
            <h2>
              <RollingRole className="landing-h2-info" text="Spatial Analyst"/>
            </h2>
          </div>
        </div>
        {children}
      </div>
    </>
  );
};

export default Landing;
