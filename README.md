# Campus System Monitoring Platform
```text
The system that monitor physical laptop and desktop computers deployed across all Otukpo campus clusters. A cluster is primarily a location/grouping. The actual monitored object is the individual computer.
```
---

# 1. Project Overview

The system will monitor **physical laptop and desktop computers** deployed across campus clusters.

A cluster is primarily a **location/grouping**. The actual monitored object is the individual computer.

The platform handles:

1. How many computers are registered?
2. How many computers are currently online?
3. How many are currently offline?
4. How many computers are currently being used?
5. Which user is logged into a computer?
6. Which computers are idle or available?
7. Which computers have reported or detected issues?
8. How long has a computer been online/offline?
9. What is the historical uptime/downtime?
10. What issues were reported, who is handling them, and whether they were resolved?

---

# 2. Core Architecture

```text
                         CAMPUS
                           |
                    +------+---------+
                    |                |
                Cluster 1           Cluster 2
                    |                |
             +---------+-------------+----------+
             |         |             |           |
        c1t1s1PC-001 c1t1s2PC-002 c2t1s3PC-003 c1t1s4PC-004
             |      |      |     |
          Agent   Agent   Agent Agent
             \      |      |     /
              \     |      |    /
               +----+------+---+
                        |
                   HTTPS / API
                        |
                 +------+------+
                 | Go Backend |
                 +------+------+
                        |
                 +------+------+
                 | PostgreSQL |
                 +------------+

                        |
                 +------+------+
                 | Web Dashboard|
                 +-------------+
```

The main components are:

- **Monitoring Agent** — installed on each laptop/desktop.
- **Go Backend/API** — central server and business logic.
- **PostgreSQL** — persistent data storage.
- **Web Dashboard** — administrators/operators monitor systems and manage issues.
- **Authentication/Authorization** — controls who can access and manage the platform.

---

# 3. Team of Three

The team may use different programming languages. That is acceptable.

## Member 1 — Go Backend

Primary responsibilities:

```text
backend/
├── Authentication
├── System registration
├── Agent authentication
├── Heartbeat API
├── Online/offline status
├── User sessions
├── Issue management
├── Reports/statistics
├── REST API
└── Live dashboard updates
```

Recommended language: **Go**

---

## Member 2 — Monitoring Agent

Primary responsibilities:

```text
agent/
├── System identity
├── Computer information
├── OS information
├── Current user/session
├── Login/logout detection
├── Active/idle state
├── CPU/memory/disk information
├── Heartbeat
├── Server communication
└── Agent self-health
```

Recommended language: **Go or Python**.

The agent language does not matter as long as it follows the agreed API contract.

---

## Member 3 — Frontend / Dashboard

Primary responsibilities:

```text
frontend/
├── Login
├── Dashboard
├── System list
├── Cluster view
├── System details
├── User/session view
├── Issue reporting
├── Issue management
├── Reports
└── Live status
```

The frontend communicates with the Go backend through the API.

---

# 4. Communication Rule

The team must communicate through **contracts**, not shared implementation details.

For example:

```text
Python Agent
     |
     | POST /api/v1/heartbeat
     v
Go Backend
     |
     v
PostgreSQL
```

The Python developer does not need to know how the Go backend is implemented.

The frontend developer does not need to know how the agent works.

Everyone only needs to agree on:

- Endpoint
- HTTP method
- Authentication
- Request format
- Response format
- Error format
- Required fields
- Optional fields

---

# 5. Primary Concepts

The system should distinguish these concepts clearly.

## 5.1 Campus

The organization/site being monitored.

## 5.2 Cluster

A physical or administrative grouping/location.

Example:

```text
Engineering Cluster
Science Cluster
Library Cluster
```

## 5.3 System

An actual laptop or desktop.

Example:

```text
SYS-000001
SYS-000002
SYS-000003
```

The **system is the primary monitored object**.

## 5.4 Agent

Software installed on a system that communicates with the backend.

## 5.5 User

A person authenticated into the platform or campus environment.

## 5.6 Session

A period during which a user is logged into/using a monitored system.

## 5.7 Heartbeat

A periodic message from an agent saying:

> This computer is alive and communicating with the server.

## 5.8 Issue

A problem reported by a person or detected automatically.

---

# 6. System Identity

Every monitored computer must have a stable internal identity.

Example:

