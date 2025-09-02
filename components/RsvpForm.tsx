import * as React from "react";
import {
  Button,
  Caption1,
  Card,
  Field,
  Label,
  makeStyles,
  Spinner,
  Input,
  Checkbox,
  Textarea,
  mergeClasses,
} from "@fluentui/react-components";
import type { User, Language, Invitation } from "@/types/invitations";
import timelineEn from "@/data/timeline.json";
import timelineEs from "@/data/timeline.es.json";

export type Attendance = "yes" | "no" | "maybe"; // retained for compatibility

export interface GuestResponse {
  name: string;
  selectedEvents: string[];
  note?: string;
}

type RsvpFormProps = {
  guests: User[];
  onSubmit?: (
    responses: GuestResponse[],
    extras?: { requireTransportation?: boolean; email: string }
  ) => void;
  language?: Language; // 'EN' | 'ES'
  residency?: Invitation["Residency"]; // 'Local' | 'Remote'
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
  residency,
}: RsvpFormProps) {
  const styles = useStyles();

  const isES = language === "ES";
  const labels = {
    eventsFor: isES ? "Eventos —" : "Events —",
    atLeastOne: isES
      ? "Selecciona al menos un evento"
      : "Please select at least one event",
    selectAllAttending: isES
      ? "Selecciona todos los eventos que asistirás"
      : "Select all you'll be attending",
    notAttending: isES ? "No podré asistir" : "Won't be able to attend",
    email: isES
      ? "Correo electrónico para confirmación"
      : "Email for confirmation",
    emailPlaceholder: isES ? "tucorreo@ejemplo.com" : "you@example.com",
    emailRequired: isES
      ? "Ingresa un correo válido"
      : "Please enter a valid email",
    submit: isES ? "Enviar confirmación" : "Submit RSVP",
    empty: isES ? "No hay invitados para confirmar." : "No guests to RSVP.",
    updateNote: isES
      ? "Puedes actualizar tu respuesta en cualquier momento reenviando este formulario."
      : "You can update your response anytime by resubmitting this form.",
    submitting: isES ? "Enviando..." : "Submitting...",
    submittingAria: isES ? "Enviando confirmación" : "Submitting RSVP",
    success: isES
      ? "¡Gracias! Tu confirmación fue enviada. Recibirás un correo de confirmación pronto en aprox 1-2h."
      : "Thanks! Your RSVP was sent. You'll receive a confirmation email aprox shortly after 1-2h.",
    dietaryLabel: isES
      ? "Restricciones alimenticias o alergias"
      : "Dietary restrictions or allergies",
    dietaryPlaceholder: isES
      ? "Ej.: vegetariano, sin gluten, alergia a nueces"
      : "E.g., vegetarian, gluten-free, nut allergy",
    transportation: isES
      ? "Necesitan transporte el día de la boda?"
      : "Will you need transportation on the wedding day?",
  } as const;

  const [responses, setResponses] = React.useState<
    Record<number, Record<string, boolean>>
  >(() => (guests || []).reduce((acc, _g, idx) => ({ ...acc, [idx]: {} }), {}));

  React.useEffect(() => {
    // Reset when guests or residency/language change
    setResponses(
      (guests || []).reduce((acc, _g, idx) => ({ ...acc, [idx]: {} }), {})
    );
    setShowErrors(false);
    setSubmitted(false);
    setDietaryNotes(
      (guests || []).reduce((acc, _g, idx) => ({ ...acc, [idx]: "" }), {})
    );
    setRequireTransportation(false);
  }, [guests, residency, language]);

  // Track if user attempted to submit to show validation messages
  const [showErrors, setShowErrors] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);
  // Refs per guest section for scroll-to-error
  const guestRefs = React.useRef<(HTMLElement | null)[]>([]);
  const emailRef = React.useRef<HTMLDivElement | null>(null);
  const [email, setEmail] = React.useState("");
  const [requireTransportation, setRequireTransportation] =
    React.useState<boolean>(false);
  const [notAttending, setNotAttending] = React.useState<
    Record<number, boolean>
  >(() =>
    (guests || []).reduce((acc, _g, idx) => ({ ...acc, [idx]: false }), {})
  );
  const [dietaryNotes, setDietaryNotes] = React.useState<
    Record<number, string>
  >(() => (guests || []).reduce((acc, _g, idx) => ({ ...acc, [idx]: "" }), {}));

  const isEmailValid = (value: string) => {
    // Basic email validation
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(value.trim());
  };

  const toggleEvent = (guestIndex: number, eventKey: string) => {
    setSubmitted(false);
    // If selecting any event, ensure notAttending is unset
    setNotAttending((prev) => ({ ...prev, [guestIndex]: false }));
    setResponses((prev) => ({
      ...prev,
      [guestIndex]: {
        ...prev[guestIndex],
        [eventKey]: !prev[guestIndex]?.[eventKey],
      },
    }));
  };

  const toggleNotAttending = (guestIndex: number) => {
    setSubmitted(false);
    setNotAttending((prev) => {
      const next = !prev[guestIndex];
      // If toggled on, clear all event selections for this guest
      if (next) {
        setResponses((rPrev) => ({ ...rPrev, [guestIndex]: {} }));
      }
      return { ...prev, [guestIndex]: next };
    });
  };

  // Notes omitted in this layout; can be reintroduced per guest or per event if needed

  // Build event list based on language and residency (like Timeline.tsx)
  type TimelineItem = {
    title: string;
    start: string;
    end?: string;
    guests?: string;
  };
  const src = (
    language === "ES" ? timelineEs : timelineEn
  ) as Array<TimelineItem>;
  const normalizedResidency = residency?.toLowerCase();
  const events = src.filter((item) => {
    const g = String(item.guests || "All").toLowerCase();
    if (g === "all") return true;
    return normalizedResidency ? g === normalizedResidency : g === "all";
  });
  const eventKey = (e: TimelineItem) => `${e.title}-${e.start}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validate email first
    const emailOk = isEmailValid(email);
    // Validate all guests have an attendance selection for every event
    // Validate each guest has at least one selected event
    const missingGuests: number[] = [];
    (guests || []).forEach((_, gi) => {
      const selections = responses[gi] || {};
      const anySelected = Object.values(selections).some(Boolean);
      const noneSelected = !anySelected && !notAttending[gi];
      if (noneSelected) missingGuests.push(gi);
    });

    if (!emailOk || missingGuests.length > 0) {
      setShowErrors(true);
      // Scroll to email if invalid, otherwise to first missing group
      if (!emailOk) {
        const eEl = emailRef.current;
        if (eEl && typeof eEl.scrollIntoView === "function") {
          eEl.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      } else if (missingGuests.length > 0) {
        const firstIdx = missingGuests[0];
        const el = guestRefs.current[firstIdx];
        if (el && typeof el.scrollIntoView === "function") {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }
      return;
    }

    // Build submission list per guest with selected events
    const list: GuestResponse[] = (guests || []).map((g, gi) => {
      const selections = responses[gi] || {};
      return {
        name: g.Name,
        selectedEvents: Object.keys(selections).filter((k) => !!selections[k]),
        note: (dietaryNotes[gi] || "").trim() || undefined,
      };
    });

    const submissionData = {
      guestResponses: list,
      extras: { requireTransportation, email },
    };
    console.log("RSVP Form Submission:", submissionData);

    setLoading(true);
    
    try {
      // Call the parent onSubmit if provided (for custom handling)
      onSubmit?.(list, { requireTransportation, email });
      
      // Submit to our API
      const response = await fetch('/api/submit-rsvp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Submission failed');
      }

      console.log('RSVP submitted successfully');
      setSubmitted(true);
    } catch (error) {
      console.error('RSVP submission error:', error);
      // You might want to show an error state here
      alert('Failed to submit RSVP. Please try again or contact us directly.');
    } finally {
      setLoading(false);
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
        {(guests || []).map((g, idx) => (
          <section
            key={`${g.Name}-${idx}`}
            ref={(el) => {
              guestRefs.current[idx] = el;
            }}
          >
            <div className={styles.row}>
              <span className={mergeClasses(styles.label, styles.nameLabel)}>
                {g.Name}
              </span>
            </div>
            <div style={{ marginTop: "0.5em" }}>
              <Field>
                <Checkbox
                  checked={!!notAttending[idx]}
                  label={labels.notAttending}
                  onChange={() => toggleNotAttending(idx)}
                />
              </Field>
            </div>
            
            <div style={{ marginTop: "0.75em" }}>
              <Label className={styles.label} style={{ marginBottom: "0.5em", display: "block" }}>
                {labels.selectAllAttending}
              </Label>
              {showErrors &&
                !notAttending[idx] &&
                Object.values(responses[idx] || {}).every((v) => !v) && (
                <div style={{ color: "#D13438", fontSize: "12px", marginBottom: "0.5em" }}>
                  {labels.atLeastOne}
                </div>
              )}
              <div className={styles.row}>
                {events.map((ev) => {
                  const key = eventKey(ev);
                  const checked = !!responses[idx]?.[key];
                  return (
                    <Field key={`${key}-${idx}`}>
                      <Checkbox
                        checked={checked}
                        disabled={!!notAttending[idx]}
                        label={ev.title}
                        onChange={() => toggleEvent(idx, key)}
                      />
                    </Field>
                  );
                })}
              </div>
            </div>
            <Field
              label={
                <Label className={styles.label}>{labels.dietaryLabel}</Label>
              }
              style={{ marginTop: "0.5em" }}
            >
              <Textarea
                value={dietaryNotes[idx] || ""}
                placeholder={labels.dietaryPlaceholder}
                onChange={(_, data) =>
                  setDietaryNotes((prev) => ({ ...prev, [idx]: data.value }))
                }
                rows={3}
              />
            </Field>
          </section>
        ))}
        {residency === "Remote" && (
          <div style={{ marginTop: "0.75em" }}>
            <Checkbox
              checked={requireTransportation}
              onChange={(_, data) => setRequireTransportation(!!data.checked)}
              label={labels.transportation}
            />
          </div>
        )}
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
