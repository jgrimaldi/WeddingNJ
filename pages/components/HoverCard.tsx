import {
  Body1,
  Card,
  Divider,
  makeStyles,
  Title2,
} from "@fluentui/react-components";
import { HomeMoreRegular } from "@fluentui/react-icons";

type HoverCardProps = {
  title: string;
  dividerIcon?: React.ReactNode;
  body: string;
};

const useStyles = makeStyles({
  card: {
    backgroundColor: "white",
    borderRadius: "12px",
    boxShadow: "var(--fluent-shadow-8)",
    height: "10em",
    width: "clamp(100px, 80vh, 250px)",
    gap: 0,
    "&:hover": {
      backgroundColor: "#D6D6D6",
      transition: "background-color 0.5s ease",
      border: "2px solid #3D3D3D",
    },
    "&:hover $divider::after": {
      borderTopStyle: "solid",
      borderTopColor: "#3D3D3D !important",
    },
  },
  divider: {
    "&:hover::after": {
      borderTopStyle: "solid",
      borderTopColor: "#3D3D3D !important",
    },
  },
});

const HoverCard = ({
  title,
  dividerIcon = <HomeMoreRegular />,
  body,
}: HoverCardProps) => {
  const styles = useStyles();

  return (
    <>
      <Card className={styles.card}>
        <div
          className="innerContainer1"
          style={{
            alignContent: "center",
            alignSelf: "center",
            marginBottom: "0.5em",
            width: "100%",
            textAlign: "center",
            gap: 0,
          }}
        >
          <Title2
            style={{
              color: "#3D3D3D",
              textAlign: "center",
            }}
          >
            {title}
          </Title2>
          <Divider
            className="divider"
            style={{
              fontFamily: "Segoe UI Light",
              color: "#6b7280",
              marginTop: "0.5em",
            }}
            appearance="strong"
          >
            {dividerIcon}
          </Divider>
        </div>

        <div
          style={{
            alignContent: "center",
            alignSelf: "center",
            width: "100%",
            textAlign: "center",
          }}
        >
          <Body1
            style={{
              color: "var(--fluent-grey-130)",
            }}
          >
            {body}
          </Body1>
        </div>
      </Card>
    </>
  );
};

export default HoverCard;