```text
System ID:       SYS-000001
System Code:     LAB-A-PC-001
Hostname:        LAB-A-01
Device Type:     Desktop
Operating System: Linux
Cluster:         Cluster A
```

Do not rely only on:

- IP address
- hostname
- MAC address

These can change or create operational problems.

The platform should issue or maintain a stable `system_id`.

---

# 7. System Registration

Preferred workflow:

```text
Install Agent
      |
      v
Agent contacts server
      |
      v
Server sees NEW SYSTEM
      |
      v
Admin reviews system
      |
      v
Admin approves
      |
      v
Assign Cluster + Location
      |
      v
Monitoring begins
```

This is better than manually entering hundreds of systems.

A system should have a registration state such as:

```text
PENDING
ACTIVE
SUSPENDED
RETIRED
```

---

# 8. Agent Responsibilities

The monitoring agent should perform only legitimate operational monitoring.

It may collect:

```text
System ID
Hostname
OS
OS version
Agent version
CPU usage
Memory usage
Disk usage
Network connectivity
Current logged-in OS user/session
Login/logout state
Last user activity/idle state
Heartbeat timestamp
```

The agent should NOT collect unnecessary private information.

Do not implement:

- keylogging
- password collection
- screenshots by default
- private message collection
- browser history collection
- unnecessary file inspection

The project should follow the campus's privacy, security, and acceptable-use policies.

---

# 9. Heartbeat System

The agent periodically sends a heartbeat.

Example:

```text
Every 30 seconds

Agent
  |
  | heartbeat
  v
Backend
```

Example request:

```json
{
  "system_id": "SYS-000001",
  "timestamp": "2026-09-08T15:40:30Z",
  "cpu_percent": 34.5,
  "memory_percent": 61.2,
  "disk_percent": 72.1,
  "session_status": "active"
}
```

The exact interval should be configurable.

Recommended initial value:

```text
Heartbeat interval: 30 seconds
```

---

# 10. Online/Offline Detection

The backend, not the agent, should decide whether a system is offline.

Example:

```text
Heartbeat interval: 30 seconds
Offline threshold:  2 minutes
```

If heartbeats continue:

```text
15:40:00  heartbeat
15:40:30  heartbeat
15:41:00  heartbeat
15:41:30  heartbeat

STATUS = ONLINE
```

If communication stops:

```text
15:42:00  no heartbeat
15:42:30  no heartbeat
15:43:00  no heartbeat
15:43:30  no heartbeat

STATUS = OFFLINE
```

The threshold should be configurable rather than hard-coded everywhere.

---

# 11. Important Status Distinction

Do not use only `online/offline`.

Recommended system states:

```text
PENDING
ONLINE
OFFLINE
MAINTENANCE
SUSPENDED
RETIRED
```

User/session state should be separate:

```text
NO_USER
LOGGED_IN_ACTIVE
LOGGED_IN_IDLE
LOGGED_OUT
```

Issue state should also be separate:

```text
OPEN
ACKNOWLEDGED
IN_PROGRESS
RESOLVED
CLOSED
```

This prevents one status field from becoming confusing.

---

# 12. User Session Tracking

The platform should distinguish:

```text
Computer is online
```

from:

```text
Someone is logged in
```

and:

```text
Someone is actively using it
```

Example:

```text
PC-001
Computer: ONLINE
User: James
Session: LOGGED_IN
Activity: ACTIVE
```

Another:

```text
PC-002
Computer: ONLINE
User: NONE
Session: LOGGED_OUT
Activity: NONE
```

Another:

```text
PC-003
Computer: ONLINE
User: Mary
Session: LOGGED_IN
Activity: IDLE
```

---

# 13. Session History

Record session events.

Example:

```text
User:       James
System:     SYS-001
Login:      10:15 AM
Logout:     12:42 PM
Duration:   2h 27m
```

This allows reports such as:

- Who is currently logged in?
- Which systems are currently occupied?
- How long was a system used?
- Who used a system during a particular period?

Only collect information necessary for the approved campus use case.

---

# 14. Issue Reporting

A user/operator should be able to report an issue directly from a system.

Example:

```text
PC-005
   |
   +-- Report Issue
```

The system should automatically attach:

```text
System ID
Cluster
Location
Reporter
Timestamp
```

The reporter enters:

```text
Issue type
Title
Description
Priority
```

Example:

