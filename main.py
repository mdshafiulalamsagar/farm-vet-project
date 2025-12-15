from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import mysql.connector
from passlib.context import CryptContext
import os

app = FastAPI()

# 1. CORS Setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. Database Connection
def get_db_connection():
    ssl_ca_path = "/etc/ssl/certs/ca-certificates.crt"
    config = {
        "host": "gateway01.ap-northeast-1.prod.aws.tidbcloud.com",
        "port": 4000,
        "user": "wY4TUtjn1QPSpPJ.root",
        "password": "BW9DwTXG35wxrVSA",
        "database": "test",
        "ssl_verify_identity": False,
        "ssl_verify_cert": False
    }
    if os.path.exists(ssl_ca_path):
        config["ssl_ca"] = ssl_ca_path
    return mysql.connector.connect(**config)

pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")

# --- Models ---
class UserSignup(BaseModel):
    full_name: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

# UPDATE: ফোন এবং এড্রেস যোগ করা হয়েছে
class OrderModel(BaseModel):
    user_name: str
    item_name: str
    type: str
    price: int
    phone: str      # নতুন
    address: str    # নতুন

# --- API ENDPOINTS ---

@app.get("/")
def read_root():
    return {"message": "Farm Vet Backend is Running!"}

@app.post("/register")
async def register_user(user: UserSignup):
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        hashed_password = pwd_context.hash(user.password)
        cursor.execute("INSERT INTO users (full_name, email, password) VALUES (%s, %s, %s)", (user.full_name, user.email, hashed_password))
        conn.commit()
        return {"message": "Account created successfully!"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if conn: conn.close()

@app.post("/login")
async def login_user(user: UserLogin):
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM users WHERE email = %s", (user.email,))
        result = cursor.fetchone()
        if not result or not pwd_context.verify(user.password, result['password']):
            raise HTTPException(status_code=400, detail="Invalid email or password")
        return {"message": "Login successful", "user_id": result['id'], "name": result['full_name']}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if conn: conn.close()

@app.get("/doctors")
def get_doctors():
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM doctors")
        return cursor.fetchall()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if conn: conn.close()

@app.get("/medicines")
def get_medicines():
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM medicines")
        return cursor.fetchall()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if conn: conn.close()

# UPDATE: অর্ডার তৈরি করার সময় ফোন ও এড্রেস নেওয়া হচ্ছে
@app.post("/create-order")
async def create_order(order: OrderModel):
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # SQL Query আপডেট করা হয়েছে
        sql = "INSERT INTO orders (user_name, item_name, type, price, phone, address) VALUES (%s, %s, %s, %s, %s, %s)"
        val = (order.user_name, order.item_name, order.type, order.price, order.phone, order.address)
        
        cursor.execute(sql, val)
        conn.commit()
        return {"message": "Order placed successfully!"}
    except Exception as e:
        print(f"Order Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if conn: conn.close()

@app.get("/my-orders")
def get_user_orders(user_name: str):
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        sql = "SELECT * FROM orders WHERE user_name = %s ORDER BY order_date DESC"
        cursor.execute(sql, (user_name,))
        orders = cursor.fetchall()
        return orders
    except Exception as e:
        print(f"Error fetching user orders: {e}")
        raise HTTPException(status_code=500, detail="Error fetching orders")
    finally:
        if conn: conn.close()

@app.get("/dashboard-stats")
def get_dashboard_stats(user_name: str):
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        # ১. মোট অর্ডার
        cursor.execute("SELECT COUNT(*) FROM orders WHERE user_name = %s", (user_name,))
        total_orders = cursor.fetchone()[0]

        # ২. পেন্ডিং অর্ডার
        cursor.execute("SELECT COUNT(*) FROM orders WHERE user_name = %s AND status = 'Pending'", (user_name,))
        pending_orders = cursor.fetchone()[0]

        # ৩. সম্পন্ন অর্ডার
        cursor.execute("SELECT COUNT(*) FROM orders WHERE user_name = %s AND status = 'Completed'", (user_name,))
        completed_orders = cursor.fetchone()[0]

        return {
            "total": total_orders,
            "pending": pending_orders,
            "completed": completed_orders
        }

    except Exception as e:
        print(f"Error stats: {e}")
        return {"total": 0, "pending": 0, "completed": 0}
    finally:
        if conn: conn.close()