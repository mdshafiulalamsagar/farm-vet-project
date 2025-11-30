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

# 2. Database Connection (TiDB Cloud)
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

# 3. Password Hashing Setup
pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")

# 4. Data Models
class UserSignup(BaseModel):
    full_name: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

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
        
        sql = "INSERT INTO users (full_name, email, password) VALUES (%s, %s, %s)"
        val = (user.full_name, user.email, hashed_password)
        
        cursor.execute(sql, val)
        conn.commit()
        
        return {"message": "Account created successfully!"}
        
    except mysql.connector.Error as err:
        if err.errno == 1062:
            raise HTTPException(status_code=400, detail="Email already exists")
        else:
            print(f"Error: {err}")
            raise HTTPException(status_code=500, detail=str(err))
    finally:
        if conn and conn.is_connected():
            cursor.close()
            conn.close()

@app.post("/login")
async def login_user(user: UserLogin):
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        cursor.execute("SELECT * FROM users WHERE email = %s", (user.email,))
        result = cursor.fetchone()
        
        if not result:
            raise HTTPException(status_code=400, detail="Invalid email or password")
            
        if not pwd_context.verify(user.password, result['password']):
            raise HTTPException(status_code=400, detail="Invalid email or password")
            
        return {"message": "Login successful", "user_id": result['id'], "name": result['full_name']}
        
    except Exception as e:
        print(f"Login Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if conn and conn.is_connected():
            cursor.close()
            conn.close()