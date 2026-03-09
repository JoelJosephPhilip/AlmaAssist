# EduVault — Security Policy

## Overview

EduVault maintains a comprehensive security program designed to protect student data and institutional information. Our security practices are aligned with industry standards and regulatory requirements for educational technology platforms.

## Data Encryption

### Encryption at Rest
All student data stored in EduVault is encrypted at rest using AES-256 encryption. Database volumes, backups, and file storage all use server-side encryption with keys managed through AWS Key Management Service (KMS). Encryption keys are rotated annually.

### Encryption in Transit
All data transmitted between clients and EduVault servers is encrypted using TLS 1.2 or higher. API communications, web application traffic, and internal service-to-service communication all use encrypted channels. We enforce HSTS (HTTP Strict Transport Security) headers on all endpoints.

## Access Control

### Role-Based Access Control (RBAC)
EduVault implements role-based access control with the following default roles:
- **Administrator**: Full system access, user management, configuration
- **Registrar**: Access to academic records, enrollment data, reporting
- **Faculty**: Access to course-specific student records and grades
- **Student**: Access to own records only
- **Auditor**: Read-only access for compliance review

Custom roles can be created by administrators to meet specific institutional needs.

### Multi-Factor Authentication (MFA)
MFA is available for all user accounts and required for administrator accounts. Supported methods include:
- TOTP-based authenticator apps (Google Authenticator, Authy)
- SMS-based verification codes
- Hardware security keys (FIDO2/WebAuthn)

### Single Sign-On (SSO)
EduVault supports SSO integration via:
- SAML 2.0
- OpenID Connect (OIDC)
- CAS (Central Authentication Service)
- Shibboleth

SSO allows universities to use their existing identity provider (e.g., Azure AD, Okta, Google Workspace) for seamless authentication.

## Network Security

### Infrastructure
- Deployed on AWS with VPC isolation
- Web Application Firewall (WAF) protects against common web attacks
- DDoS protection via AWS Shield
- Regular penetration testing by third-party security firms (annually)
- Intrusion detection and prevention systems (IDS/IPS) monitor all traffic

### Vulnerability Management
- Automated vulnerability scanning of all components (weekly)
- Critical vulnerabilities patched within 24 hours
- High vulnerabilities patched within 7 days
- Dependencies monitored for known CVEs using Dependabot and Snyk

## Incident Response

### Data Breach Notification Policy
In the event of a confirmed data breach involving personally identifiable information (PII):
1. **Within 24 hours**: Internal incident response team activated, breach contained
2. **Within 48 hours**: Affected institutions notified via email and phone
3. **Within 72 hours**: Formal written notification sent to affected institutions including:
   - Nature and scope of the breach
   - Types of data involved
   - Steps taken to contain the breach
   - Remediation measures
   - Point of contact for questions
4. **Within 30 days**: Full incident report delivered to affected institutions

EduVault maintains cyber liability insurance and has a dedicated incident response team available 24/7.

## Security Certifications and Audits
- SOC 2 Type II audit completed annually
- Annual third-party penetration testing
- Regular internal security assessments
- FERPA compliance verified annually
- Security awareness training for all employees (quarterly)

## Physical Security
- Data hosted in AWS data centers with SOC 2 physical security controls
- No student data stored on employee devices
- Employee laptops encrypted with full-disk encryption
- Clean desk policy enforced at all office locations
