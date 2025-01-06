from locust import HttpUser, task, between, events
from datetime import datetime, timedelta
import random
import json

class StressTestUser(HttpUser):
    wait_time = between(0.1, 0.5)  # Aggressive timing for stress test
    
    def on_start(self):
        """Set up stress test user."""
        self.email = f"stress_test_{random.randint(1, 1000000)}@example.com"
        self.client.post("/api/auth/signup", json={
            "email": self.email,
            "password": "password123",
            "timePreferences": {
                "morning": "06:00",
                "afternoon": "13:00",
                "evening": "18:00"
            }
        })
        
        response = self.client.post("/api/auth/login", json={
            "email": self.email,
            "password": "password123"
        })
        self.token = response.json()["token"]
        self.headers = {"Authorization": f"Bearer {self.token}"}
    
    @task(5)
    def bulk_habit_creation(self):
        """Create multiple habits at once."""
        habits = []
        for _ in range(10):
            habits.append({
                "name": f"Stress Test Habit {random.randint(1, 1000)}",
                "category": random.choice(["wellness", "learning", "focus", "social"]),
                "is_active": True
            })
        
        with self.client.post("/api/habits/bulk", json=habits, 
                            headers=self.headers, catch_response=True) as response:
            if response.status_code != 201:
                response.failure(f"Failed to create bulk habits: {response.status_code}")
    
    @task(3)
    def complex_query(self):
        """Perform complex data queries."""
        # Get habits with filters and sorting
        params = {
            "category": "wellness",
            "is_active": "true",
            "sort": "streak",
            "order": "desc",
            "limit": 50
        }
        with self.client.get("/api/habits", params=params, 
                           headers=self.headers, catch_response=True) as response:
            if response.status_code != 200:
                response.failure(f"Complex query failed: {response.status_code}")
    
    @task(2)
    def concurrent_updates(self):
        """Test concurrent updates to the same resource."""
        # Get a random habit
        response = self.client.get("/api/habits", headers=self.headers)
        if response.status_code == 200 and response.json():
            habit = random.choice(response.json())
            # Make multiple concurrent updates
            for _ in range(5):
                self.client.put(f"/api/habits/{habit['id']}", json={
                    "name": f"Updated Name {random.randint(1, 1000)}",
                    "is_active": random.choice([True, False])
                }, headers=self.headers)
    
    @task(1)
    def large_data_load(self):
        """Test handling of large data loads."""
        # Create a large number of entries
        entries = []
        base_date = datetime.now()
        for i in range(30):  # 30 days of data
            date = base_date - timedelta(days=i)
            entries.append({
                "date": date.isoformat(),
                "period": "morning",
                "mood": random.randint(1, 5),
                "energy": random.randint(1, 5),
                "notes": "Stress test entry with long text " * 10,
                "focus_score": random.randint(60, 100),
                "completed_tasks": random.randint(0, 10),
                "total_tasks": 10
            })
        
        with self.client.post("/api/entries/bulk", json=entries,
                            headers=self.headers, catch_response=True) as response:
            if response.status_code != 201:
                response.failure(f"Large data load failed: {response.status_code}")
    
    @task(4)
    def rapid_summary_requests(self):
        """Test rapid requests for summary data."""
        endpoints = [
            "/api/summary/daily",
            "/api/summary/weekly",
            "/api/summary/monthly",
            "/api/summary/habits",
            "/api/summary/focus",
            "/api/summary/mood"
        ]
        
        for endpoint in endpoints:
            with self.client.get(endpoint, headers=self.headers,
                               catch_response=True) as response:
                if response.status_code != 200:
                    response.failure(f"Summary request failed: {response.status_code}")

class DataRaceUser(HttpUser):
    wait_time = between(0.01, 0.1)  # Very aggressive timing
    
    @task
    def create_delete_race(self):
        """Create and immediately delete resources to test race conditions."""
        # Create habit
        response = self.client.post("/api/habits", json={
            "name": f"Race Test {random.randint(1, 1000)}",
            "category": "wellness"
        }, headers=self.headers)
        
        if response.status_code == 201:
            habit_id = response.json()["id"]
            # Immediately try to delete it
            self.client.delete(f"/api/habits/{habit_id}", headers=self.headers)
            # And try to update it
            self.client.put(f"/api/habits/{habit_id}", json={
                "name": "Updated Name"
            }, headers=self.headers)

@events.test_start.add_listener
def on_test_start(environment, **kwargs):
    print("Starting stress test...")

@events.test_stop.add_listener
def on_test_stop(environment, **kwargs):
    print("Stress test complete.")
    if environment.stats.total.fail_ratio > 0.01:
        print("Warning: High failure rate detected!")
    
    # Log performance metrics
    print(f"Average response time: {environment.stats.total.avg_response_time}ms")
    print(f"Requests per second: {environment.stats.total.current_rps}")
    print(f"Failure percentage: {environment.stats.total.fail_ratio * 100}%") 