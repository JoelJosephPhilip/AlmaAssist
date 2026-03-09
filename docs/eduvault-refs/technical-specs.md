# EduVault — Technical Specifications

## Platform Architecture

EduVault is a cloud-native SaaS platform built on modern, scalable infrastructure.

### Technology Stack
- **Backend**: Node.js with Express framework, running on AWS ECS (Fargate)
- **Frontend**: React single-page application hosted on AWS CloudFront
- **Database**: PostgreSQL on AWS RDS (Multi-AZ deployment)
- **Cache**: Redis on AWS ElastiCache
- **Search**: Elasticsearch for full-text search of academic records
- **Message Queue**: AWS SQS for asynchronous processing
- **File Storage**: AWS S3 with server-side encryption

### Infrastructure
- **Hosting Region**: US-East-1 (Virginia) primary, US-West-2 (Oregon) disaster recovery
- **Compute**: AWS ECS Fargate (serverless containers)
- **Load Balancing**: AWS Application Load Balancer with auto-scaling
- **CDN**: AWS CloudFront for static assets and API acceleration
- **DNS**: AWS Route 53 with health checks and failover routing

## API

### REST API
EduVault provides a RESTful API for institutional integrations:
- Base URL: `https://api.eduvault.io/v2/`
- Authentication: OAuth 2.0 with API keys
- Rate limits: 1,000 requests per minute per institution
- Response format: JSON
- Pagination: Cursor-based pagination for large datasets
- Versioning: URL-based versioning (v1, v2)

### Webhook Events
EduVault supports webhooks for real-time event notifications:
- Student enrollment changes
- Grade submissions
- Record updates
- System alerts

### SIS Integration
EduVault integrates with major Student Information Systems via:
- **Banner by Ellucian**: Native integration via Ethos API
- **PeopleSoft Campus Solutions**: Custom connector
- **Workday Student**: REST API integration
- **Jenzabar**: Direct database connector

### LMS Integration
- **Canvas**: LTI 1.3 and REST API integration
- **Blackboard**: LTI 1.3 and REST API integration
- **Moodle**: LTI 1.3 integration
- **Brightspace (D2L)**: LTI 1.3 and Valence API

## Third-Party Integrations

EduVault integrates with the following third-party services:

### Identity Providers
- Azure Active Directory
- Google Workspace
- Okta
- OneLogin
- Shibboleth / InCommon Federation

### Reporting & Analytics
- Tableau (direct database connector)
- Power BI (OData feed)
- Custom report builder with CSV/PDF export

### Communication
- SMTP email integration (configurable per institution)
- SMS notifications via Twilio (optional)

### Document Management
- Integration with institutional document management systems
- Support for PDF, DOCX, and image file uploads
- OCR capability for scanned documents

## Mobile Access

### Responsive Web Application
The EduVault web application is fully responsive and optimized for mobile devices:
- Responsive design adapts to screen sizes from 320px to 4K
- Touch-optimized interface for tablets and smartphones
- Progressive Web App (PWA) support for offline access to cached data
- Mobile-specific navigation patterns (bottom nav, swipe gestures)

### Mobile App (Coming Q3 2026)
- Native iOS and Android applications planned
- Push notifications for important updates
- Biometric authentication support
- Offline mode for frequently accessed records

### Mobile Browser Support
- Safari (iOS 14+)
- Chrome (Android 10+)
- All modern mobile browsers supported

## Performance

### Uptime and Availability
- 99.9% uptime SLA (see Support & SLA document for details)
- Planned maintenance windows: Sundays 2:00 AM - 6:00 AM ET (monthly)
- Maintenance notifications sent 7 days in advance
- Zero-downtime deployments for routine updates

### Response Times
- API response time: < 200ms (p95) for standard queries
- Page load time: < 2 seconds for initial load
- Search queries: < 500ms for standard searches
- Report generation: < 30 seconds for standard reports

### Scalability
- Horizontal auto-scaling based on load
- Designed to support institutions with up to 500,000 student records
- Concurrent user support: up to 10,000 per institution
- Burst capacity: 3x normal load
