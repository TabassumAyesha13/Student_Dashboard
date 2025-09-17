# Cognitive Skills & Student Performance Dashboard

A web-based dashboard that analyzes the relationship between students' cognitive skills and their academic performance. It leverages machine learning to predict assessment scores, identifies key contributing skills, and clusters students into learning personas.

This project uses **Next.js** for the frontend dashboard and **Python (Jupyter Notebook)** for data analysis and modeling.

---

## 📂 Features

### ✅ Data Analysis
- Correlation analysis between cognitive skills and assessment scores.
- Feature importance to identify key predictors for performance.
- Clustering students into learning personas based on cognitive traits.

### ✅ Dashboard (Next.js)
- Overview of total students, average scores, and engagement metrics.
- Interactive tables with search and sort functionalities.
- Visualizations like bar charts, scatter plots, and radar charts.
- Insights section summarizing key findings from the data analysis.

### ✅ Machine Learning
- Simple regression model to predict student performance.
- Clustering using KMeans to categorize students into personas.

---

## 📦 Tech Stack

- **Next.js** – Frontend framework with React and Tailwind CSS for styling.
- **React Chart.js / Chart.js** – For creating charts and data visualizations.
- **Python (Jupyter Notebook)** – For data analysis and ML modeling.
- **scikit-learn** – For regression and clustering algorithms.

---

## 🚀 Demo

Check out the live demo here:  
**[Vercel Deployment Link](https://student-dashboard-delta-five.vercel.app/)**
**[Email](kjtayesha13@gmail.com)**
---

## 📂 Dataset

A synthetic dataset was used with the following fields:

- `student_id`, `name`, `class`, `comprehension`, `attention`, `focus`, `retention`, `assessment_score`, `engagement_time`

The dataset is stored in `public/data/student_data_with_clusters.json`.

---

## 🛠 Setup Instructions

### 1️⃣ Clone the repository

```bash
git clone https://github.com/your-username/cognitive-dashboard.git
cd cognitive-dashboard
