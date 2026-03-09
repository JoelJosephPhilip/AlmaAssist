# EduVault — Support & Service Level Agreement

## Support Tiers

### Standard Support (Included)
- **Hours**: Monday–Friday, 8:00 AM – 6:00 PM ET
- **Channels**: Email (support@eduvault.io), Help Desk Portal
- **Response Times**:
  - Critical (P1): 2 hours
  - High (P2): 4 hours
  - Medium (P3): 1 business day
  - Low (P4): 2 business days

### Premium Support (Add-on)
- **Hours**: 24/7/365
- **Channels**: Email, Phone, Dedicated Slack Channel
- **Response Times**:
  - Critical (P1): 30 minutes
  - High (P2): 1 hour
  - Medium (P3): 4 hours
  - Low (P4): 1 business day
- **Dedicated Account Manager**: Named contact for all support needs
- **Quarterly Business Reviews**: Performance and roadmap discussions

## Service Level Agreement

### Uptime Guarantee
EduVault guarantees **99.9% uptime** measured on a monthly basis.

**Uptime Calculation**: ((Total minutes in month - Downtime minutes) / Total minutes in month) × 100

**Exclusions from Downtime**:
- Scheduled maintenance windows (communicated 7 days in advance)
- Force majeure events
- Issues caused by the institution's network or systems
- Beta or preview features

### SLA Credits
If EduVault fails to meet the 99.9% uptime guarantee:

| Monthly Uptime | Service Credit |
|----------------|----------------|
| 99.0% – 99.9% | 10% of monthly fee |
| 95.0% – 99.0% | 25% of monthly fee |
| Below 95.0%    | 50% of monthly fee |

Credits must be requested within 30 days of the incident. Credits are applied to future invoices and do not exceed 50% of the monthly fee.

## Disaster Recovery

### Recovery Objectives
- **Recovery Time Objective (RTO)**: 4 hours
  - Time to restore full service after a major outage
- **Recovery Point Objective (RPO)**: 1 hour
  - Maximum data loss window in a disaster scenario

### Disaster Recovery Plan

#### Backup Strategy
- **Database**: Automated daily backups retained for 35 days
- **Point-in-time recovery**: Available for the last 7 days (5-minute granularity)
- **Cross-region replication**: Real-time replication to US-West-2 (Oregon)
- **File storage**: S3 cross-region replication with versioning enabled

#### Recovery Procedures
1. **Detection**: Automated monitoring detects outage within 5 minutes
2. **Assessment**: On-call engineer assesses impact within 15 minutes
3. **Communication**: Status page updated within 30 minutes; affected institutions notified
4. **Failover**: If primary region is unavailable, traffic is routed to DR region
5. **Recovery**: Services restored from latest backup if needed
6. **Validation**: Full system health check and data integrity verification
7. **Post-mortem**: Root cause analysis published within 5 business days

#### Disaster Recovery Testing
- Full DR failover test conducted semi-annually
- Backup restoration tests conducted quarterly
- Results documented and shared with customers upon request

## Maintenance

### Scheduled Maintenance
- **Window**: Sundays, 2:00 AM – 6:00 AM ET (monthly)
- **Notification**: 7 days advance notice via email and status page
- **Duration**: Typically less than 1 hour
- **Impact**: Brief periods of read-only access; no complete outages

### Emergency Maintenance
- Reserved for critical security patches or system stability issues
- Notification provided as soon as possible (minimum 4 hours when feasible)
- Conducted outside business hours when possible

## Onboarding

### Implementation Timeline
- Standard implementation: 4–6 weeks
- Complex implementation (custom integrations): 8–12 weeks

### Onboarding Includes
- Dedicated implementation project manager
- Data migration assistance (from existing systems)
- SSO configuration support
- Admin training (up to 4 hours)
- End-user training materials and documentation
- Go-live support (2 weeks post-launch)

## Contact

- **Support Email**: support@eduvault.io
- **Support Portal**: https://help.eduvault.io
- **Status Page**: https://status.eduvault.io
- **Security Issues**: security@eduvault.io
- **Sales**: sales@eduvault.io
