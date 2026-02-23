export default function Footer() {
  return (
    <footer
      style={{
        background: "linear-gradient(135deg, #141414, #1f1f1f)",
        padding: "40px 20px",
        textAlign: "center",
        position: "relative",
      }}
    >
      <div
        style={{
          fontSize: "15px",
          letterSpacing: "1px",
          fontWeight: "500",
          background: "linear-gradient(45deg, #ff4b2b, #ff416c)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          transition: "all 0.3s ease",
          cursor: "default",
        }}
      >
        © 2025 Nexora Streaming Inc. All rights reserved.
      </div>
    </footer>
  );
}