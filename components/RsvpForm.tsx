import * as React from "react";
import {
  Body1,
  Button,
  Caption1,
  Card,
  Field,
  Label,
  makeStyles,
  Radio,
  RadioGroup,
  Spinner,
  Input,
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
    margin: "2em 2em",
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
  submitButton: {
    marginTop: "0.5em",
    backgroundColor: "#3D3D3D",
    // Keep same color on hover
    "&:hover": {
      backgroundColor: "#3D3D3D",
    },
  },
  label: {
    fontWeight: 500,
    color: "#3D3D3D",
  },
  nameLabel: {
    fontSize: "2em",
    fontFamily: "'Playfair Display', serif",
  },
  hint: {
    color: "#6B7280",
    marginTop: "0.25em",
  },
  successText: {
    color: "#065F46",
    marginTop: "0.75em",
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
    email: isES
      ? "Correo electrónico para confirmación"
      : "Email for confirmation",
    emailPlaceholder: isES ? "tucorreo@ejemplo.com" : "you@example.com",
    emailRequired: isES
      ? "Ingresa un correo válido"
      : "Please enter a valid email",
    yes: isES ? "Sí" : "Yes",
    no: isES ? "No" : "No",
    maybe: isES ? "Tal vez" : "Maybe",
    notes: isES
      ? "Notas (restricciones alimentarias, alergias, etc.)"
      : "Notes (dietary restrictions, allergies, etc.)",
    submit: isES ? "Enviar confirmación" : "Submit RSVP",
    empty: isES ? "No hay invitados para confirmar." : "No guests to RSVP.",
    required: isES ? "Seleccione una opción" : "Please select an option",
    updateNote: isES
      ? "Puedes actualizar tu respuesta en cualquier momento reenviando este formulario."
      : "You can update your response anytime by resubmitting this form.",
    submitting: isES ? "Enviando..." : "Submitting...",
    submittingAria: isES ? "Enviando confirmación" : "Submitting RSVP",
    success: isES
      ? "¡Gracias! Tu confirmación fue enviada. Recibirás un correo de confirmación en breve."
      : "Thanks! Your RSVP was sent. You'll receive a confirmation email shortly.",
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
    setShowErrors(false);
    setSubmitted(false);
  }, [guests]);

  // Track if user attempted to submit to show validation messages
  const [showErrors, setShowErrors] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);
  const radioRefs = React.useRef<(HTMLDivElement | null)[]>([]);
  const emailRef = React.useRef<HTMLDivElement | null>(null);
  const [email, setEmail] = React.useState("");

  const isEmailValid = (value: string) => {
    // Basic email validation
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(value.trim());
  };

  const updateAttendance = (index: number, attending: Attendance) => {
    setSubmitted(false);
    setResponses((prev) => ({
      ...prev,
      [index]: { ...prev[index], attending },
    }));
  };

  const updateNote = (index: number, note: string) => {
    setSubmitted(false);
    setResponses((prev) => ({
      ...prev,
      [index]: { ...prev[index], note },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate email first
    const emailOk = isEmailValid(email);
    // Validate all guests have an attendance selection
    const missingIndexes = (guests || []).reduce<number[]>((acc, _, idx) => {
      if (!responses[idx]?.attending) acc.push(idx);
      return acc;
    }, []);

    if (!emailOk || missingIndexes.length > 0) {
      setShowErrors(true);
      // Scroll to email if invalid, otherwise to first missing group
      if (!emailOk) {
        const eEl = emailRef.current;
        if (eEl && typeof eEl.scrollIntoView === "function") {
          eEl.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      } else if (missingIndexes.length > 0) {
        const first = missingIndexes[0];
        const el = radioRefs.current[first];
        if (el && typeof el.scrollIntoView === "function") {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }
      return;
    }

    const list = Object.keys(responses)
      .map((k) => Number(k))
      .sort((a, b) => a - b)
      .map((i) => responses[i]);
    setLoading(true);
    try {
      onSubmit?.(list);
    } finally {
      // Simulate 4s loading, then show success
      setTimeout(() => {
        setLoading(false);
        setSubmitted(true);
      }, 4000);
    }
  };

  if (!guests || guests.length === 0) {
    return <Caption1>{labels.empty}</Caption1>;
  }

  return (
    <form className={styles.container} onSubmit={handleSubmit}>
      <Card className={styles.list}>
        <Field
          label={<Label className={styles.label}>{labels.email}</Label>}
          required
          validationState={
            showErrors && !isEmailValid(email) ? "error" : undefined
          }
          validationMessage={
            showErrors && !isEmailValid(email)
              ? labels.emailRequired
              : undefined
          }
          style={{ marginBottom: "0.5em" }}
        >
          <div ref={emailRef}>
            <Input
              type="email"
              value={email}
              placeholder={labels.emailPlaceholder}
              onChange={(_, data) => setEmail(data.value)}
            />
          </div>
        </Field>
        {guests.map((g, idx) => (
          <section key={`${g.Name}-${idx}`}>
            <div className={styles.row}>
              <span className={`${styles.label} ${styles.nameLabel}`}>
                {g.Name}
              </span>
            </div>

            <Field
              label={
                <Label className={styles.label}>{labels.attendance}</Label>
              }
              style={{ marginTop: "0.5em" }}
              required
              validationState={
                showErrors && !responses[idx]?.attending ? "error" : undefined
              }
              validationMessage={
                showErrors && !responses[idx]?.attending
                  ? labels.required
                  : undefined
              }
            >
              <RadioGroup
                layout="horizontal"
                value={responses[idx]?.attending}
                ref={(el) => {
                  radioRefs.current[idx] = el;
                }}
                onChange={(_, data) =>
                  updateAttendance(idx, data.value as Attendance)
                }
              >
                <Radio value="yes" label={labels.yes} />
                <Radio value="no" label={labels.no} />
              </RadioGroup>
            </Field>

            <Field
              label={<Label className={styles.label}>{labels.notes}</Label>}
              style={{ marginTop: "0.5em" }}
            >
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
      <Caption1 className={styles.hint} role="note">
        {labels.updateNote}
      </Caption1>
      <div>
        <Button
          className={styles.submitButton}
          appearance="primary"
          type="submit"
          disabled={loading}
          aria-busy={loading}
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
              <Spinner size="tiny" aria-label={labels.submittingAria} />
              <span style={{ fontSize: "16px", fontWeight: 500 }}>
                {labels.submitting}
              </span>
            </div>
          ) : (
            labels.submit
          )}
        </Button>
      </div>

      {submitted && !loading && (
        <Caption1
          className={styles.successText}
          role="status"
          aria-live="polite"
        >
          {labels.success}
        </Caption1>
      )}
    </form>
  );
}
