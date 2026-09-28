"use client";

import { calculateQuotation } from "../lib/hasan-quotation";

export default function Home() {
    // Memanggil fungsi perhitungan harga yang kamu buat
    // Skenario Uji A-01: Kategori A, Durasi 1 bulan
    const estimasi = calculateQuotation("A", 1); 

    return (
        <main style={{ padding: "50px", fontFamily: "sans-serif", backgroundColor: "white", color: "black", minHeight: "100vh" }}>
            <h1>Modul Quotation - Tim A (Hasan)</h1>
            
            <div style={{ marginTop: "20px", padding: "20px", border: "1px solid #ccc", borderRadius: "8px", maxWidth: "400px", backgroundColor: "#f9fbfd" }}>
                <h3 style={{ margin: "0 0 10px 0", color: "#333" }}>Estimasi Biaya All-in</h3>
                <p>Status: <strong>{estimasi.status}</strong></p>
                <p>Kategori: <strong>{estimasi.category}</strong></p>
                <p>Durasi: <strong>{estimasi.duration} Bulan</strong></p>
                
                <h2 style={{ color: "#1d4ed8", marginTop: "15px", fontSize: "24px" }}>
                    {estimasi.formattedPrice}
                </h2>
            </div>
        </main>
    );
}