import { useState, useEffect } from "react";
import { signIn, getSession } from "next-auth/react";
import { GetServerSidePropsContext } from "next";
import { getServerAuthSession } from "@/lib/auth";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import {
  Input,
  Button,
  MessageBar,
  Spinner,
  Body1,
  Title2,
  Field,
  makeStyles,
  Divider,
} from "@fluentui/react-components";

const useStyles = makeStyles({
  input: {
    "::after": {
      content: "",
      width: "100%",
      justifySelf: "center",
      borderBottomColor: "#161616 !important",
    },
  },
  container1: {
    paddingTop: "20vh",
    transition: "opacity 1.5s ease-in-out, transform 0.5s ease-in-out",
  },
  formPhase: {
    paddingTop: "10vh",
    transition: "all 2s ease-out",
    [`@media (max-width: 600px)`]: {
      paddingTop: "5vh",
    },
  },
});

export default function LoginPage() {
  const [accessCode, setAccessCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [animationPhase, setAnimationPhase] = useState<
    "loading" | "logo" | "form"
  >("loading");
  const router = useRouter();

  // Handle entrance animation sequence - 2 distinct stages
  useEffect(() => {
    // Stage 1: Loading, wait 100ms and set to logo phase
    const stage1Timer = setTimeout(() => {
      setAnimationPhase("logo"); // Stage 2: Logo entrance
    }, 100); // Small delay to ensure DOM is ready and create blank stage

    // Stage 2: Form entrance (logo stays visible)
    const stage3Timer = setTimeout(() => {
      setAnimationPhase("form"); // Form entrance - logo remains visible
    }, 3000); // Form starts after 2.5 seconds

    return () => {
      clearTimeout(stage1Timer);
      clearTimeout(stage3Timer);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        accessCode,
        redirect: false,
        callbackUrl: "/", // Always redirect to home after login
      });

      if (result?.error) {
        setError("Invalid access code. Please try again.");
        setLoading(false);
      } else if (result?.ok) {
        // Wait a moment for session to be established
        setTimeout(() => {
          router.push("/");
        }, 100);
      }
    } catch (error) {
      console.error("SignIn error:", error);
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  const styles = useStyles();

  return (
    <>
      <Head>
        <title>Nathy & Jorge's Wedding</title>
        <meta
          name="description"
          content="Welcome to our wedding portal! Please enter your access code to unlock all the details."
        />
        
      </Head>

      <div
        className="background-animated"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "var(--fluent-grey-10)",
          position: "relative",
          transition: "background-color 1.5s ease-in-out",
          minHeight: "98vh",
          // maxHeight: '98vh',
          marginBottom: animationPhase === "loading" ? "50vh" : "0", // No margin bottom needed
        }}
      >
        {/* Stage 1: Logo Phase - Logo entrance animation (starts centered, moves up) */}
        <div
          className={
            animationPhase === "form"
              ? `${styles.container1} ${styles.formPhase}`
              : styles.container1
          }
          //className="phase-container"
          style={{
            opacity:
              animationPhase === "logo" || animationPhase === "form" ? 1 : 0,
            visibility:
              animationPhase === "logo" || animationPhase === "form"
                ? "visible"
                : "hidden",
            zIndex:
              animationPhase === "logo" || animationPhase === "form" ? 2 : 1,
            transitionDelay: animationPhase === "logo" ? "0.5s" : "0s",
            alignItems: "flex-start",
          }}
        >
          <div
            className={animationPhase === "logo" ? "logo-entrance" : ""}
            style={{
              textAlign: "center",
              willChange: "transform, opacity, filter",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Image
              src="/logos/nj-logo-black.svg"
              alt="Wedding Logo"
              width={240}
              height={96}
              style={{
                width: "clamp(100px, 40vw, 200px)",
                height: "auto",
                maxWidth: "100%",
                filter:
                  "brightness(0) saturate(100%) invert(22%) sepia(19%) saturate(0%) hue-rotate(140deg) brightness(104%) contrast(100%)",
                paddingBottom: "2vh",
              }}
              priority
            />
            <Title2
              style={{
                color: "#1a1a1a",
                fontSize: "clamp(1.75rem, 4vw, 2.25rem)",
                fontWeight: "300",
                letterSpacing: "-0.02em",
                textAlign: "center",
                padding: "0 1em",
                paddingTop: "0.2em",
              }}
            >
              <span
                style={{
                  color: "#3D3D3D",
                  //fontFamily: 'Playfair Display SC',
                  fontSize: "1em",
                  lineHeight: "1",
                }}
              >
                Welcome to Nathalia & Jorge's wedding!
              </span>
            </Title2>
          </div>
          <Divider
            style={{
              padding: "2em 2em 2em 2em",
              fontFamily: "Segoe UI Light",
              color: "#6b7280",
              opacity: animationPhase === "form" ? 1 : 0,
              visibility: animationPhase === "form" ? "visible" : "hidden",
              transform:
                animationPhase === "form"
                  ? "translateY(0) scale(1)"
                  : "translateY(2em) scale(0.95)",
              zIndex: animationPhase === "form" ? 5 : 1,
              transition: "all 1.8s cubic-bezier(0.4, 0, 0.2, 1)",
              transitionDelay: animationPhase === "form" ? "0.5s" : "0s",
            }}
            appearance="strong"
          >
            02 . 28 . 26
          </Divider>
        </div>

        {/* Stage 2: Form Phase - Login form entrance (appears from bottom) */}
        <div
          className="phase-container"
          style={{
            opacity: animationPhase === "form" ? 1 : 0,
            visibility: animationPhase === "form" ? "visible" : "hidden",
            transform:
              animationPhase === "form"
                ? "translateY(0) scale(1)"
                : "translateY(2em) scale(0.95)",
            zIndex: animationPhase === "form" ? 5 : 1,
            transition: "all 1.8s cubic-bezier(0.4, 0, 0.2, 1)",
            transitionDelay: animationPhase === "form" ? "0.5s" : "0s",
            // Position form in lower area
            alignItems: "center",
            maxWidth: " 90vw",
            margin: "0 10vw",
          }}
        >
          {/* <Body1 style={{ 
                color: '#6b7280',
                fontSize: 'clamp(1rem, 3vw, 1.5rem)',
                fontWeight: '400',
                lineHeight: '1.5',
                textAlign: 'left',
                //fontFamily: 'Segoe UI Light'
              }}>
                We're so happy you're here! To keep things personal and secure, each guest has their own special access code.
Please enter yours below to unlock all the wedding details - and a heartfelt message made just for you.🖤
              </Body1> */}
          <Body1
            style={{
              color: "#6b7280",
              fontWeight: "400",
              lineHeight: "1.5",
              textAlign: "center",
              //fontFamily: 'Segoe UI Light'
              //margin: '0 1em',
            }}
          >
            We're so happy you're here! Please enter your code below to unlock
            all the wedding details - and a heartfelt message made just for you.
          </Body1>
        </div>
        <div
          className="phase-container"
          style={{
            
            opacity: animationPhase === "form" ? 1 : 0,
            visibility: animationPhase === "form" ? "visible" : "hidden",
            transform:
              animationPhase === "form"
                ? "translateY(0) scale(1)"
                : "translateY(2em) scale(0.95)",
            zIndex: animationPhase === "form" ? 5 : 1,
            transition: "all 1.8s cubic-bezier(0.4, 0, 0.2, 1)",
            transitionDelay: animationPhase === "form" ? "0.5s" : "0s",
          }}
        >
          <Body1
            style={{
              color: "#6b7280",
              fontWeight: "400",
              lineHeight: "1.5",
              textAlign: "center",
              fontSize: "clamp(2rem, 3vw, 4rem)",
            }}
          >
            🖤
          </Body1>
        </div>
            
        <div
          className="phase-container"
          style={{
            opacity: animationPhase === "form" ? 1 : 0,
            visibility: animationPhase === "form" ? "visible" : "hidden",
            transform:
              animationPhase === "form"
                ? "translateY(0) scale(1)"
                : "translateY(2em) scale(0.95)",
            zIndex: animationPhase === "form" ? 5 : 1,
            transition: "all 2s cubic-bezier(0.4, 0, 0.2, 1)",
            transitionDelay: animationPhase === "form" ? "0.5s" : "0s",
            // Position form in lower area
            alignItems: "flex-end",
            paddingBottom: "2vh",
            paddingTop: "1em",
            maxWidth: " 90vw",
          }}
        >
          <form
            onSubmit={handleSubmit}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Field required style={{ width: "100%" }}>
              <Input
                id="accessCode"
                name="accessCode"
                className={styles.input}
                type="text"
                required
                placeholder="Enter your access code"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                disabled={loading}
                size="large"
                appearance="outline"
                style={{
                  width: "100%",
                  fontSize: "clamp(0.875rem, 3vw, 1rem)",
                  borderRadius: "4px",
                  border: "2px solid #e5e7eb",
                  backgroundColor: "#fafafa",
                  transition: "all 0.2s ease",
                }}
                aria-describedby={error ? "error-message" : undefined}
              />
            </Field>

            {error && (
              <div>
                <MessageBar
                  intent="error"
                  style={{ marginTop: "8px", padding: "0 1em" }}
                  id="error-message"
                  role="alert"
                  aria-live="polite"
                >
                  {error}
                </MessageBar>
              </div>
            )}
            <Button
              type="submit"
              disabled={loading || !accessCode.trim()}
              appearance="primary"
              size="large"
              style={{
                marginTop: "8px",
                width: "-webkit-fill-available",
                //fontSize: 'clamp(0.875rem, 3vw, 1rem)',
                fontWeight: "500",
                borderRadius: "4px",
                backgroundColor:
                  loading || !accessCode.trim() ? "#d1d5db" : "#4C4C4C",
                border: "2px solid",
                borderColor:
                  loading || !accessCode.trim() ? "#6F6F6F" : "#323232",
                color: "white",
                transition: "all 0.2s ease",
                cursor:
                  loading || !accessCode.trim() ? "not-allowed" : "pointer",
                boxShadow: "0 4px 12px rgba(58, 133, 255, 0.3)",
              }}
              aria-describedby="submit-button-description"
            >
              {loading ? (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    justifyContent: "center",
                  }}
                >
                  <Spinner size="tiny" aria-label="Verifying access code" />
                  <span style={{ fontSize: "16px", fontWeight: "500" }}>
                    Verifying...
                  </span>
                </div>
              ) : (
                <span style={{ fontSize: "16px", fontWeight: "500" }}>
                  Join the celebration
                </span>
              )}
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}

// Server-side authentication check
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerAuthSession(context);

  // If user is already authenticated, redirect to home
  if (session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  // If user is not authenticated, do NOT set a callbackUrl
  return {
    props: {},
  };
}
