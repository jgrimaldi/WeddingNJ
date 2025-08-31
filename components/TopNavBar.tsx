import { Body1, Button, makeStyles, NavItem, Tab, TabList } from "@fluentui/react-components";
import {
  Dismiss24Regular,
  SignOutRegular,
  NavigationRegular,
  Board20Filled,
  Board20Regular,
  bundleIcon,
  Bed16Regular
} from "@fluentui/react-icons";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { signOut } from "next-auth/react";

const Dashboard = bundleIcon(Board20Filled, Board20Regular);

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
  adminMenuText: {
    padding: "0 1em",
    textAlign: "justify",
    paddingBottom: "1em",
  },
  signOutButton: {
    margin: "0 1em",
    height: "2em",
  },
  menuContentsContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },
  navRow: {
    display: "flex",
    alignItems: "center",
  }
});

type TopNavBarProps = {
  language?: "EN" | "ES";
};

const TopNavBar = ({ language = "EN" }: TopNavBarProps) => {
  const [open, setOpen] = useState(false);
  const styles = useStyles();
  const drawerRef = useRef<HTMLDivElement | null>(null);
  const signOutText = language === "ES" ? "Cerrar sesión" : "Sign Out";
  const langParam = language === "ES" ? "es" : "en";
  const adminMenuText =
    language === "ES"
      ? "No hay más páginas por el momento, en ese menú solo puedes cerrar sesión, a menos que sepas donde esta el boton escondido para administrar la página.."
      : "There are no more pages for the moment, the only option here is for signing out, unless you know the location of the hidden button for admin access..";
  useEffect(() => {
    if (open && drawerRef.current) {
      drawerRef.current.focus();
    }
  }, [open]);

  const handleDrawerBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    const next = e.relatedTarget as Node | null;
    const current = drawerRef.current;
    if (!current) return;
    if (!next || !current.contains(next)) {
      setOpen(false);
    }
  };
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
          maxWidth: "100vw",
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
          top: open ? "3.5em" : "-20em",
          left: 0,
          right: 0,
          backgroundColor: "#f9f9f9",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          transition: "top 0.3s ease",
          zIndex: 999,
        }}
        ref={drawerRef}
        tabIndex={-1}
        onBlur={handleDrawerBlur}
      >
        <div className={styles.menuContentsContainer}>
          <NavItem className={styles.navRow} href="/" icon={<Dashboard />} value="1">
            {language === "ES" ? "Inicio" : "Home"}
          </NavItem>
          <NavItem className={styles.navRow} href={`/hotels?lang=${langParam}`} icon={<Bed16Regular />} value="1">
            {language === "ES" ? "Hoteles" : "Hotels"}
          </NavItem>
        </div>
        <ul
          style={{
            listStyle: "none",
            marginTop: "2em",
            padding: "0 0 0 0.5em",
          }}
        >
          <li>
            <Button
              appearance="primary"
              style={{ margin: "0 1em 0.5em 1em" }}
              onClick={() => {
                window.location.href = "/";
              }}
            >
              {language === "ES" ? "Inicio" : "Home"}
            </Button>
          </li>
          <li>
            <Button
              appearance="primary"
              style={{ margin: "0 1em 0.5em 1em" }}
              onClick={() => {
                const langParam = language === "ES" ? "es" : "en";
                window.location.href = `/hotels?lang=${langParam}`;
              }}
            >
              {language === "ES" ? "Hoteles" : "Hotels"}
            </Button>
          </li>
          <li>
            <div className={styles.adminMenuText}>
              <span>{adminMenuText}</span>
            </div>
          </li>
          <li>
            <Button
              appearance="secondary"
              onClick={() =>
                signOut({
                  callbackUrl: `/login?lang=${language === "ES" ? "es" : "en"}`,
                })
              }
              icon={<SignOutRegular />}
              className={styles.signOutButton}
            >
              {signOutText}
            </Button>
          </li>
        </ul>
      </div>
    </>
  );
};

export default TopNavBar;
