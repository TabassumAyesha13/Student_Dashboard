"use client";
import React, { useEffect, useState } from 'react';

export default function Overview() {
  const [students, setStudents] = useState(null);

  useEffect(() => {
    fetch('/student_data_with_clusters.json')
      .then(r => r.json())
      .then(j => setStudents(j))
      .catch(() => fetch('/student_data.json').then(r => r.json()).then(j => setStudents(j)));
  }, []);

  if (!students) return <p style={{ marginTop: 20 }}>Loading overview...</p>;

  const avg = arr => (arr.reduce((a, b) => a + (Number(b) || 0), 0) / (arr.length || 1));

  const averages = {
    assessment: avg(students.map(s => s.assessment_score || 0)).toFixed(2),
    comprehension: avg(students.map(s => s.comprehension || 0)).toFixed(2),
    attention: avg(students.map(s => s.attention || 0)).toFixed(2),
    focus: avg(students.map(s => s.focus || 0)).toFixed(2),
    retention: avg(students.map(s => s.retention || 0)).toFixed(2),
  };

  const cardStyle = { padding: 14, borderRadius: 10, background: '#ffffff', border: '1px solid #eef2f7', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' };

  return (
    <section style={{ marginTop: 18, display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0,1fr))', gap: 12 }}>
      {Object.entries(averages).map(([k, v]) => (
        <div key={k} style={cardStyle}>
          <h4 style={{ margin: '0 0 6px 0', color: '#0f172a', textTransform: 'capitalize' }}>Avg {k}</h4>
          <div style={{ fontSize: 22, color: '#0ea5e9' }}>{v}</div>
        </div>
      ))}
    </section>
  );
}
