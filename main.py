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

class OrderModel(BaseModel):
    user_name: str
    item_name: str
    type: str
    price: int
    phone: str
    address: str

# UPDATE: প্রোফাইল আপডেটের জন্য নতুন মডেল
class UserProfileUpdate(BaseModel):
    user_id: int
    full_name: str
    phone: str
    address: str
    new_password: str = None # পাসওয়ার্ড অপশনাল

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

# --- অর্ডার এবং ড্যাশবোর্ড API --- (আগের মতোই)
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

@app.post("/create-order")
async def create_order(order: OrderModel):
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
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
        raise HTTPException(status_code=500, detail="Error fetching orders")
    finally:
        if conn: conn.close()

@app.get("/dashboard-stats")
def get_dashboard_stats(user_name: str):
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT COUNT(*) FROM orders WHERE user_name = %s", (user_name,))
        total = cursor.fetchone()[0]
        cursor.execute("SELECT COUNT(*) FROM orders WHERE user_name = %s AND status = 'Pending'", (user_name,))
        pending = cursor.fetchone()[0]
        cursor.execute("SELECT COUNT(*) FROM orders WHERE user_name = %s AND status = 'Completed'", (user_name,))
        completed = cursor.fetchone()[0]
        return {"total": total, "pending": pending, "completed": completed}
    except Exception:
        return {"total": 0, "pending": 0, "completed": 0}
    finally:
        if conn: conn.close()

# --- NEW: প্রোফাইল আপডেটের লজিক (পাসওয়ার্ড ফিক্স সহ) ---
@app.post("/update-profile")
async def update_profile(data: UserProfileUpdate):
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        # ১. যদি নতুন পাসওয়ার্ড থাকে, তবে সেটা হ্যাশ করবো
        if data.new_password and data.new_password.strip() != "":
            hashed_pw = pwd_context.hash(data.new_password)
            sql = "UPDATE users SET full_name=%s, phone=%s, address=%s, password=%s WHERE id=%s"
            val = (data.full_name, data.phone, data.address, hashed_pw, data.user_id)
        else:
            # ২. পাসওয়ার্ড না থাকলে শুধু বাকি তথ্য আপডেট করবো
            sql = "UPDATE users SET full_name=%s, phone=%s, address=%s WHERE id=%s"
            val = (data.full_name, data.phone, data.address, data.user_id)

        cursor.execute(sql, val)
        conn.commit()
        return {"message": "Profile updated successfully"}
    except Exception as e:
        print(f"Update Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if conn: conn.close()

# --- NEW: ইউজারের তথ্য আনার API (অটো-ফিল করার জন্য) ---
@app.get("/get-user-profile")
def get_user_profile(user_id: int):
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        # পাসওয়ার্ড বাদে বাকি সব তথ্য পাঠাবো
        cursor.execute("SELECT full_name, email, phone, address FROM users WHERE id = %s", (user_id,))
        user = cursor.fetchone()
        if not user:
             raise HTTPException(status_code=404, detail="User not found")
        return user
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if conn: conn.close()