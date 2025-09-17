"use client";
import React, { useEffect, useState } from "react";

export default function StudentTable({ onSelectStudent }) {
	const [students, setStudents] = useState([]);
	const [search, setSearch] = useState("");
	const [sortKey, setSortKey] = useState("student_id");
	const [sortDir, setSortDir] = useState("asc"); // 'asc' | 'desc'
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(20);

	useEffect(() => {
		fetch("/student_data.json")
			.then((r) => r.json())
			.then((j) => setStudents(j));
	}, []);

	const trimmed = search.trim();
	const isNumericSearch = /^\d+$/.test(trimmed);

	const filtered = students.filter((s) => {
		if (isNumericSearch) {
			return String(s.student_id) === trimmed; // exact id match
		}
		const nameMatch = s.name.toLowerCase().includes(trimmed.toLowerCase());
		const idSubstringMatch = String(s.student_id).includes(trimmed);
		return nameMatch || idSubstringMatch;
	});

	function sortRows(rows) {
		const sorted = [...rows].sort((a, b) => {
			const aVal = a[sortKey];
			const bVal = b[sortKey];
			if (typeof aVal === "number" && typeof bVal === "number") {
				return sortDir === "asc" ? aVal - bVal : bVal - aVal;
			}
			const aStr = String(aVal).toLowerCase();
			const bStr = String(bVal).toLowerCase();
			if (aStr < bStr) return sortDir === "asc" ? -1 : 1;
			if (aStr > bStr) return sortDir === "asc" ? 1 : -1;
			return 0;
		});
		return sorted;
	}

	function onSort(key) {
		if (key === sortKey) {
			setSortDir((d) => (d === "asc" ? "desc" : "asc"));
		} else {
			setSortKey(key);
			setSortDir("asc");
		}
	}

	// Reset to first page on new search or page size change
	useEffect(() => {
		setPage(1);
	}, [search, pageSize]);

	const sorted = sortRows(filtered);
	const total = sorted.length;
	const totalPages = Math.max(1, Math.ceil(total / pageSize));
	const currentPage = Math.min(page, totalPages);
	const start = (currentPage - 1) * pageSize;
	const end = start + pageSize;
	const visibleRows = sorted.slice(start, end);

	const thStyle = { textAlign: "left", borderBottom: "1px solid #e5e7eb", padding: 10, cursor: "pointer", userSelect: "none" };
	const sortIndicator = (key) => (sortKey === key ? (sortDir === "asc" ? " ▲" : " ▼") : "");

	return (
		<section style={{ marginTop: 30 }}>
			<h3 style={{ marginBottom: 10 }}>Student Data</h3>
			<div style={{ background: "#fff", padding: 12, borderRadius: 10, boxShadow: "0 4px 12px rgba(0,0,0,0.06)", border: "1px solid #eef2f7" }}>
				<input
					suppressHydrationWarning
					placeholder={isNumericSearch ? "Search ID (exact match)" : "Search by name or ID..."}
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					style={{ padding: 8, marginBottom: 12, width: "100%", border: "1px solid #e5e7eb", borderRadius: 8 }}
				/>
				<div style={{ overflowX: "auto" }}>
					<table
						style={{
							width: "100%",
							borderCollapse: "separate",
							borderSpacing: 0,
							background: "#fff",
							borderRadius: 8,
							overflow: "hidden",
						}}
					>
						<thead>
							<tr style={{ background: "#f8fafc", color: "#0f172a" }}>
								<th style={thStyle} onClick={() => onSort("student_id")}>ID{sortIndicator("student_id")}</th>
								<th style={thStyle} onClick={() => onSort("name")}>Name{sortIndicator("name")}</th>
								<th style={thStyle} onClick={() => onSort("class")}>Class{sortIndicator("class")}</th>
								<th style={thStyle} onClick={() => onSort("assessment_score")}>
									Score{sortIndicator("assessment_score")}
								</th>
							</tr>
						</thead>
						<tbody>
							{visibleRows.map((s, idx) => (
								<tr
									key={s.student_id}
									style={{ background: idx % 2 === 0 ? "#ffffff" : "#fbfdff", cursor: onSelectStudent ? "pointer" : "default" }}
									onClick={() => onSelectStudent && onSelectStudent(s)}
								>
									<td style={{ borderBottom: "1px solid #f1f5f9", padding: 10 }}>{s.student_id}</td>
									<td style={{ borderBottom: "1px solid #f1f5f9", padding: 10 }}>{s.name}</td>
									<td style={{ borderBottom: "1px solid #f1f5f9", padding: 10 }}>{s.class}</td>
									<td style={{ borderBottom: "1px solid #f1f5f9", padding: 10 }}>{s.assessment_score}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
				<div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
					<div style={{ display: "flex", alignItems: "center", gap: 8 }}>
						<button
							onClick={() => setPage((p) => Math.max(1, p - 1))}
							disabled={currentPage === 1}
							style={{ background: "#e2e8f0", color: "#0f172a", border: "none", padding: "6px 10px", borderRadius: 6, cursor: currentPage === 1 ? "not-allowed" : "pointer" }}
						>
							Prev
						</button>
						<span style={{ color: "#64748b" }}>Page {currentPage} of {totalPages}</span>
						<button
							onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
							disabled={currentPage === totalPages}
							style={{ background: "#e2e8f0", color: "#0f172a", border: "none", padding: "6px 10px", borderRadius: 6, cursor: currentPage === totalPages ? "not-allowed" : "pointer" }}
						>
							Next
						</button>
					</div>
					<div style={{ display: "flex", alignItems: "center", gap: 8 }}>
						<label htmlFor="pageSize" style={{ color: "#64748b" }}>Rows per page:</label>
						<select suppressHydrationWarning id="pageSize" value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))} style={{ padding: 6, borderRadius: 6, border: "1px solid #e5e7eb" }}>
							<option value={10}>10</option>
							<option value={20}>20</option>
							<option value={50}>50</option>
							<option value={100}>100</option>
						</select>
						<small style={{ color: "#64748b" }}>
							Showing {visibleRows.length} of {total} students
						</small>
					</div>
				</div>
			</div>
		</section>
	);
}
