
# 🎯 **Therapy Management System**  

A streamlined platform to manage therapists, supervisors, patients, and their sessions, promoting better organization and efficient care delivery. Whether you're assigning therapists, tracking sessions, or generating performance reports, this system has got you covered!  

---

## 🌟 **Key Features**  

- **Effortless Therapist Management**  
  Organize therapists with ease by tracking their availability, assigned patients, and feedback from supervisors.  

- **Powerful Supervisor Insights**  
  Supervisors oversee therapists, provide constructive feedback, and generate reports to monitor performance.  

- **Personalized Patient Care**  
  Assign therapists, track sessions, and ensure patients receive the attention they deserve.  

- **Session Logs for Transparency**  
  Keep a detailed history of sessions with comments and timestamps to enhance accountability.  

---

## 🗂 **File Overview**  

### **1. Therapist Model (`TherapistModel.js`)**  
Represents the lifeline of therapy delivery—our therapists!  
- **Fields**:  
  - **email** & **password**: Therapist's login credentials (required).  
  - **supervisorIds**: Tracks the assigned supervisor(s).  
  - **assignedPatients**: Manages patients under their care.  
  - **startTime** & **endTime**: Defines their work hours.  
  - **commentsFromSupervisor**: Stores feedback from supervisors, with timestamps.  
- **Purpose**:  
  - Tracks availability, responsibilities, and performance.  
  - Bridges therapists with supervisors and patients.  

---

### **2. Supervisor Model (`SupervisorModel.js`)**  
The command center for managing therapists and maintaining quality care.  
- **Fields**:  
  - **email** & **password**: Supervisor's login credentials (required).  
  - **therapistIds**: Tracks therapists under their supervision.  
  - **reports**: Generates in-depth performance reports for therapists, including:  
    - Therapist performance metrics.  
    - Patient interactions.  
    - Supervisor comments.  
- **Purpose**:  
  - Ensures therapists deliver top-notch care.  
  - Tracks metrics to maintain high service standards.  

---

### **3. Patient Model (`PatientModel.js`)**  
Patients are the heart of the system, and this file keeps them at the forefront.  
- **Fields**:  
  - **name**, **email**, & **password**: Patient credentials (required).  
  - **therapistId**: Assigns a dedicated therapist (required).  
  - **noOfSessions**: Counts attended sessions.  
  - **sessionLogs**: Records session histories, including:  
    - Session IDs and details.  
- **Purpose**:  
  - Tracks patient progress.  
  - Facilitates seamless therapist-patient interactions.  

---

### **4. Session Model (`SessionModel.js`)**  
The ultimate session recorder—because every interaction counts!  
- **Fields**:  
  - **patientId** & **therapistId**: Links sessions to participants (required).  
  - **comments**: Stores session-specific feedback.  
  - **timestamp**: Automatically records the session date and time.  
- **Purpose**:  
  - Captures therapy interactions for transparency.  
  - Enables detailed review and follow-up on sessions.  

---

## 🛠 **How It Works**  

1. **Therapist Management**  
   - Supervisors assign therapists to patients.  
   - Working hours and responsibilities are monitored.  

2. **Supervisor Oversight**  
   - Supervisors track therapist performance via reports.  
   - Feedback mechanisms ensure continuous improvement.  

3. **Patient Tracking**  
   - Patients are linked to therapists for personalized care.  
   - Session histories provide insights into progress.  

4. **Session Management**  
   - Each session is logged with comments and timestamps.  
   - Data links therapists and patients for easy referencing.  

---

## 🤝 **Entity Relationships**  

Here’s how the system connects everything together:  
- **Therapists**: Supervised by a **Supervisor** and serve multiple **Patients**.  
- **Supervisors**: Manage multiple **Therapists** and track their performance.  
- **Patients**: Assigned to a **Therapist** and attend multiple **Sessions**.  
- **Sessions**: Record the interaction between a **Patient** and a **Therapist**.  

---

## 🚀 **Why This System?**  

1. **Efficiency**: Clear assignments and responsibilities make management a breeze.  
2. **Transparency**: Detailed session logs and supervisor reports for accountability.  
3. **Scalability**: Seamlessly expand to include more users or features.  
4. **Insightful Data**: Meaningful metrics to improve care quality.  

---

## 🏁 **Getting Started**  

### Installation  
1. Clone the repository:  
   ```bash  
   git clone <repository-url>  
   ```  
2. Navigate to the project folder:  
   ```bash  
   cd therapy-management-system  
   ```  
3. Install dependencies:  
   ```bash  
   npm install  
   ```  

### Running the Application  
1. Start the server:  
   ```bash  
   node server.js  
   ```  
2. Use the provided APIs to manage therapists, supervisors, patients, and sessions.  

---

