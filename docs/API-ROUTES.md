# API Routes Documentation

## Overview

> The redesign preserves these service capabilities. User-facing copy, validation feedback, search labels, booking language, privacy treatment, and disclaimers must follow [PRODUCT-DIRECTION.md](./PRODUCT-DIRECTION.md).

Athena Stock provides REST API endpoints for booking appointments, email subscriptions, and content search.

All API routes are located in \src/app/api/\.

---

## Booking API

### POST /api/booking

Create a new booking request with automatic Google Calendar and Meet integration.

**Endpoint:** \POST /api/booking\

**Request Body:**

\\\json
{
  "name": "Nguyen Van A",
  "email": "email@example.com",
  "phone": "0123456789",
  "date": "2024-03-15",
  "timeBlock": "14:00 - 15:00 (Chiều)",
  "message": "Tôi muốn trao đổi về phân tích FPT"
}
\\\

**Required Fields:**
- \
ame\: Full name
- \email\: Valid email address
- \date\: Date in YYYY-MM-DD format
- \	imeBlock\: Time slot (must match predefined blocks)

**Optional Fields:**
- \phone\: Phone number
- \message\: Additional message

**Response (Success):**

\\\json
{
  "success": true,
  "hangoutLink": "https://meet.google.com/abc-defg-hij"
}
\\\

**Response (Error):**

\\\json
{
  "error": "Error message description"
}
\\\

**What Happens:**
1. Creates tentative event in Google Calendar
2. Generates Google Meet link automatically
3. Sends HTML email to admin with approve/reschedule buttons
4. Returns Meet link to user (for testing)

**Time Blocks:**

\\\json
{
  "09:00 - 10:00 (Sáng)": { "start": "09:00:00", "end": "10:00:00" },
  "10:00 - 11:00 (Sáng)": { "start": "10:00:00", "end": "11:00:00" },
  "14:00 - 15:00 (Chiều)": { "start": "14:00:00", "end": "15:00:00" },
  "15:00 - 16:00 (Chiều)": { "start": "15:00:00", "end": "16:00:00" },
  "16:00 - 17:00 (Chiều)": { "start": "16:00:00", "end": "17:00:00" },
  "19:30 - 20:30 (Tối)": { "start": "19:30:00", "end": "20:30:00" }
}
\\\

---

### GET /api/booking/confirm

Admin approval endpoint - called when admin clicks "Approve" button in email.

**Endpoint:** \GET /api/booking/confirm\

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| \id\ | string | Yes | Google Calendar event ID |
| \
ame\ | string | Yes | Customer name |
| \email\ | string | Yes | Customer email |
| \date\ | string | Yes | Booking date (YYYY-MM-DD) |
| \	imeBlock\ | string | Yes | Time slot |
| \meet\ | string | Yes | Google Meet URL |
| \	oken\ | string | Yes | Security token |

**Response:**

Returns HTML page showing approval status (not JSON).

**What Happens:**
1. Validates security token
2. Updates Calendar event status to "confirmed"
3. Sends HTML confirmation email to customer with Meet link
4. Displays success page to admin

**Security:**

Token must match \BOOKING_SECRET\ environment variable.

---

### POST /api/booking/reschedule

Admin reschedule endpoint - propose alternative time slots.

**Endpoint:** \POST /api/booking/reschedule\

**Request Body:**

\\\json
{
  "id": "calendar_event_id",
  "name": "Nguyen Van A",
  "email": "email@example.com",
  "originalDate": "2024-03-15",
  "originalTimeBlock": "14:00 - 15:00 (Chiều)",
  "token": "secret_token",
  "suggestions": [
    {
      "date": "2024-03-16",
      "timeBlock": "10:00 - 11:00 (Sáng)"
    },
    {
      "date": "2024-03-17",
      "timeBlock": "15:00 - 16:00 (Chiều)"
    }
  ]
}
\\\

**Response:**

\\\json
{
  "success": true,
  "warning": ""  // Optional warning message
}
\\\

