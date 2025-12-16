from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, EmailStr
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
    email: EmailStr
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

class UserProfileUpdate(BaseModel):
    user_id: int
    full_name: str
    phone: str
    address: str
    new_password: str = None 

# অ্যাডমিন প্যানেলের জন্য নতুন মডেল
class OrderStatusUpdate(BaseModel):
    order_id: int
    new_status: str
    admin_id: int

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
        
        # ডুপ্লিকেট ইমেইল চেক
        cursor.execute("SELECT * FROM users WHERE email = %s", (user.email,))
        if cursor.fetchone():
            raise HTTPException(status_code=400, detail="এই ইমেইল দিয়ে ইতিমধ্যে অ্যাকাউন্ট খোলা আছে।")

        hashed_password = pwd_context.hash(user.password)
        # বাই ডিফল্ট role = 'user' থাকবে (SQL টেবিলে সেট করা আছে)
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
            
        # 🔥 আপডেট: লগইন করলে এখন Role-ও রিটার্ন করবে
        return {
            "message": "Login successful", 
            "user_id": result['id'], 
            "name": result['full_name'],
            "role": result['role'] 
        }
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

@app.post("/update-profile")
async def update_profile(data: UserProfileUpdate):
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        if data.new_password and data.new_password.strip() != "":
            hashed_pw = pwd_context.hash(data.new_password)
            sql = "UPDATE users SET full_name=%s, phone=%s, address=%s, password=%s WHERE id=%s"
            val = (data.full_name, data.phone, data.address, hashed_pw, data.user_id)
        else:
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

@app.get("/get-user-profile")
def get_user_profile(user_id: int):
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT full_name, email, phone, address FROM users WHERE id = %s", (user_id,))
        user = cursor.fetchone()
        if not user:
             raise HTTPException(status_code=404, detail="User not found")
        return user
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if conn: conn.close()

# --- ADMIN PANEL APIs (শুধুমাত্র অ্যাডমিনের জন্য) ---

# ১. সব অর্ডার দেখার API (অ্যাডমিন চেক করে)
@app.get("/admin/orders")
def get_all_orders(user_id: int):
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        # আগে চেক করি ইউজার আসলেই অ্যাডমিন কি না
        cursor.execute("SELECT role FROM users WHERE id = %s", (user_id,))
        user = cursor.fetchone()

        if not user or user['role'] != 'admin':
            raise HTTPException(status_code=403, detail="অ্যাক্সেস ডিনাইড! আপনি অ্যাডমিন নন।")

        # অ্যাডমিন হলে সব অর্ডার দেখাবো (নতুন গুলো আগে)
        cursor.execute("SELECT * FROM orders ORDER BY order_date DESC")
        orders = cursor.fetchall()
        return orders

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if conn: conn.close()

# ২. অর্ডারের স্ট্যাটাস আপডেট করার API
@app.post("/admin/update-order")
def update_order_status(data: OrderStatusUpdate):
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        # অ্যাডমিন চেক
        cursor.execute("SELECT role FROM users WHERE id = %s", (data.admin_id,))
        user = cursor.fetchone()

        if not user or user['role'] != 'admin':
            raise HTTPException(status_code=403, detail="শুধুমাত্র অ্যাডমিন স্ট্যাটাস চেঞ্জ করতে পারে।")

        # স্ট্যাটাস আপডেট করা
        cursor.execute("UPDATE orders SET status = %s WHERE id = %s", (data.new_status, data.order_id))
        conn.commit()
        return {"message": "অর্ডার স্ট্যাটাস আপডেট হয়েছে!"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if conn: conn.close()