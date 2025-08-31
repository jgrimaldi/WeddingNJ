import { Body1, Caption1, Link, makeStyles, mergeClasses } from "@fluentui/react-components";
import { Call16Regular } from "@fluentui/react-icons";
import type { Language } from "@/types/invitations";

const useStyles = makeStyles({
  footer: {
    maxWidth: "100vw",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#3D3D3D", // slate-900
    color: "#F9FAFB", // near-white text
    padding: "2.5em 1.5em",
    gap: "1em",
  },
  container: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: "1.25em",
  },
  sectionTitle: {
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    opacity: 0.9,
  },
  row: {
    display: "flex",
    flexDirection: "column",
    gap: "0.4em",
    padding: "0 1em",
  },
  link: {
    color: "#E5E7EB",
    textDecoration: "underline",
    textUnderlineOffset: "2px",
  },
  justified: {
    textAlign: "justify",
  },
  thanksText: {
    fontSize: "0.5em",
  },
  icon: {
    marginRight: "0.4em",
    verticalAlign: "text-bottom",
  },
  contactList: {
    marginTop: "0.5em",
    paddingLeft: "1.2em",
  },
  listItem: {
    marginBottom: "0.25em",
  },
});

type FooterProps = {
  language?: Language; // 'EN' | 'ES'
  groomWa?: string | null;
  brideWa?: string | null;
};

export default function Footer({ language = "EN", groomWa: groomWaProp, brideWa: brideWaProp }: FooterProps) {
  const styles = useStyles();

  const isES = language === "ES";
  // Prefer values passed via props (SSR/runtime env), fallback to build-time env if not provided
  const groomWa = groomWaProp ?? process.env.WHATSAPP_GROOM ?? process.env.NEXT_PUBLIC_WHATSAPP_GROOM ?? null;
  const brideWa = brideWaProp ?? process.env.WHATSAPP_BRIDE ?? process.env.NEXT_PUBLIC_WHATSAPP_BRIDE ?? null;
  const labels = {
    questionsTitle: isES ? "Preguntas" : "Questions",
    contactLine: isES
      ? "Para cualquier consulta, por favor contacta a la familia del novio o de la novia:"
      : "For any questions, please reach out to the groom or bride's family:",
    thanksTitle: isES ? "Agradecimientos" : "Special thanks",
    thanksText: isES
      ? "Nuestro agradecimiento especial a Raul y Yunita por su ayuda en la pagina, quienes indicaron se iba a enojar si no poniamos este mensaje."
      : "Special thanks to Raul and Yunita for their help with the website, who mentioned they would be upset if we didn't include this message.",
    groom: isES ? "Novio" : "Groom",
    bride: isES ? "Novia" : "Bride",
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.row}>
          <Caption1 className={styles.sectionTitle}>
            {labels.questionsTitle}
          </Caption1>
          <Body1 className={styles.justified}>{labels.contactLine}</Body1>
          {(groomWa || brideWa) && (
            <ul className={styles.contactList}>
              {groomWa && (
                <li className={styles.listItem}>
                  <Link
                    className={styles.link}
                    href={`https://wa.me/${groomWa}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Call16Regular className={styles.icon} />
                    {labels.groom}: +{groomWa}
                  </Link>
                </li>
              )}
              {brideWa && (
                <li className={styles.listItem}>
                  <Link
                    className={styles.link}
                    href={`https://wa.me/${brideWa}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Call16Regular className={styles.icon} />
                    {labels.bride}: +{brideWa}
                  </Link>
                </li>
              )}
            </ul>
          )}
        </div>
        <div className={styles.row}>
          <Caption1 className={styles.sectionTitle}>
            {labels.thanksTitle}
          </Caption1>
          <Body1 className={mergeClasses(styles.justified, styles.thanksText)}>
            {labels.thanksText}
          </Body1>
        </div>
      </div>
    </footer>
  );
}
