import { useEffect } from "react";
import ReactGA from "react-ga4";

const Analytics = () => {
  useEffect(() => {
    ReactGA.initialize("G-G59ZFP6DQG");
  }, []);

  return <div>Analytics</div>;
};

export default Analytics;