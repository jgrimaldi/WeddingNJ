import { useState, useEffect } from 'react'
import { signIn, getSession } from 'next-auth/react'
import { GetServerSidePropsContext } from 'next'
import { getServerAuthSession } from '@/lib/auth'
import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { 
  Input, 
  Button, 
  MessageBar,
  Spinner,
  Card,
  Body1,
  Title2,
  Field,
  makeStyles,
  shorthands 
} from '@fluentui/react-components'

const useStyles = makeStyles({
  input: {
    '::after': {
      content: '',
      width: '99%',
      justifySelf: 'center',
      borderBottomColor: '#161616 !important', // Change this to your desired focus color
    },
  },
});

export default function LoginPage() {
  const [accessCode, setAccessCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [animationPhase, setAnimationPhase] = useState<'loading' | 'logo' | 'form'>('loading')
  const router = useRouter()

  // Handle entrance animation sequence - 2 distinct stages
  useEffect(() => {
    // Stage 1: Stage 2: Logo entrance
    const stage1Timer = setTimeout(() => {
      setAnimationPhase('logo') // Stage 2: Logo entrance
    }, 100) // Small delay to ensure DOM is ready and create blank stage

    // Stage 2: Form entrance (logo stays visible)
    const stage3Timer = setTimeout(() => {
      setAnimationPhase('form') // Form entrance - logo remains visible
    }, 2500) // Form starts after 2 seconds

    return () => {
      clearTimeout(stage1Timer)
      clearTimeout(stage3Timer)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const result = await signIn('credentials', {
        accessCode,
        redirect: false,
        callbackUrl: '/', // Always redirect to home after login
      })

      if (result?.error) {
        setError('Invalid access code. Please try again.')
        setLoading(false)
      } else if (result?.ok) {
        // Wait a moment for session to be established
        setTimeout(() => {
          router.push('/')
        }, 100)
      }
    } catch (error) {
      console.error('SignIn error:', error)
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  const styles = useStyles();

  return (
    <>
      <Head>
        <title>Nathy & Jorge's Wedding</title>
        <meta name="description" content="Enter your unique wedding access code to view event details, RSVP, and access your personalized guest portal" />
        <style jsx>{`
          @keyframes logoEntrance {
            0% {
              opacity: 0;
              transform: scale(0.3) translateY(80px) rotate(-20deg);
            }
            30% {
              opacity: 0.3;
              transform: scale(0.7) translateY(20px) rotate(-8deg);
            }
            60% {
              opacity: 0.8;
              transform: scale(1.02) translateY(-5px) rotate(2deg);
            }
            80% {
              opacity: 0.95;
              transform: scale(1.05) translateY(-2px) rotate(1deg);
            }
            100% {
              opacity: 1;
              transform: scale(1) translateY(0px) rotate(0deg);
            }
          }

          @keyframes logoMoveUp {
            0% {
              transform: translateY(0);
            }
            100% {
              transform: translateY(-25vh);
            }
          }

          @keyframes gentleGlow {
            0%, 100% {
              box-shadow: var(--fluent-shadow-28);
            }
            50% {
              box-shadow: 0 12px 40px rgba(0, 120, 212, 0.12), var(--fluent-shadow-28);
            }
          }

          @keyframes backgroundShift {
            0%, 100% {
              background-color: var(--fluent-grey-10);
            }
            50% {
              background-color: var(--fluent-grey-20);
            }
          }

          .phase-container {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .phase-container .logo-entrance {
            animation: logoEntrance 1.8s cubic-bezier(0.19, 1, 0.22, 1) forwards !important;
            animation-delay: 0.3s !important;
            animation-fill-mode: both !important;
            /* Ensure the animation starts with the correct initial state */
            opacity: 0 !important;
            transform: scale(0.3) translateY(80px) rotate(-20deg) !important;            
          }

          .card-entrance {
            animation: gentleGlow 4s ease-in-out;
          }

          .background-animated {
            animation: backgroundShift 8s ease-in-out infinite;
          }

          @media (prefers-reduced-motion: reduce) {
            .logo-entrance,
            .card-entrance,
            .background-animated {
              animation: none;
            }
          }

          /* Modern input styling */
          .fui-Input__input:focus {
            border-color: #3b82f6 !important;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
            background-color: #ffffff !important;
          }

          .fui-Input__input:hover:not(:disabled) {
            border-color: #9ca3af !important;
            background-color: #ffffff !important;
          }

          /* Button hover effects */
          .fui-Button:hover:not(:disabled) {
            background-color: #2563eb !important;
            transform: translateY(-1px);
            box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4) !important;
          }

          .fui-Button:active:not(:disabled) {
            transform: translateY(0);
          }
          
          span:has(input)::after {
            border-bottom: 2px solid #161616 !important;
          }
        `}</style>
      </Head>

      <div 
        className="background-animated"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'var(--fluent-grey-10)',
          position: 'relative',
          transition: 'background-color 1.5s ease-in-out',
          minHeight: '98vh',
          maxHeight: '98vh',
          marginBottom: animationPhase === 'loading' ? '50vh' : '0', // No margin bottom needed
        }}
      >
        {/* Stage 1: Logo Phase - Logo entrance animation (starts centered, moves up) */}
        <div 
          className="phase-container"
          style={{
            opacity: (animationPhase === 'logo' || animationPhase === 'form') ? 1 : 0,
            visibility: (animationPhase === 'logo' || animationPhase === 'form') ? 'visible' : 'hidden',
            zIndex: (animationPhase === 'logo' || animationPhase === 'form') ? 2 : 1,
            transitionDelay: animationPhase === 'logo' ? '0.5s' : '0s',
            // Position logo: center during logo phase, top during form phase
            alignItems: 'flex-start',
            paddingTop: animationPhase === 'form' ? '10vh' : '30vh',
            paddingBottom: '2vh',
            transition: 'all 1.8s ease-out'
          }}
        >
          <div 
            className={animationPhase === 'logo' ? 'logo-entrance' : ''}
            style={{
              textAlign: 'center',
              willChange: 'transform, opacity, filter',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Image
              src="/logos/nj-logo-black.svg"
              alt="Wedding Logo"
              width={240}
              height={96}
              style={{ 
                width: 'clamp(200px, 40vw, 300px)',
                height: 'auto',
                maxWidth: '100%',
                filter: 'brightness(0) saturate(100%) invert(22%) sepia(19%) saturate(0%) hue-rotate(140deg) brightness(104%) contrast(100%)',
                paddingBottom: '2vh',
              }}
              priority
            />
            <Title2 style={{ 
                  color: '#1a1a1a', 
                  fontSize: 'clamp(1.75rem, 4vw, 2.25rem)',
                  fontWeight: '300',
                  letterSpacing: '-0.02em',
                  textAlign: 'center',
                  padding: '0 1em',
                  paddingTop: '1em',
                }}>
                  <span style={{ 
                    color: '#3D3D3D', 
                    fontFamily: 'Parisienne',
                    fontSize: '2em',
                    padding: '1em 0',
                    }}
                    >
                      Welcome to Nathalia & Jorge's wedding!
                  </span>
            </Title2>


          </div>
          
        </div>

        {/* Stage 2: Form Phase - Login form entrance (appears from bottom) */}
        <div 
          className="phase-container"
          style={{
            opacity: animationPhase === 'form' ? 1 : 0,
            visibility: animationPhase === 'form' ? 'visible' : 'hidden',
            transform: animationPhase === 'form' ? 'translateY(0) scale(1)' : 'translateY(2em) scale(0.95)',
            zIndex: animationPhase === 'form' ? 5 : 1,
            transition: 'all 1.8s cubic-bezier(0.4, 0, 0.2, 1)',
            transitionDelay: animationPhase === 'form' ? '0.5s' : '0s',
            // Position form in lower area
            alignItems: 'flex-end',
            paddingTop: '2vh',
            maxWidth: '70vw',
          }}
        >
          <div 
              style={{ 
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center', 
              paddingBottom: '2vh'              
              }}
            >          
                
              <Body1 style={{ 
                color: '#6b7280',
                fontSize: 'clamp(1rem, 3vw, 1.5rem)',
                fontWeight: '400',
                lineHeight: '1.5',
                textAlign: 'left',
                //fontFamily: 'Segoe UI Light'
              }}>
                Thank you for visiting our site ! To keep things personal and secure, each guest has a unique access code.
Please enter your code below to unlock all the details of the big day plus a special message
              <span style={{
                color: '#3D3D3D',
                fontWeight: '500',
                marginLeft: '0.25em',
              }}>just for you.</span>
              
              </Body1>
          </div>

        </div>

        <div 
          className="phase-container"
          style={{
            opacity: animationPhase === 'form' ? 1 : 0,
            visibility: animationPhase === 'form' ? 'visible' : 'hidden',
            transform: animationPhase === 'form' ? 'translateY(0) scale(1)' : 'translateY(2em) scale(0.95)',
            zIndex: animationPhase === 'form' ? 5 : 1,
            transition: 'all 2s cubic-bezier(0.4, 0, 0.2, 1)',
            transitionDelay: animationPhase === 'form' ? '0.5s' : '0s',
            // Position form in lower area
            alignItems: 'flex-end',
            paddingBottom: '20vh',
            paddingTop: '2vh',
            maxWidth: '60vw',
          }}
        >
          <form onSubmit={handleSubmit} style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}>
                <div style={{
                  width: '-webkit-fill-available',
                }}>
                  <Field                     
                    
                    required
                    style={{ width: '100%' }}
                  >
                    <Input
                        id="accessCode"
                        name="accessCode"
                        className={styles.input}
                        type="text"
                        required
                        placeholder="Enter your code"
                        value={accessCode}
                        onChange={(e) => setAccessCode(e.target.value)}
                        disabled={loading}
                        size="large"
                        appearance="outline"
                        style={{ 
                          width: '100%',
                          fontSize: 'clamp(0.875rem, 3vw, 1rem)',
                          borderRadius: '12px',
                          border: '2px solid #e5e7eb',
                          backgroundColor: '#fafafa',
                          transition: 'all 0.2s ease',
                        }}
                        aria-describedby={error ? "error-message" : undefined}
                      />
                  </Field>
                </div>

                {error && (
                  <div>
                    <MessageBar 
                      intent="error" 
                      style={{ marginTop: '8px', padding: '0 1em' }}
                      id="error-message"
                      role="alert"
                      aria-live="polite"
                    >
                      {error}
                    </MessageBar>
                  </div>
                )}

                <div style={{width: '-webkit-fill-available'}}>
                  <Button
                    type="submit"
                    disabled={loading || !accessCode.trim()}
                    appearance="primary"
                    size="large"
                    style={{ 
                      marginTop: '8px',
                      width: '100%',
                      fontSize: 'clamp(0.875rem, 3vw, 1rem)',
                      fontWeight: '500',
                      borderRadius: '12px',
                      backgroundColor: loading || !accessCode.trim() ? '#d1d5db' : '#323232',
                      border: '2px solid #6F6F6F',
                      color: 'white',
                      transition: 'all 0.2s ease',
                      cursor: loading || !accessCode.trim() ? 'not-allowed' : 'pointer',
                      boxShadow: '0 4px 12px rgba(58, 133, 255, 0.3)'
                    }}
                    aria-describedby="submit-button-description"
                  >
                    {loading ? (
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '12px',
                        justifyContent: 'center'
                      }}>
                        <Spinner size="tiny" aria-label="Verifying access code" />
                        <span style={{ fontSize: '16px', fontWeight: '500' }}>Verifying...</span>
                      </div>
                    ) : (
                      <span style={{ fontSize: '16px', fontWeight: '500' }}>Join the wedding</span>
                    )}
                  </Button>
                  <div id="submit-button-description" style={{ display: 'none' }}>
                    Click to sign in with your access code
                  </div>
                </div>
              </form>
          {/* <Card 
            className="card-entrance"
            style={{
              width: 'clamp(200px,60vw,400px)',
              padding: '0',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '1em',
              border: '2px solid #6F6F6F',
              boxShadow: '0 32px 64px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(255, 255, 255, 0.05)',
              overflow: 'hidden'
            }}
          >
            <div className="form-container" style={{
              padding: '1em'
            }}>            


              
              
            </div>
          </Card> */}
        </div>
      </div>
    </>
  )
}

// Server-side authentication check
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerAuthSession(context)

  // If user is already authenticated, redirect to home
  if (session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  // If user is not authenticated, do NOT set a callbackUrl
  return {
    props: {},
  }
}
