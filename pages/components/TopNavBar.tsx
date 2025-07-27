import {
  Body1,
  Button,
  Card,
  Hamburger,
  makeStyles,
  Title2,
  Tooltip,
} from "@fluentui/react-components";
import { Dismiss24Regular, SignOutRegular } from "@fluentui/react-icons";
import React, { useState } from "react";
import Image from "next/image";
import { signOut } from "next-auth/react";

const useStyles = makeStyles({
  closeButton: {
    border: "none",
    color: "var(--colorNeutralForeground2)",
    backgroundColor: "var(--colorTransparentBackground)",
  },
  closeIcon: {
    lineHeight: "30px",
    width: "30px",
    height: "30px",
    color: "#3D3D3D",
  },
});

const TopNavBar = () => {
  const [open, setOpen] = useState(false);
  const styles = useStyles();
  return (
    <>
      {/* Top Navigation Bar */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          backgroundColor: "#ffffffff",
          //boxShadow: "0 1px 2px rgba(0,0,0,0.1)",padding: "0.5rem 1rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Image
          src="/logos/nj-logo-black-bold.svg"
          alt="Wedding Logo"
          width={32}
          height={30}
          style={{
            padding: "5px",
            paddingBottom: "5px",
            filter:
                  "brightness(0) saturate(100%) invert(22%) sepia(19%) saturate(0%) hue-rotate(140deg) brightness(104%) contrast(100%)",          }}
          priority
        />
        {!open ? (
          <Hamburger
            style={{ color: "#3D3D3D" }}
            onClick={() => setOpen(!open)}
          />
        ) : (
          <button className={styles.closeButton} onClick={() => setOpen(!open)}>
            <Dismiss24Regular className={styles.closeIcon} />
          </button>
        )}
      </div>
      {/* Navigation Vertical Drawer */}
      <div
        style={{
          position: "fixed",
          top: open ? "40px" : "-200px",
          left: 0,
          right: 0,
          backgroundColor: "#f9f9f9",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          transition: "top 0.3s ease",
          zIndex: 999,
        }}
      >
        <ul style={{ listStyle: "none", margin: 0, padding: "1rem" }}>
          <li>
            <a href="/">Home</a>
          </li>
          <li>
            <a href="/about">About</a>
          </li>
          <li>
            <Button
              appearance="secondary"
              onClick={() => signOut({ callbackUrl: "/login" })}
              icon={<SignOutRegular />}
            >
              Sign Out
            </Button>
          </li>
        </ul>
      </div>      
    </>
  );
};

export default TopNavBar;