```text
System:    SYS-005
Issue:     Keyboard not working
Priority:  HIGH
Status:    OPEN
```

---

# 15. Automatic Issues

The backend may also create issues from detected conditions.

Examples:

```text
No heartbeat for configured threshold
        |
        v
System offline incident
```

```text
Disk > 95%
        |
        v
Low disk space warning
```

```text
Memory > 95% for sustained period
        |
        v
Performance warning
```

Automatic detection should use configurable thresholds.

---

# 16. Issue Lifecycle

```text
OPEN
  |
  v
ACKNOWLEDGED
  |
  v
IN_PROGRESS
  |
  v
RESOLVED
  |
  v
CLOSED
```

An issue should retain its history.

Example:

```text
10:32 AM  Reported
10:40 AM  Acknowledged
11:05 AM  Assigned
11:50 AM  Resolved
12:00 PM  Closed
```

---

# 17. Suggested Database Structure

This is an initial conceptual model. Do not create migrations until the team reviews and agrees on it.

```text
campuses
---------
id
name
created_at
updated_at


clusters
--------
id
campus_id
name
location
status
created_at
updated_at


systems
-------
id
cluster_id
system_code
hostname
device_type
operating_system
os_version
agent_version
status
last_seen_at
registered_at
updated_at


agents
------
id
system_id
agent_version
last_seen_at
status
created_at
updated_at


users
-----
id
name
username/email
role
status
created_at
updated_at


sessions
--------
id
system_id
user_id
login_at
logout_at
last_activity_at
status


heartbeats
----------
id
system_id
received_at
cpu_percent
memory_percent
disk_percent
network_status


issues
------
id
system_id
reported_by
issue_type
title
description
priority
status
assigned_to
reported_at
resolved_at
closed_at


issue_updates
-------------
id
issue_id
user_id
action
comment
created_at
```

This is **conceptual**, not the final migration.

---

# 18. Relationship Model

```text
Campus
  |
  +---- Cluster
           |
           +---- System
                   |
                   +---- Agent
                   |
                   +---- Heartbeats
                   |
                   +---- Sessions
                   |
                   +---- Issues

User
  |
  +---- Sessions
  |
  +---- Issues
  |
  +---- Issue Updates
```

---

# 19. API Structure

Use versioned APIs.

```text
/api/v1/
```

Suggested endpoints:

## Authentication

```text
POST /api/v1/auth/login
POST /api/v1/auth/logout
GET  /api/v1/auth/me
```

## Systems

```text
GET    /api/v1/systems
GET    /api/v1/systems/{id}
POST   /api/v1/systems/{id}/approve
PATCH  /api/v1/systems/{id}
```

## Agent

```text
POST /api/v1/agents/register
POST /api/v1/agents/heartbeat
POST /api/v1/agents/session
```

## Dashboard

```text
GET /api/v1/dashboard/summary
GET /api/v1/dashboard/systems
GET /api/v1/dashboard/issues
```

## Issues

```text
POST  /api/v1/issues
GET   /api/v1/issues
GET   /api/v1/issues/{id}
PATCH /api/v1/issues/{id}
POST  /api/v1/issues/{id}/updates
```

## Clusters

```text
GET /api/v1/clusters
GET /api/v1/clusters/{id}
```

---

# 20. API Contract

Before implementation, create:

```text
docs/
└── API.md
```

Every endpoint should document:

```text
Method
URL
Authentication
Request
Response
Errors
Example
```

Example:

```text
POST /api/v1/agents/heartbeat

Authentication:
Agent token

Request:
{
  "system_id": "SYS-001",
  "timestamp": "...",
  "cpu_percent": 30.2,
  "memory_percent": 61.1
}

Response:
{
  "success": true,
  "system_status": "online"
}
```

---

# 21. Agent Authentication

Agents must authenticate with the backend.

Do not allow:

```text
POST /heartbeat
```

from completely unauthenticated random clients.

Possible design:

```text
System registration
       |
       v
Server issues agent credential
       |
       v
Agent stores credential securely
       |
       v
Every heartbeat is authenticated
```

Credentials must not be hard-coded into source code.

The exact credential mechanism should be agreed upon before implementation.

---

# 22. Security Requirements

Minimum requirements:

