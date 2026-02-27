"use client";

import React from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaGlobe,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer
      style={{
        background: "linear-gradient(135deg, #141414, #1f1f1f)",
        padding: "50px 20px",
        textAlign: "center",
      }}
    >
      {/* Copyright */}
      <div
        style={{
          fontSize: "15px",
          letterSpacing: "1px",
          fontWeight: "500",
          background: "linear-gradient(45deg, #ff4b2b, #ff416c)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          marginBottom: "20px",
        }}
      >
        © 2025 Nexora Streaming Inc. All rights reserved.
      </div>

      {/* Developer Name */}
      <div style={{ color: "#ccc", marginBottom: "25px", fontSize: "15px" }}>
        Developed by{" "}
        <span style={{ color: "#ff416c", fontWeight: "600" }}>
          Suraj Acharya
        </span>
      </div>

      {/* Social Icons */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "20px",
          flexWrap: "wrap",
        }}
      >
        <SocialLink href="https://www.facebook.com/auraj.acharya">
          <FaFacebookF />
        </SocialLink>

        <SocialLink href="https://www.instagram.com/suraj_acharyaa10/">
          <FaInstagram />
        </SocialLink>

        <SocialLink href="https://www.linkedin.com/in/surajacharyaa/">
          <FaLinkedinIn />
        </SocialLink>

        <SocialLink href="https://x.com/SURAJAC22891334">
          <FaXTwitter />
        </SocialLink>

        <SocialLink href="https://surajacharya10.com.np/">
          <FaGlobe />
        </SocialLink>
      </div>
    </footer>
  );
}

const SocialLink = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    style={{
      width: "45px",
      height: "45px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "50%",
      background: "#222",
      color: "#fff",
      fontSize: "18px",
      transition: "all 0.3s ease",
      textDecoration: "none",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.background =
        "linear-gradient(45deg, #ff4b2b, #ff416c)";
      e.currentTarget.style.transform = "translateY(-5px)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.background = "#222";
      e.currentTarget.style.transform = "translateY(0)";
    }}
  >
    {children}
  </a>
);
