# Wedding Guest Portal

A beautiful and secure wedding website built with Next.js, React, and Fluent UI. This elegant portal allows wedding guests to access event information, RSVP, and view important details using personalized access codes.

## ✨ Features

- 🔐 **Secure Guest Access**: Personalized wedding invitation codes for authentication
- 🛡️ **Protected Content**: Secure route protection with session management
- 📱 **Responsive Design**: Built with Microsoft Fluent Design System and Fluent UI components
- 🎨 **Modern Wedding Theme**: Clean, elegant interface with cinematic animations
- 💒 **Wedding-Focused**: RSVP functionality, event details, and guest management
- 🔄 **Session Management**: Automatic session handling and smooth user experience

## 📖 Pages

1. **`/login`**: Cinematic wedding access code authentication with logo animation
2. **`/`**: Protected wedding portal with guest information and RSVP features

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Setup

The `.env.local` file is configured with demo wedding codes:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-change-this-in-production
VALID_CODES=GUEST2025,FAMILY123,FRIENDS456
```

### 3. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) - you'll be redirected to `/login`.

### 4. Test Authentication

Use any of these demo wedding access codes:
- `GUEST2025`
- `FAMILY123`
- `FRIENDS456`

## Project Structure

```
├── pages/
│   ├── api/auth/
│   │   └── [...nextauth].ts     # NextAuth.js configuration
│   ├── _app.tsx                 # App wrapper with SessionProvider
│   ├── index.tsx                # Protected landing page
│   └── login.tsx                # Authentication page
├── lib/
│   └── auth.ts                  # Authentication utilities
├── types/
│   └── next-auth.d.ts           # TypeScript type definitions
├── styles/
│   └── globals.css              # Tailwind CSS styles
└── middleware.ts                # Route protection middleware
```

## How It Works

### Authentication Flow

1. **User visits any protected route** → Redirected to `/login`
2. **User enters access code** → Validated against `VALID_CODES` in environment
3. **If valid** → JWT session created, user redirected to landing page
4. **If invalid** → Error message displayed

### Route Protection

- **Middleware**: Protects all routes except `/login` and NextAuth API routes
- **Server-side**: `getServerSideProps` checks session and redirects if needed
- **Client-side**: `useSession` hook provides session data to components

### Session Management

- Uses JWT strategy for stateless sessions
- Session includes user info and access code
- Automatic session refresh and logout handling

## Configuration

### Adding Valid Codes

Update the `VALID_CODES` environment variable:

```env
VALID_CODES=SECRET123,ADMIN456,USER789,NEWCODE123
```

### Custom Validation Logic

Modify the `validateAccessCode` function in `/pages/api/auth/[...nextauth].ts`:

```typescript
const validateAccessCode = (code: string): boolean => {
  // Add your custom validation logic here
  // e.g., check against database, API, etc.
  return validCodes.includes(code)
}
```

### Styling

The project uses Tailwind CSS with custom component classes in `globals.css`:

- `.btn-primary` - Primary button styling
- `.btn-secondary` - Secondary button styling  
- `.card` - Card container styling
- `.form-input` - Form input styling

## Security Features

- **JWT Tokens**: Secure, stateless authentication
- **HTTP-Only Cookies**: Session cookies not accessible via JavaScript
- **CSRF Protection**: Built-in CSRF protection via NextAuth.js
- **Secure Headers**: Automatic security headers
- **Route Middleware**: Server-side route protection

## Deployment

### Environment Variables

Set these in your production environment:

```env
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=your-production-secret-key
VALID_CODES=your,production,codes
```

### Vercel Deployment

1. Push to GitHub
2. Connect to Vercel
3. Set environment variables
4. Deploy!

## Customization

### Adding New Pages

1. Create page in `/pages/`
2. Add authentication check:

```typescript
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerAuthSession(context)
  
  if (!session) {
    return { redirect: { destination: '/login', permanent: false } }
  }
  
  return { props: { session } }
}
```

### Custom User Data

Extend the session with additional user data in the NextAuth callbacks:

```typescript
callbacks: {
  async jwt({ token, user }) {
    if (user) {
      token.customField = user.customField
    }
    return token
  },
  async session({ session, token }) {
    session.user.customField = token.customField
    return session
  }
}
```

## TypeScript Support

Full TypeScript support with:
- Type-safe NextAuth configuration
- Custom session and user type extensions
- Proper typing for all components and pages

## Troubleshooting

### Common Issues

1. **Session not persisting**: Check `NEXTAUTH_SECRET` is set
2. **Redirect loops**: Verify middleware configuration
3. **TypeScript errors**: Run `npm run build` to check for issues

### Debug Mode

Enable NextAuth debug mode in development:

```typescript
// In [...nextauth].ts
export default NextAuth({
  debug: process.env.NODE_ENV === 'development',
  // ... other config
})
```

## License

This project is for educational purposes. Customize freely for your needs!

---

Built with ❤️ using Next.js, NextAuth.js, and Tailwind CSS
