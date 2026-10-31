import "./styles/About.css";
import { config } from "./config";

const About = () => {
  return (
    <div className="about-section" id="about">
      <div className="about-me">
        <span className="source-label" aria-hidden="true"><span>{'{ }'}</span> about.py</span>
        <h3 className="title">{config.about.title}</h3>
        <p className="para">
          {config.about.description}
        </p>
      </div>
    </div>
  );
};

export default About;
