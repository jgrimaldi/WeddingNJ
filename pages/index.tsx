import { GetServerSidePropsContext } from 'next'
import { getServerAuthSession } from '@/lib/auth'
import { signOut } from "next-auth/react";
import Head from 'next/head'
import Image from 'next/image'
import { 
  Button,
  Card,
  Title1,
  Title2,
  Title3,
  Body1,
  Body2,
  Badge
} from '@fluentui/react-components'
import { 
  ShieldCheckmarkRegular,
  LockClosedRegular,
  SettingsRegular,
  DocumentRegular,
  PersonRegular,
  SignOutRegular
} from '@fluentui/react-icons'

type HomePageProps = {
  session: {
    user: {
      name: string;
      email?: string | null;
      image?: string | null;
      accessCode?: string | null;
    };
  };
};

export default function HomePage({ session } : HomePageProps) {

  return (
    <>
      <Head>
        <title>Wedding Guest Portal - Welcome</title>
        <meta name="description" content="Welcome to our wedding guest portal - your personalized space for event details, RSVP, and celebration information" />
      </Head>

      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: 'var(--fluent-grey-10)' 
      }}>
        {/* Header */}
        <header style={{
          backgroundColor: 'white',
          boxShadow: 'var(--fluent-shadow-4)',
          borderBottom: '1px solid var(--fluent-grey-40)'
        }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 24px'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '24px 0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <Image
                  src="/logos/nj-logo-black.svg"
                  alt="Wedding Logo"
                  width={150}
                  height={60}
                  style={{ maxWidth: '100%', height: 'auto' }}
                />
                <Title1 style={{ color: 'var(--fluent-grey-160)' }}>
                  Wedding Guest Portal
                </Title1>
              </div>
              <Button
                appearance="secondary"
                onClick={() => signOut({ callbackUrl: '/login' })}
                icon={<SignOutRegular />}
              >
                Sign Out
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '48px 24px'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {/* Welcome Card */}
            <Card style={{
              padding: '32px',
              backgroundColor: 'white',
              borderRadius: '12px',
              boxShadow: 'var(--fluent-shadow-8)'
            }}>
              <Title2 style={{ 
                color: 'var(--fluent-grey-160)', 
                marginBottom: '16px' 
              }}>
                Welcome to Our Wedding!
              </Title2>
              <Body1 style={{ 
                color: 'var(--fluent-grey-130)', 
                marginBottom: '24px' 
              }}>
                Thank you for joining us for our special day. Use this portal to view event details, RSVP, and more.
              </Body1>
              
              {session?.user && (
                <div style={{
                  backgroundColor: 'var(--fluent-grey-20)',
                  border: `1px solid var(--fluent-grey-50)`,
                  borderRadius: '8px',
                  padding: '20px'
                }}>
                  <Title3 style={{ 
                    color: 'var(--fluent-grey-160)', 
                    marginBottom: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <PersonRegular />
                    Guest Information
                  </Title3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <Body2><strong>Guest Name:</strong> {session.user.name}</Body2>
                    <Body2><strong>Access Code:</strong> {(session.user as any).accessCode}</Body2>
                    <Body2>
                      <strong>Status:</strong> 
                      <Badge 
                        appearance="filled" 
                        color="success" 
                        style={{ marginLeft: '8px' }}
                      >
                        Verified
                      </Badge>
                    </Body2>
                  </div>
                </div>
              )}
            </Card>

            {/* Features Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '24px'
            }}>
              <Card style={{
                padding: '24px',
                backgroundColor: 'white',
                borderRadius: '12px',
                boxShadow: 'var(--fluent-shadow-8)',
                textAlign: 'center'
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  backgroundColor: 'var(--fluent-blue-20)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                  color: 'var(--fluent-blue-70)'
                }}>
                  <ShieldCheckmarkRegular style={{ fontSize: '24px' }} />
                </div>
                <Title3 style={{ 
                  color: 'var(--fluent-grey-160)', 
                  marginBottom: '8px' 
                }}>
                  Secure Guest Access
                </Title3>
                <Body2 style={{ color: 'var(--fluent-grey-130)' }}>
                  Your personal wedding invitation code ensures secure access to your event details.
                </Body2>
              </Card>

              <Card style={{
                padding: '24px',
                backgroundColor: 'white',
                borderRadius: '12px',
                boxShadow: 'var(--fluent-shadow-8)',
                textAlign: 'center'
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  backgroundColor: 'var(--fluent-grey-30)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                  color: 'var(--fluent-grey-130)'
                }}>
                  <LockClosedRegular style={{ fontSize: '24px' }} />
                </div>
                <Title3 style={{ 
                  color: 'var(--fluent-grey-160)', 
                  marginBottom: '8px' 
                }}>
                  RSVP & Details
                </Title3>
                <Body2 style={{ color: 'var(--fluent-grey-130)' }}>
                  View event details, confirm your attendance, and manage your RSVP.
                </Body2>
              </Card>

              <Card style={{
                padding: '24px',
                backgroundColor: 'white',
                borderRadius: '12px',
                boxShadow: 'var(--fluent-shadow-8)',
                textAlign: 'center'
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  backgroundColor: 'var(--fluent-grey-30)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                  color: 'var(--fluent-grey-130)'
                }}>
                  <SettingsRegular style={{ fontSize: '24px' }} />
                </div>
                <Title3 style={{ 
                  color: 'var(--fluent-grey-160)', 
                  marginBottom: '8px' 
                }}>
                  Wedding Information
                </Title3>
                <Body2 style={{ color: 'var(--fluent-grey-130)' }}>
                  Access venue details, schedule, gift registry, and other important information.
                </Body2>
              </Card>
            </div>

            {/* Actions */}
            <Card style={{
              padding: '32px',
              backgroundColor: 'white',
              borderRadius: '12px',
              boxShadow: 'var(--fluent-shadow-8)'
            }}>
              <Title3 style={{ 
                color: 'var(--fluent-grey-160)', 
                marginBottom: '24px' 
              }}>
                Wedding Portal Actions
              </Title3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px',
                  backgroundColor: 'var(--fluent-grey-20)',
                  borderRadius: '8px'
                }}>
                  <Body1 style={{ color: 'var(--fluent-grey-160)' }}>
                    Complete your RSVP
                  </Body1>
                  <Button appearance="primary" size="small">
                    RSVP Now
                  </Button>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px',
                  backgroundColor: 'var(--fluent-grey-20)',
                  borderRadius: '8px'
                }}>
                  <Body1 style={{ color: 'var(--fluent-grey-160)' }}>
                    View event schedule
                  </Body1>
                  <Button 
                    appearance="primary" 
                    size="small"
                    icon={<DocumentRegular />}
                  >
                    Schedule
                  </Button>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px',
                  backgroundColor: 'var(--fluent-grey-20)',
                  borderRadius: '8px'
                }}>
                  <Body1 style={{ color: 'var(--fluent-grey-160)' }}>
                    Registry & gift information
                  </Body1>
                  <Button 
                    appearance="primary" 
                    size="small"
                    icon={<SettingsRegular />}
                  >
                    View Registry
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </>
  )
}

// Server-side authentication check
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerAuthSession(context)
  console.log('SESSION:', session);

  // If user is not authenticated, redirect to login
  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }

  // Clean the session object to avoid serialization issues
  const cleanSession = {
    user: {
      name: session.user?.name || 'Authorized User',
      email: session.user?.email || null,
      image: session.user?.image || null,
      accessCode: (session.user as any)?.accessCode || null
    }
  }

  return {
    props: {
      session: cleanSession,
    },
  }
}
