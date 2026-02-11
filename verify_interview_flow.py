
import requests
import sys

BASE_URL = "http://127.0.0.1:8000"

def register_user(email, password, role):
    try:
        # Try login first
        response = requests.post(f"{BASE_URL}/auth/token", data={"username": email, "password": password})
        if response.status_code == 200:
            print(f"User {email} already exists. Logging in.")
            return response.json()["access_token"]
        
        # Register
        print(f"Registering {email}...")
        response = requests.post(f"{BASE_URL}/auth/register", json={"email": email, "password": password, "role": role})
        if response.status_code != 200:
            print(f"Registration failed: {response.text}")
            return None
        
        # Login
        response = requests.post(f"{BASE_URL}/auth/token", data={"username": email, "password": password})
        return response.json()["access_token"]
    except Exception as e:
        print(f"Error authenticating {email}: {e}")
        return None

def main():
    print("Starting Verification...")
    
    # 1. Setup Users
    employer_token = register_user("emp_verify@test.com", "password123", "employer")
    seeker_token = register_user("seek_verify@test.com", "password123", "seeker")
    
    if not employer_token or not seeker_token:
        print("Failed to authenticate users.")
        return

    employer_headers = {"Authorization": f"Bearer {employer_token}"}
    seeker_headers = {"Authorization": f"Bearer {seeker_token}"}

    # 2. Employer details (create profile if needed)
    requests.post(f"{BASE_URL}/employer-profile/", headers=employer_headers, json={"company_name": "Verify Corp"})
    
    # 3. Post Job
    print("Posting Job...")
    job_data = {
        "title": "Verification Engineer",
        "description": "Test job",
        "requirements": "None",
        "location": "Remote",
        "salary_range": "$100k",
        "job_type": "Full-time",
        "experience_level": "Entry Level"
    }
    resp = requests.post(f"{BASE_URL}/jobs/", headers=employer_headers, json=job_data)
    if resp.status_code != 200:
        print(f"Failed to post job: {resp.text}")
        return
    job_id = resp.json()["id"]
    print(f"Job Posted: {job_id}")

    # 4. Seeker Apply
    print("Seeker Applying...")
    # Use PUT /me to create/update profile
    resp_prof = requests.put(f"{BASE_URL}/seeker-profile/me", headers=seeker_headers, json={"first_name": "Verify", "last_name": "Seeker"})
    print(f"Seeker Profile Create Resp: {resp_prof.status_code}")
    
    resp = requests.post(f"{BASE_URL}/applications/", headers=seeker_headers, json={"job_id": job_id})
    if resp.status_code != 200:
        # Check if already applied
        if "already applied" in resp.text:
            print("Already applied.")
            # We need application ID. 
            # Seeker can get my applications.
            resp = requests.get(f"{BASE_URL}/applications/me", headers=seeker_headers)
            apps = resp.json()
            # Find the app for this job
            app = next((a for a in apps if a["job_id"] == job_id), None)
            if not app:
                print("Could not find application.")
                return
            application_id = app["id"]
        else:
            print(f"Failed to apply: {resp.text}")
            return
    else:
        application_id = resp.json()["id"]
    print(f"Application Created: {application_id}")

    # 5. Employer Schedule Interview
    print("Scheduling Interview...")
    import datetime
    import random
    # Generate a random future time to avoid overlap
    future_day = random.randint(1, 30)
    start_hour = random.randint(9, 17)
    start_time = datetime.datetime.now() + datetime.timedelta(days=future_day)
    start_time = start_time.replace(hour=start_hour, minute=0, second=0, microsecond=0)
    end_time = start_time + datetime.timedelta(hours=1)
    
    interview_data = {
        "application_id": application_id,
        "title": "Initial Tech Screen",
        "description": "Discuss verification",
        "start_time": start_time.isoformat(),
        "end_time": end_time.isoformat(),
        "location": "Zoom"
    }
    # Need to find endpoint. `routers/interviews.py` -> `create_interview` -> POST /interviews/
    resp = requests.post(f"{BASE_URL}/interviews/", headers=employer_headers, json=interview_data)
    if resp.status_code != 200:
        print(f"Failed to schedule interview: {resp.text}")
        return
    interview = resp.json()
    interview_id = interview["id"]
    print(f"Interview Scheduled: {interview_id}, Status: {interview['status']}")

    # 6. Verify Notification for Seeker
    print("Checking Seeker Notifications...")
    resp = requests.get(f"{BASE_URL}/notifications/", headers=seeker_headers)
    notifs = resp.json()
    has_invite = any("New Interview Invitation" in n["title"] for n in notifs)
    if has_invite:
        print("PASS: Seeker received notification.")
    else:
        print("FAIL: Seeker did not receive notification.")

    # 7. Seeker Respond (Reschedule)
    print("Seeker Requesting Reschedule...")
    # Create a new interview for reschedule test or just use the existing one?
    # Let's use the existing one.
    resp = requests.put(f"{BASE_URL}/interviews/{interview_id}/respond?status=reschedule_requested", headers=seeker_headers)
    if resp.status_code != 200:
        print(f"Failed to respond: {resp.text}")
        return
    updated_interview = resp.json()
    print(f"Interview Status: {updated_interview['status']}")
    
    if updated_interview['status'] == 'reschedule_requested':
        print("PASS: status updated to reschedule_requested.")
    else:
        print("FAIL: status not updated.")

    # 8. Verify Notification for Employer (Reschedule)
    print("Checking Employer Notifications...")
    resp = requests.get(f"{BASE_URL}/notifications/", headers=employer_headers)
    notifs = resp.json()
    has_reschedule = any("Interview Reschedule Requested" in n["title"] for n in notifs)
    if has_reschedule:
        print("PASS: Employer received reschedule notification.")
    else:
        print("FAIL: Employer did not receive reschedule notification. (Check title format)")

    print("Verification Verification Complete.")

if __name__ == "__main__":
    main()
