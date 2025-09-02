# 🍽️ Food Manager App

ระบบจัดการเมนูอาหารและวัตถุดิบสำหรับร้านอาหาร  
สร้างด้วย **Flask + SQLite** พร้อมฟีเจอร์คำนวณต้นทุนและกำไร

## ✨ ฟีเจอร์หลัก
- เพิ่ม / แก้ไข / ลบเมนู
- เพิ่ม / แก้ไข / ลบวัตถุดิบ
- ผูกวัตถุดิบเข้ากับเมนู
- คำนวณต้นทุนและกำไรอัตโนมัติ
- ส่งออกข้อมูลเมนูเป็น CSV
- รองรับโหมดกลางคืน (Dark Mode)
- ใช้งานได้บนมือถือ (Responsive Design)

## 🛠 เทคโนโลยีที่ใช้
- Python 3
- Flask
- SQLite
- HTML / CSS / JavaScript
- Select2 (UI dropdown)
- Service Worker + Manifest (PWA)

## 🚀 การติดตั้งและรันในเครื่อง
```bash
pip install -r requirements.txt
python app.py



---

## 2️⃣ คำสั่ง PowerShell สำหรับสร้าง README.md + init Git + commit

> ให้รันในโฟลเดอร์โปรเจกต์ `D:\FoodDeeApp\food_manager_app`

```powershell
# สร้าง README.md พร้อมเนื้อหา
@"
# 🍽️ Food Manager App

ระบบจัดการเมนูอาหารและวัตถุดิบสำหรับร้านอาหาร  
สร้างด้วย **Flask + SQLite** พร้อมฟีเจอร์คำนวณต้นทุนและกำไร

## ✨ ฟีเจอร์หลัก
- เพิ่ม / แก้ไข / ลบเมนู
- เพิ่ม / แก้ไข / ลบวัตถุดิบ
- ผูกวัตถุดิบเข้ากับเมนู
- คำนวณต้นทุนและกำไรอัตโนมัติ
- ส่งออกข้อมูลเมนูเป็น CSV
- รองรับโหมดกลางคืน (Dark Mode)
- ใช้งานได้บนมือถือ (Responsive Design)

## 🛠 เทคโนโลยีที่ใช้
- Python 3
- Flask
- SQLite
- HTML / CSS / JavaScript
- Select2 (UI dropdown)
- Service Worker + Manifest (PWA)

## 🚀 การติดตั้งและรันในเครื่อง
\`\`\`bash
pip install -r requirements.txt
python app.py
\`\`\`
เปิดเบราว์เซอร์ไปที่ \`http://localhost:5000\`

## 🌐 การ Deploy
รองรับการ Deploy บน Render, Railway, หรือ VPS พร้อม Custom Domain

## 📄 License
MIT License © 2025 https://kawkong.net
"@ | Out-File -Encoding utf8 README.md

# เริ่มต้น Git repo
git init

# เพิ่มไฟล์ทั้งหมด
git add .

# commit ครั้งแรก
git commit -m "Initial commit - Flask Food Manager App"
