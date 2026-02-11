import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from ..config import settings

def send_email(to_email: str, subject: str, body_html: str, reply_to: str = None, from_name: str = None):
    """
    Sends an email using SMTP.
    If SMTP_USER is not set, it logs the email to console for development.
    """
    if not settings.SMTP_USER or not settings.SMTP_PASSWORD or settings.SMTP_PASSWORD == "your_16_character_app_password_here":
        print(f"--- DEVELOPMENT MODE: EMAIL LOG ---")
        print(f"To: {to_email}")
        if reply_to: print(f"Reply-To: {reply_to}")
        print(f"Subject: {subject}")
        print(f"Body: {body_html}")
        print(f"-----------------------------------")
        return True

    try:
        msg = MIMEMultipart()
        display_name = from_name or settings.EMAILS_FROM_NAME
        msg['From'] = f"{display_name} <{settings.EMAILS_FROM_EMAIL}>"
        msg['To'] = to_email
        msg['Subject'] = subject
        
        if reply_to:
            msg['Reply-To'] = reply_to

        msg.attach(MIMEText(body_html, 'html'))

        server = smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT)
        server.starttls()
        server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
        text = msg.as_string()
        server.sendmail(settings.EMAILS_FROM_EMAIL, to_email, text)
        server.quit()
        return True
    except Exception as e:
        print(f"Failed to send email: {e}")
        return False

def send_job_alert(to_email: str, job_title: str, company_name: str, job_id: int):
    subject = f"New Job Alert: {job_title} at {company_name}"
    job_url = f"http://localhost:5173/jobs/{job_id}"
    
    body = f"""
    <html>
        <body>
            <h2 style="color: #4f46e5;">New Job Match!</h2>
            <p>Hello,</p>
            <p>A new job has been posted that matches your profile and preferences.</p>
            <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0;">
                <h3 style="margin-top: 0;">{job_title}</h3>
                <p><strong>Company:</strong> {company_name}</p>
                <a href="{job_url}" style="background-color: #4f46e5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">View Job Details</a>
            </div>
            <p>Best regards,<br>The AfriTalent Team</p>
        </body>
    </html>
    """
    return send_email(to_email, subject, body)

def send_interview_alert(to_email: str, job_title: str, company_name: str, start_time: str, location: str, status: str = "scheduled", reply_to: str = None):
    """
    Sends an email notification for interview scheduling or updates.
    """
    status_msg = "scheduled" if status == "scheduled" else "updated"
    subject = f"Interview {status_msg.capitalize()}: {job_title} at {company_name}"
    
    body = f"""
    <html>
        <body>
            <h2 style="color: #4f46e5;">Interview {status_msg.capitalize()}</h2>
            <p>Hello,</p>
            <p>An interview has been {status_msg} for the position of <strong>{job_title}</strong> at <strong>{company_name}</strong>.</p>
            <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0;">
                <p><strong>Time:</strong> {start_time}</p>
                <p><strong>Location/Link:</strong> {location}</p>
            </div>
            <p>Please log in to the platform to confirm or manage your interview.</p>
            <p>Best regards,<br>The AfriTalent Team</p>
        </body>
    </html>
    """
    return send_email(to_email, subject, body, reply_to=reply_to, from_name=company_name)

def send_application_status_alert(to_email: str, job_title: str, company_name: str, status: str, reply_to: str = None):
    """
    Sends an email notification when the application status changes (Hired, Rejected, etc.).
    """
    subject = f"Application Update: {job_title} at {company_name}"
    
    status_color = "#4f46e5" # default
    if status.lower() == "hired":
        status_color = "#059669" # green
        status_text = "Congratulations! Your application status has been updated to <strong>Hired</strong>."
    elif status.lower() == "rejected":
        status_color = "#dc2626" # red
        status_text = "Thank you for your interest. Your application status for this position has been updated."
    else:
        status_text = f"Your application status for this position has been updated to: <strong>{status}</strong>."

    body = f"""
    <html>
        <body>
            <h2 style="color: {status_color};">Application Update</h2>
            <p>Hello,</p>
            <p>{status_text}</p>
            <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0;">
                <h3 style="margin-top: 0;">{job_title}</h3>
                <p><strong>Company:</strong> {company_name}</p>
            </div>
            <p>Please log in to the platform for more details.</p>
            <p>Best regards,<br>The AfriTalent Team</p>
        </body>
    </html>
    """
    return send_email(to_email, subject, body, reply_to=reply_to, from_name=company_name)

def send_new_applicant_alert(to_email: str, job_title: str, applicant_name: str, applicant_id: int):
    """
    Sends an email to the employer when a new seeker applies for their job.
    """
    subject = f"New Applicant: {applicant_name} applied for {job_title}"
    app_url = f"http://localhost:5173/employer/candidates" 
    
    body = f"""
    <html>
        <body>
            <h2 style="color: #4f46e5;">New Job Application</h2>
            <p>Hello,</p>
            <p><strong>{applicant_name}</strong> has just applied for your job posting: <strong>{job_title}</strong>.</p>
            <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0;">
                <p>Visit your dashboard to review their profile and match score.</p>
                <a href="{app_url}" style="background-color: #4f46e5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">View Applications</a>
            </div>
            <p>Best regards,<br>The AfriTalent Team</p>
        </body>
    </html>
    """
    return send_email(to_email, subject, body, from_name="AfriTalent Hiring")

def send_interview_response_alert(to_email: str, seeker_name: str, job_title: str, status: str, notes: str = None):
    """
    Sends an email to the employer when a seeker responds to an interview invite.
    """
    status_text = status.replace('_', ' ').capitalize()
    subject = f"Interview Response: {seeker_name} has {status_text}"
    
    notes_html = f"<p><strong>Seeker Notes:</strong> {notes}</p>" if notes else ""
    
    body = f"""
    <html>
        <body>
            <h2 style="color: #4f46e5;">Interview Response</h2>
            <p>Hello,</p>
            <p><strong>{seeker_name}</strong> has <strong>{status_text}</strong> your interview invitation for the position <strong>{job_title}</strong>.</p>
            {notes_html}
            <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0;">
                <p>Please log in to your dashboard to manage your schedule.</p>
                <a href="http://localhost:5173/employer/interviews" style="background-color: #4f46e5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Manage Interviews</a>
            </div>
            <p>Best regards,<br>The AfriTalent Team</p>
        </body>
    </html>
    """
    return send_email(to_email, subject, body, from_name="AfriTalent Interviews")

