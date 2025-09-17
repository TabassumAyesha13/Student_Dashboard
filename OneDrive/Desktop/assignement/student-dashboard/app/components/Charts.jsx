"use client";
import React, { useEffect, useMemo, useState } from "react";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
} from "recharts";
import { ScatterChart, Scatter } from "recharts";
import {
	RadarChart,
	PolarGrid,
	PolarAngleAxis,
	PolarRadiusAxis,
	Radar,
} from "recharts";

export default function Charts({ selectedStudent }) {
	const [students, setStudents] = useState([]);
	const [barSkill, setBarSkill] = useState("comprehension");

	useEffect(() => {
		fetch("/student_data.json")
			.then((r) => r.json())
			.then((j) => setStudents(j));
	}, []);

	const skills = ["comprehension", "attention", "focus", "retention", "engagement_time"];

	const isLoading = students.length === 0;

	const barData = useMemo(
		() =>
			students.map((s) => ({
				name: s.name,
				value: Number(s[barSkill]) || 0,
				score: s.assessment_score,
			})),
		[students, barSkill]
	);

	const scatterData = students.map((s) => ({
		x: s.attention,
		y: s.assessment_score,
		name: s.name,
	}));

	const radarStudent = selectedStudent || students[0] || {};
	const radarData = [
		{ skill: "Comprehension", value: radarStudent.comprehension || 0 },
		{ skill: "Attention", value: radarStudent.attention || 0 },
		{ skill: "Focus", value: radarStudent.focus || 0 },
		{ skill: "Retention", value: radarStudent.retention || 0 },
		{ skill: "Engagement", value: radarStudent.engagement_time || 0 },
	];

	return (
		<section style={{ marginTop: 30, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
			<div style={{ background: "#fff", padding: 12, borderRadius: 10, boxShadow: "0 4px 12px rgba(0,0,0,0.06)", border: "1px solid #eef2f7" }}>
				<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
					<h3 style={{ margin: 0 }}>Skill vs Score</h3>
					<select suppressHydrationWarning value={barSkill} onChange={(e) => setBarSkill(e.target.value)} style={{ padding: 6, borderRadius: 6, border: "1px solid #e5e7eb" }}>
						{skills.map((s) => (
							<option key={s} value={s}>
								{s}
							</option>
						))}
					</select>
				</div>
				{isLoading ? (
					<p style={{ margin: 0, color: "#64748b" }}>Loading…</p>
				) : (
					<BarChart width={400} height={250} data={barData}>
						<CartesianGrid strokeDasharray="3 3" />
						<XAxis dataKey="name" hide />
						<YAxis />
						<Tooltip />
						<Bar dataKey="value" name={barSkill} fill="#8884d8" />
						<Bar dataKey="score" name="score" fill="#82ca9d" />
					</BarChart>
				)}
			</div>

			<div style={{ background: "#fff", padding: 12, borderRadius: 10, boxShadow: "0 4px 12px rgba(0,0,0,0.06)", border: "1px solid #eef2f7" }}>
				<h3 style={{ marginBottom: 6 }}>Attention vs Score</h3>
				{isLoading ? (
					<p style={{ margin: 0, color: "#64748b" }}>Loading…</p>
				) : (
					<ScatterChart width={400} height={250}>
						<CartesianGrid />
						<XAxis type="number" dataKey="x" name="Attention" />
						<YAxis type="number" dataKey="y" name="Score" />
						<Tooltip cursor={{ strokeDasharray: "3 3" }} />
						<Scatter name="Students" data={scatterData} fill="#8884d8" />
					</ScatterChart>
				)}
			</div>

			<div style={{ background: "#fff", padding: 12, borderRadius: 10, boxShadow: "0 4px 12px rgba(0,0,0,0.06)", border: "1px solid #eef2f7", gridColumn: "1 / span 2" }}>
				<h3 style={{ marginBottom: 6 }}>Student Profile (Radar)</h3>
				{isLoading ? (
					<p style={{ margin: 0, color: "#64748b" }}>Loading…</p>
				) : (
					<RadarChart cx={200} cy={150} outerRadius={100} width={400} height={300} data={radarData}>
						<PolarGrid />
						<PolarAngleAxis dataKey="skill" />
						<PolarRadiusAxis />
						<Radar
							name={radarStudent.name || "Student"}
							dataKey="value"
							stroke="#8884d8"
							fill="#8884d8"
							fillOpacity={0.6}
						/>
					</RadarChart>
				)}
			</div>
		</section>
	);
}
