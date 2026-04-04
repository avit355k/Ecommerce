# 🛒 Click-and-Collect E-commerce Platform  

A full-stack **MERN (MongoDB, Express.js, React, Node.js)** based e-commerce application that provides a seamless shopping experience with modern UI and secure online payments.  

This project is designed to replicate real-world e-commerce functionalities with scalability and performance in mind.  

---

## 🚀 Live Demo  
🔗 https://click-and-collect-ecommerce.vercel.app/  

---

## 📂 GitHub Repository  
💻 https://github.com/avit355k/Ecommerce  

---

## ✨ Features  

- 🛍️ Multi-type product management  
- 🔍 Product browsing and searching  
- 🛒 Add to cart & checkout system  
- 📦 Click-and-Collect functionality  
- 💳 Secure payment integration using Razorpay  
- 📱 Fully responsive design  
- 🔐 User authentication & authorization  
- ⚡ Fast and dynamic UI with React  

---

## 🧑‍💻 Tech Stack  

**Frontend:**  
- React.js  
- HTML5  
- CSS3  
- JavaScript  

**Backend:**  
- Node.js  
- Express.js  

**Database:**  
- MongoDB  

**Other Tools & Services:**  
- Razorpay (Payment Gateway)  
- Git & GitHub  
- Vercel (Deployment)  

---

## 📸 Screenshots  

<!-- Add your project screenshots here -->
<!-- Example:

--><img width="1362" height="593" alt="Screenshot 2026-03-27 232530" src="https://github.com/user-attachments/assets/1198559a-9cfb-40b0-b6ea-e6019d92f01b" />
---
<img width="1355" height="590" alt="Screenshot 2026-03-27 232545" src="https://github.com/user-attachments/assets/61e90420-de66-487f-95ca-eeb8c1817dce" />
---
<img width="1353" height="596" alt="Screenshot 2026-03-27 232607" src="https://github.com/user-attachments/assets/507e228c-8a08-471e-8760-82641838a2b0" />


---

## ⚙️ Installation & Setup  

Follow these steps to run the project locally:  

```bash
# Clone the repository
git clone https://github.com/avit355k/Ecommerce.git

# Navigate to project folder
cd Ecommerce

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

#Create a .env file in the **backend** folder and add:
# .env
PORT=5000
CONNECTION_STRING=your_mongodb_connection_string

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=cloudinary api key
CLOUDINARY_API_SECRET=cloudinary api secret
RAZORPAY_KEY_ID=razorpay id
RAZORPAY_SECRET=razorpay secret
Jwt_key=your secret key

#Create a .env file in the **frontend** folder and add:
# .env

REACT_APP_BACKEND_API_URL=localhost:
REACT_APP_RAZORPAY_KEY=

REACT_APP_FIREBASE_API_KEY=
REACT_APP_FIREBASE_AUTH_DOMAIN=
REACT_APP_FIREBASE_PROJECT_ID=
REACT_APP_FIREBASE_STORAGE_BUCKET=
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=
REACT_APP_FIREBASE_APP_ID=
---
```bash
#Run The Project
# Run backend
cd backend
nodemon server.js

# Run frontend
cd frontend
npm start