- HTTPS in production.
- Passwords stored using secure password hashing.
- Agent credentials protected.
- Role-based authorization.
- Input validation.
- Request authentication.
- Rate limiting where appropriate.
- Audit logs for administrative actions.
- Secrets stored in environment/configuration management.
- No credentials committed to Git.
- Database credentials never stored in frontend code.

---

# 23. Dashboard Requirements

The main dashboard should show:

```text
TOTAL SYSTEMS
ONLINE
OFFLINE
IN USE
AVAILABLE
ISSUES
```

Example:

```text
Total Systems:     500
Online:            462
Offline:            31
In Use:             82
Available:          55
Open Issues:         7
```

The numbers should be calculated from actual backend data.

---

# 24. Cluster Dashboard

Example:

```text
Cluster A
-------------------------
Total:       120
Online:      114
Offline:       6
In Use:       71
Issues:        3
```

The dashboard should allow administrators to drill down:

```text
Campus
  -> Cluster
      -> System
          -> Session
          -> Health
          -> Issues
          -> History
```

---

# 25. System Details Page

Each system should have a page such as:

```text
PC-001
--------------------------------
System ID:       SYS-000001
Cluster:         Cluster A
Location:        Lab 1

Status:          ONLINE
Last Seen:       15:40:30

Current User:    James
Session:         ACTIVE

CPU:             34%
Memory:          61%
Disk:            72%

Agent Version:   1.0.0

[Report Issue]
[View Sessions]
[View Health History]
[View Issues]
```

---

# 26. Availability Calculations

The system should eventually calculate:

```text
Current availability
Daily uptime
Weekly uptime
Monthly uptime
Downtime duration
Number of outages
```

Example:

```text
Daily uptime = total online time / total monitored time × 100
```

Be careful to define exactly how maintenance periods and intentionally powered-off systems affect the calculation.

---

# 27. Live Dashboard Updates

The first version can use normal HTTP polling.

Example:

```text
Frontend
   |
   | GET dashboard
   v
Backend
```

Later, use:

```text
WebSocket
```

or another server-push mechanism for live status changes.

Do not introduce WebSockets before the basic monitoring flow works.

---

# 28. Recommended Development Phases

## Phase 1 — Foundation

Build:

```text
Database
Go API
Authentication
System registration
Basic dashboard
```

Goal:

> Register and view systems.

---

## Phase 2 — Agent + Heartbeat

Build:

```text
Agent
Heartbeat endpoint
Last-seen tracking
Online/offline detection
```

Goal:

> Know which computers are actually alive.

---

## Phase 3 — User Sessions

Build:

```text
Login detection
Logout detection
Active/idle state
Session history
```

Goal:

> Know whether a computer is being used and by whom, subject to approved privacy rules.

---

## Phase 4 — Issue Management

Build:

```text
Report issue
Issue list
Issue assignment
Issue status
Issue history
Resolution
```

Goal:

> Make it easy to report and resolve computer problems.

---

## Phase 5 — Dashboard + Reports

Build:

```text
Statistics
Cluster reports
Availability
Uptime/downtime
Issue reports
Usage reports
```

Goal:

> Turn monitoring data into useful management information.

---

## Phase 6 — Advanced Monitoring

Only after the MVP is stable:

```text
Automatic issue detection
Alerts
Thresholds
WebSockets
Agent auto-update
Advanced analytics
```

---

# 29. Git Repository Structure

Suggested repository:

```text
campus-monitor/
│
├── backend/
│   ├── cmd/
│   ├── internal/
│   │   ├── auth/
│   │   ├── systems/
│   │   ├── clusters/
│   │   ├── agents/
│   │   ├── heartbeats/
│   │   ├── sessions/
│   │   ├── issues/
│   │   └── dashboard/
│   ├── migrations/
│   └── go.mod
│
├── agent/
│   ├── cmd/
│   ├── internal/
│   │   ├── identity/
│   │   ├── system/
│   │   ├── session/
│   │   ├── activity/
│   │   └── client/
│   └── README.md
│
├── frontend/
│   ├── pages/
│   ├── assets/
│   ├── css/
│   └── js/
│
├── docs/
│   ├── ARCHITECTURE.md
│   ├── API.md
│   ├── DATABASE.md
│   ├── AGENT.md
│   ├── SECURITY.md
│   └── CONTRIBUTING.md
│
├── .env.example
├── .gitignore
└── README.md
```

If the team chooses a Python agent:

```text
agent/
├── app/
├── system/
├── session/
├── activity/
├── network/
└── requirements.txt
```

