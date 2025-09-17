"use client";
import React, { useEffect, useState } from "react";

export default function Insights() {
	const [correlations, setCorrelations] = useState(null);
	const [featureImportance, setFeatureImportance] = useState(null);
	const [clusterCenters, setClusterCenters] = useState(null);
	const [clusterCounts, setClusterCounts] = useState(null);
	const [error, setError] = useState(null);

	useEffect(() => {
		async function load() {
			try {
				const [corrRes, featRes, centersRes, studentsRes] = await Promise.allSettled([
					fetch("/correlation_matrix.json"),
					fetch("/feature_importance.json"),
					fetch("/cluster_centers.json"),
					fetch("/student_data_with_clusters.json"),
				]);

				if (corrRes.status === "fulfilled" && corrRes.value.ok) {
					const data = await corrRes.value.json();
					setCorrelations(data);
				}

				if (featRes.status === "fulfilled" && featRes.value.ok) {
					const data = await featRes.value.json();
					setFeatureImportance(data);
				}

				if (centersRes.status === "fulfilled" && centersRes.value.ok) {
					const data = await centersRes.value.json();
					setClusterCenters(data);
				}

				if (studentsRes.status === "fulfilled" && studentsRes.value.ok) {
					const students = await studentsRes.value.json();
					const counts = students.reduce((acc, s) => {
						const key = String(s.cluster ?? "unknown");
						acc[key] = (acc[key] || 0) + 1;
						return acc;
					}, {});
					setClusterCounts(counts);
				}
			} catch (e) {
				setError("Failed to load insights data");
			}
		}
		load();
	}, []);

	const card = { padding: 12, borderRadius: 8, background: "#fff", boxShadow: "0 1px 2px rgba(0,0,0,0.04)" };
	const sectionTitle = { margin: "0 0 8px 0", fontSize: 18 };

	function renderTopCorrelations() {
		if (!correlations) return <p style={{ color: "#666" }}>No correlation data found.</p>;
		try {
			// correlation_matrix.json is an array of rows; pick the one where "" === "assessment_score"
			const assessmentRow = Array.isArray(correlations)
				? correlations.find(row => row[""] === "assessment_score")
				: null;
			if (!assessmentRow) return <p style={{ color: "#666" }}>Assessment score correlations not found.</p>;

			const entries = Object.entries(assessmentRow)
				.filter(([k]) => k !== "" && k !== "assessment_score" && k !== "student_id")
				.map(([k, v]) => ({ feature: k, value: Math.abs(Number(v)) }))
				.filter(e => Number.isFinite(e.value))
				.sort((a, b) => b.value - a.value)
				.slice(0, 3);

			return (
				<ul style={{ margin: 0, paddingLeft: 18 }}>
					{entries.map((e) => (
						<li key={e.feature}>
							<strong>{e.feature}</strong>: correlation {e.value.toFixed(2)}
						</li>
					))}
				</ul>
			);
		} catch (_) {
			return <p style={{ color: "#666" }}>Could not parse correlation matrix.</p>;
		}
	}

	function renderFeatureImportance() {
		if (!featureImportance) return <p style={{ color: "#666" }}>No feature importance found.</p>;
		let items = [];
		try {
			if (Array.isArray(featureImportance)) {
				items = featureImportance
					.map(d => ({ feature: d.Feature || d.feature || d.name || "feature", value: Number(d.Importance || d.importance || d.value || 0) }))
					.sort((a, b) => b.value - a.value)
					.slice(0, 3);
			} else if (typeof featureImportance === "object") {
				items = Object.entries(featureImportance)
					.map(([k, v]) => ({ feature: k, value: Number(v) }))
					.sort((a, b) => b.value - a.value)
					.slice(0, 3);
			}
		} catch (_) {}

		if (!items.length) return <p style={{ color: "#666" }}>Could not parse feature importances.</p>;

		return (
			<ul style={{ margin: 0, paddingLeft: 18 }}>
				{items.map((it, idx) => (
					<li key={`${it.feature}-${idx}`}>
						<strong>{it.feature}</strong>: importance {it.value.toFixed(2)}
					</li>
				))}
			</ul>
		);
	}

	function renderClusters() {
		const hasCenters = Array.isArray(clusterCenters) || (clusterCenters && typeof clusterCenters === "object");
		const hasCounts = clusterCounts && Object.keys(clusterCounts).length > 0;
		if (!hasCenters && !hasCounts) return <p style={{ color: "#666" }}>No clustering data found.</p>;

		return (
			<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
				<div>
					<h4 style={{ margin: "0 0 6px 0" }}>Cluster Sizes</h4>
					{hasCounts ? (
						<ul style={{ margin: 0, paddingLeft: 18 }}>
							{Object.entries(clusterCounts).map(([cluster, count]) => (
								<li key={cluster}>Cluster {cluster}: {count}</li>
							))}
						</ul>
					) : (
						<p style={{ color: "#666" }}>Cluster counts unavailable.</p>
					)}
				</div>
				<div>
					<h4 style={{ margin: "0 0 6px 0" }}>Cluster Centers (preview)</h4>
					{hasCenters ? (
						<pre style={{ margin: 0, background: "#f7f7f7", padding: 10, borderRadius: 6, overflowX: "auto" }}>
							{JSON.stringify(clusterCenters, null, 2).slice(0, 400)}{JSON.stringify(clusterCenters, null, 2).length > 400 ? "…" : ""}
						</pre>
					) : (
						<p style={{ color: "#666" }}>Cluster centers unavailable.</p>
					)}
				</div>
			</div>
		);
	}

	return (
		<section style={{ marginTop: 30, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
			<div style={card}>
				<h3 style={sectionTitle}>Key Correlations</h3>
				{renderTopCorrelations()}
			</div>
			<div style={card}>
				<h3 style={sectionTitle}>Top Predictors</h3>
				{renderFeatureImportance()}
			</div>
			<div style={card}>
				<h3 style={sectionTitle}>Learning Personas</h3>
				{renderClusters()}
			</div>
			{error && (
				<div style={{ gridColumn: "1 / span 3", color: "#b91c1c" }}>Error: {error}</div>
			)}
		</section>
	);
}
