import { Button, makeStyles } from "@fluentui/react-components";
import { Dismiss24Regular, SignOutRegular, NavigationRegular } from "@fluentui/react-icons";
import React, { useState } from "react";
import Image from "next/image";
import { signOut } from "next-auth/react";

const useStyles = makeStyles({
  closeButton: {
    border: "none",
    color: "var(--colorNeutralForeground2)",
    backgroundColor: "var(--colorTransparentBackground)",
    margin: "5px",
    padding: 0,
    height: "40px",
  },
  closeIcon: {
    color: "#ffffff",
    height: "40px",
    width: "42px",
  },
});

const TopNavBar = () => {
  const [open, setOpen] = useState(false);
  const styles = useStyles();
  return (
    <>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          backgroundColor: "#202020",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          maxWidth: "100vw"
        }}
      >
        <Image
          src="/logos/nj-logo-black-bold.svg"
          alt="Wedding Logo"
          width={42}
          height={40}
          style={{
            padding: "5px",
            paddingBottom: "5px",
            filter:
              "invert(100%) sepia(100%) saturate(0%) hue-rotate(98deg) brightness(107%) contrast(101%)",
          }}
          priority
        />
        {!open ? (
          <button className={styles.closeButton} onClick={() => setOpen(!open)}>
            <NavigationRegular className={styles.closeIcon} />
          </button>
        ) : (
          <button className={styles.closeButton} onClick={() => setOpen(!open)}>
            <Dismiss24Regular className={styles.closeIcon} />
          </button>
        )}
      </div>
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
