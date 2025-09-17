"use client";
import React, { useState } from "react";
import Overview from "./components/Overview";
import Charts from "./components/Charts";
import StudentTable from "./components/StudentTable";
import Insights from "./components/Insights";

export default function Page() {
	const [selectedStudent, setSelectedStudent] = useState(null);
	return (
		<main style={{ padding: 20, maxWidth: 1100, margin: "0 auto" }}>
			<h1 style={{ margin: 0, fontSize: 26 }}>📊 Student Performance Dashboard</h1>
			<p style={{ color: "#555" }}>
				Minimal dashboard with overview, charts, table and quick insights.
			</p>

			<Overview />
			<Charts selectedStudent={selectedStudent} />
			<StudentTable onSelectStudent={setSelectedStudent} />
			<Insights />

			<footer style={{ marginTop: 30, color: "#777" }}>
				
			</footer>
		</main>
	);
}