**What Happens:**
1. Deletes original Calendar event
2. Sends HTML email to customer with suggested alternative slots
3. Customer contacts admin via Zalo to confirm new time

---

## Email Subscription API

### POST /api/subscribe

Subscribe email to newsletter.

**Endpoint:** \POST /api/subscribe\

**Request Body:**

\\\json
{
  "email": "subscriber@example.com"
}
\\\

**Response (Success):**

\\\json
{
  "success": true
}
\\\

**Response (Error):**

\\\json
{
  "error": "Error message"
}
\\\

**What Happens:**
1. Sends welcome email to subscriber (HTML template)
2. Sends notification email to admin about new subscriber
3. No database - emails are managed via Resend dashboard

**Welcome Email Includes:**
- Welcome message
- Subscription benefits
- Link to website
- Unsubscribe info

---

## Search API

### GET /api/search

Search content across all types.

**Endpoint:** \GET /api/search?q=keyword\

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| \q\ | string | Yes | Search query |
| \	ype\ | string | No | Filter by content type |

**Response:**

\\\json
{
  "results": [
    {
      "slug": "article-slug",
      "title": "Article Title",
      "description": "Description...",
      "type": "article",
      "date": "2024-01-15",
      "tags": ["investing", "philosophy"],
      "readingTime": "5 min"
    }
  ],
  "count": 5
}
\\\

**Search Logic:**
- Searches in title, description, tags, and content
- Case-insensitive
- Returns results sorted by relevance (title match > description > content)

---

## Environment Variables

All API routes require these environment variables:

\\\ash
# Admin Contact
ADMIN_EMAIL=admin@example.com

# Google Calendar/Meet Integration
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REFRESH_TOKEN=your-refresh-token

# Email Service (Resend)
RESEND_API_KEY=re_xxxxx
SENDER_EMAIL=Your Site <contact@yourdomain.com>

# Booking Security
BOOKING_SECRET=random-secret-string

# Public URL
NEXT_PUBLIC_APP_URL=https://yourdomain.com
\\\

---

## Error Handling

### Common Error Codes

| Status | Meaning | Common Causes |
|--------|---------|---------------|
| 400 | Bad Request | Missing required fields |
| 403 | Forbidden | Invalid token |
| 500 | Server Error | API integration failure |

### Error Response Format

All errors return JSON:

\\\json
{
  "error": "Descriptive error message in Vietnamese"
}
\\\

---

## Rate Limiting

**Current Status:** No rate limiting implemented

**Recommendation:** Add rate limiting for production:
- Booking API: 5 requests per IP per hour
- Subscribe API: 3 requests per IP per hour
- Search API: 100 requests per IP per hour

---

## Testing

### Local Testing

\\\ash
# Start dev server
npm run dev

# Test booking API
curl -X POST http://localhost:3000/api/booking \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "date": "2024-03-20",
    "timeBlock": "14:00 - 15:00 (Chiều)"
  }'

# Test subscribe API
curl -X POST http://localhost:3000/api/subscribe \\
  -H "Content-Type: application/json" \\
  -d '{"email": "test@example.com"}'

# Test search API
curl http://localhost:3000/api/search?q=investment
\\\

### Production Testing

Use Postman or similar tool to test against production URLs.

**Important:** Booking API will create real Calendar events and send real emails in production!

---

## Security Considerations

### Booking Confirmation
- Uses secret token to prevent unauthorized confirmations
- Token passed via query params (consider moving to header in future)
- No CORS restrictions (consider adding for production)

### Email Validation
- Basic email format validation
- No verification email sent (consider adding)
- No spam protection (consider adding reCAPTCHA)

### Data Storage
- No database - all booking data in Calendar
- No subscriber list storage - managed via Resend
- Consider adding database for audit trail

---

## Further Documentation

- [Architecture Overview](./ARCHITECTURE.md)
- [Component API](./COMPONENT-API.md)
- [Content Guide](./CONTENT-GUIDE.md)