The API contract remains the same.

---

# 30. Git Team Workflow

Use feature branches.

Example:

```text
main
 |
 +-- feature/heartbeat-api
 +-- feature/system-agent
 +-- feature/dashboard
 +-- feature/issues
```

Do not push unfinished experimental code directly to `main`.

Before merging:

```text
git pull
run tests
review changes
fix conflicts
merge
```

---

# 31. Team Agreement Before Coding

The team must agree on:

### Architecture

- Go backend?
- Python or Go agent?
- PostgreSQL?
- Frontend technology?

### Monitoring

- Heartbeat interval?
- Offline threshold?
- What metrics are collected?

### Identity

- How are systems registered?
- How are systems approved?
- How is a system permanently identified?

### Users

- What authentication system is used?
- What does "user logged in" mean?
- What privacy rules apply?

### Issues

- Issue categories?
- Priority levels?
- Assignment?
- Resolution workflow?

### Security

- Agent authentication?
- User authentication?
- Roles?
- HTTPS?

### Data retention

- How long are heartbeats retained?
- How long are sessions retained?
- How long are issue records retained?

---

# 32. Important Architecture Rule

Do not create database tables simply because a feature sounds useful.

Before changing the schema, the team should discuss:

1. Current structure
2. Proposed change
3. Reason
4. Alternatives
5. Trade-offs
6. Impact on backend/frontend/agent
7. Agreement

Then implement the migration.

This prevents technical debt.

---

# 33. MVP Definition

The first working version should be able to do this:

```text
1. Admin logs in
        ↓
2. Agent registers computer
        ↓
3. Admin approves computer
        ↓
4. Computer appears on dashboard
        ↓
5. Agent sends heartbeat
        ↓
6. Dashboard shows ONLINE
        ↓
7. Computer stops sending heartbeat
        ↓
8. Backend detects OFFLINE
        ↓
9. User can be detected as logged in/out
        ↓
10. Operator reports an issue
        ↓
11. Support person handles issue
        ↓
12. Issue is resolved
```

If these work reliably, you have a meaningful MVP.

---

# 34. Example End-to-End Flow

```text
                    PC-001
                      |
                Campus Agent
                      |
               "I am alive"
                      |
                      v
                 Go Backend
                      |
            +---------+---------+
            |                   |
            v                   v
       PostgreSQL            Dashboard
            |                   |
            |              ONLINE 🟢
            |
       User session
            |
        James logged in
            |
            v
      Session recorded
            |
            v
       Issue detected
            |
            v
      Issue created
            |
            v
       Support team
            |
            v
        RESOLVED
```

---

# 35. Final Team Principle

The project is not:

> "A Go project" or "a Python project."

It is a **distributed monitoring system**.

Go, Python, JavaScript, or another language is simply an implementation detail.

The shared foundation is:

```text
                    API CONTRACT
                         |
        +----------------+----------------+
        |                |                |
     Backend            Agent          Frontend
       Go           Go or Python       Any agreed UI
        |                |                |
        +----------------+----------------+
                         |
                    PostgreSQL
```

The team should therefore prioritize:

**clear architecture → clear API contract → clear data model → implementation → testing → integration.**

---

# 36. First Tasks for the Team

Before writing production code:

### Task 1
Agree on the architecture in this document.

### Task 2
Agree on the exact data collected by the agent.

### Task 3
Agree on heartbeat interval and offline threshold.

### Task 4
Agree on system registration and approval.

### Task 5
Agree on user/session definition and privacy rules.

### Task 6
Design and approve the database schema.

### Task 7
Write `docs/API.md`.

### Task 8
Build the smallest vertical slice:

```text
Agent
  ↓
Heartbeat API
  ↓
PostgreSQL
  ↓
Dashboard
  ↓
ONLINE/OFFLINE
```

Only after this works should the team expand into sessions, issues, reporting, and advanced monitoring.

---

# Conclusion

The recommended architecture allows a 3-person team using both **Go and Python** to work together without forcing everyone into one language.

The most important rule is:

> **Agree on the contracts and architecture first; let each team member choose the appropriate implementation language for their component.**

The computer is the primary monitored object. Clusters provide organization and location. Agents provide telemetry. The Go backend provides the central business logic. PostgreSQL stores the system's state and history. The dashboard turns that information into something administrators can understand and act upon.