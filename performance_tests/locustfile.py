from locust import HttpUser, task, between
import json
import random

class ProductivityUser(HttpUser):
    wait_time = between(1, 5)  # Wait 1-5 seconds between tasks
    
    def on_start(self):
        # Login at start of simulation
        self.client.post("/login", json={
            "email": f"test_user_{self.user_id}@example.com",
            "password": "test_password"
        })
    
    @task(3)
    def view_dashboard(self):
        self.client.get("/")
    
    @task(2)
    def morning_routine(self):
        self.client.post("/api/habits/morning", json={
            "habits": ["meditation", "exercise", "reading"],
            "notes": "Productive morning!"
        })
    
    @task(2)
    def afternoon_checkin(self):
        self.client.post("/api/habits/afternoon", json={
            "focus_level": random.randint(1, 5),
            "progress_notes": "Making good progress",
            "blockers": "None"
        })
    
    @task(2)
    def evening_review(self):
        self.client.post("/api/habits/evening", json={
            "completed_tasks": ["task1", "task2"],
            "mood": random.randint(1, 5),
            "reflection": "Good day overall"
        })
    
    @task(1)
    def update_preferences(self):
        self.client.put("/api/preferences", json={
            "morning_time": "06:00",
            "afternoon_time": "12:00",
            "evening_time": "18:00"
        })

class AdminUser(HttpUser):
    wait_time = between(2, 5)
    
    def on_start(self):
        # Login as admin
        self.client.post("/login", json={
            "email": "admin@example.com",
            "password": "admin_password"
        })
    
    @task(2)
    def view_metrics(self):
        self.client.get("/admin/metrics")
    
    @task(1)
    def view_user_stats(self):
        self.client.get("/admin/users/stats")
    
    @task(1)
    def generate_reports(self):
        self.client.post("/admin/reports/generate", json={
            "report_type": "user_engagement",
            "time_period": "last_week"
        }) 