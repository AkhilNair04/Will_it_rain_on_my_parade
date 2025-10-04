import React from "react";

const cardData = [
  {
    city: "San Francisco",
    temperature: "22°C",
    rainfall: "0.2mm",
    wind: "15 km/h",
    comfort: "8/10",
    images: [
      "/images/thermometer.png",
      "/images/rainfall.png",
      "/images/wind.png",
      "/images/sun.png",
    ],
  },
  {
    city: "New York",
    temperature: "28°C",
    rainfall: "0.5mm",
    wind: "20 km/h",
    comfort: "7/10",
    images: [
      "/images/thermometer2.png",
      "/images/rainfall2.png",
      "/images/wind2.png",
      "/images/sun2.png",
    ],
  },
];

const pageStyle: React.CSSProperties = {
  background: "#101828",
  minHeight: "100vh",
  color: "#fff",
  fontFamily: "Inter, sans-serif",
  padding: "32px",
};

const headerStyle: React.CSSProperties = {
  fontSize: "2.5rem",
  fontWeight: 700,
  marginBottom: "32px",
};

const searchRowStyle: React.CSSProperties = {
  display: "flex",
  gap: "24px",
  marginBottom: "32px",
};

const searchBoxStyle: React.CSSProperties = {
  background: "#1A2442",
  border: "none",
  borderRadius: "12px",
  padding: "16px",
  color: "#fff",
  fontSize: "1rem",
  width: "100%",
  maxWidth: "400px",
};

const cardsRowStyle: React.CSSProperties = {
  display: "flex",
  gap: "32px",
  justifyContent: "flex-start",
};

const cardStyle: React.CSSProperties = {
  background: "#1A2442",
  borderRadius: "24px",
  padding: "24px",
  minWidth: "340px",
  display: "flex",
  flexDirection: "column",
  gap: "16px",
};

const cityStyle: React.CSSProperties = {
  fontSize: "1.5rem",
  fontWeight: 700,
  marginBottom: "12px",
};

const metricsRowStyle: React.CSSProperties = {
  display: "flex",
  gap: "16px",
  flexWrap: "wrap",
};

const metricStyle: React.CSSProperties = {
  background: "#101828",
  borderRadius: "16px",
  padding: "16px",
  minWidth: "140px",
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: "8px",
};

const metricTitleStyle: React.CSSProperties = {
  fontWeight: 600,
  fontSize: "1rem",
};

const metricValueStyle: React.CSSProperties = {
  fontSize: "1.1rem",
  marginBottom: "4px",
};

const metricImgStyle: React.CSSProperties = {
  width: "48px",
  height: "48px",
  borderRadius: "12px",
  objectFit: "cover",
};

export default function CompareLocations() {
  return (
    <div style={pageStyle}>
      <div style={headerStyle}>Compare Locations</div>
      <div style={searchRowStyle}>
        <input
          style={searchBoxStyle}
          type="text"
          value="San Francisco, CA"
          readOnly
        />
        <input
          style={searchBoxStyle}
          type="text"
          value="New York, NY"
          readOnly
        />
      </div>
      <div style={cardsRowStyle}>
        {cardData.map((city) => (
          <div key={city.city} style={cardStyle}>
            <div style={cityStyle}>{city.city}</div>
            <div style={metricsRowStyle}>
              <div style={metricStyle}>
                <span style={metricTitleStyle}>Temperature</span>
                <img src={city.images[0]} alt="Temperature" style={metricImgStyle} />
                <span style={metricValueStyle}>{city.temperature}</span>
              </div>
              <div style={metricStyle}>
                <span style={metricTitleStyle}>Rainfall</span>
                <img src={city.images[1]} alt="Rainfall" style={metricImgStyle} />
                <span style={metricValueStyle}>{city.rainfall}</span>
              </div>
              <div style={metricStyle}>
                <span style={metricTitleStyle}>Wind</span>
                <img src={city.images[2]} alt="Wind" style={metricImgStyle} />
                <span style={metricValueStyle}>{city.wind}</span>
              </div>
              <div style={metricStyle}>
                <span style={metricTitleStyle}>Comfort Score</span>
                <img src={city.images[3]} alt="Comfort" style={metricImgStyle} />
                <span style={metricValueStyle}>{city.comfort}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}