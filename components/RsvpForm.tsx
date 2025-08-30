import * as React from "react";
import {
  Button,
  Caption1,
  Card,
  Field,
  Label,
  makeStyles,
  Radio,
  RadioGroup,
  Textarea,
} from "@fluentui/react-components";
import type { User, Language } from "@/types/invitations";

export type Attendance = "yes" | "no" | "maybe";

export interface GuestResponse {
  name: string;
  attending?: Attendance;
  note?: string;
}

type RsvpFormProps = {
  guests: User[];
  onSubmit?: (responses: GuestResponse[]) => void;
  language?: Language; // 'EN' | 'ES'
};

const useStyles = makeStyles({
  container: {
    display: "flex",
    flexDirection: "column",
    gap: "1.25em",
    margin: "2em 0",
  },
  header: {
    display: "none",
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: "1em",
  },
  card: {
    borderRadius: "10px",
    padding: "1em",
    background: "#F8FAFC",
    border: "1px solid #E5E7EB",
  },
  row: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: "0.75em 1.5em",
  },
  actions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "0.75em",
    marginTop: "0.5em",
  },
});

export default function RsvpForm({
  guests,
  onSubmit,
  language = "EN",
}: RsvpFormProps) {
  const styles = useStyles();

  const isES = language === "ES";
  const labels = {
    attendance: isES ? "Asistencia" : "Attendance",
    yes: isES ? "Sí" : "Yes",
    no: isES ? "No" : "No",
    maybe: isES ? "Tal vez" : "Maybe",
    notes: isES
      ? "Notas (restricciones alimentarias, alergias, etc.)"
      : "Notes (dietary restrictions, allergies, etc.)",
    submit: isES ? "Enviar confirmación" : "Submit RSVP",
    empty: isES ? "No hay invitados para confirmar." : "No guests to RSVP.",
  } as const;

  const [responses, setResponses] = React.useState<
    Record<number, GuestResponse>
  >(() =>
    (guests || []).reduce<Record<number, GuestResponse>>((acc, g, idx) => {
      acc[idx] = { name: g.Name };
      return acc;
    }, {})
  );

  React.useEffect(() => {
    // Reset when guests change
    setResponses(
      (guests || []).reduce<Record<number, GuestResponse>>((acc, g, idx) => {
        acc[idx] = { name: g.Name };
        return acc;
      }, {})
    );
  }, [guests]);

  const updateAttendance = (index: number, attending: Attendance) => {
    setResponses((prev) => ({
      ...prev,
      [index]: { ...prev[index], attending },
    }));
  };

  const updateNote = (index: number, note: string) => {
    setResponses((prev) => ({
      ...prev,
      [index]: { ...prev[index], note },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const list = Object.keys(responses)
      .map((k) => Number(k))
      .sort((a, b) => a - b)
      .map((i) => responses[i]);
    onSubmit?.(list);
  };

  if (!guests || guests.length === 0) {
    return <Caption1>{labels.empty}</Caption1>;
  }

  return (
    <form className={styles.container} onSubmit={handleSubmit}>
      <Card className={styles.list}>
        {guests.map((g, idx) => (
          <section key={`${g.Name}-${idx}`}>
            <div className={styles.row}>
              <Label>{g.Name}</Label>
            </div>

            <Field label={labels.attendance} style={{ marginTop: "0.5em" }}>
              <RadioGroup
                layout="horizontal"
                value={responses[idx]?.attending}
                onChange={(_, data) =>
                  updateAttendance(idx, data.value as Attendance)
                }
              >
                <Radio value="yes" label={labels.yes} />
                <Radio value="no" label={labels.no} />
                <Radio value="maybe" label={labels.maybe} />
              </RadioGroup>
            </Field>

            <Field label={labels.notes} style={{ marginTop: "0.5em" }}>
              <Textarea
                resize="vertical"
                value={responses[idx]?.note ?? ""}
                onChange={(e) =>
                  updateNote(idx, (e.target as HTMLTextAreaElement).value)
                }
              />
            </Field>
          </section>
        ))}
      </Card>

      <div className={styles.actions}>
        <Button appearance="primary" type="submit">
          {labels.submit}
        </Button>
      </div>
    </form>
  );
}
