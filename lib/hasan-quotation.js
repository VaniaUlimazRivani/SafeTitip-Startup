export function calculateQuotation(category, durationInMonths) {
    const pricingTable = {
        "A": { 1: 199000, 2: 379000, 3: 499000 },
        "B": { 1: 299000, 2: 499000, 3: 699000 }
    };

    if (!category || !durationInMonths) {
        return { status: "IDLE", message: "Lengkapi data barang dan durasi untuk melihat harga." };
    }

    if (category === "CUSTOM_NEGO" || category === "NEEDS_VERIFICATION") {
        return { status: "PENDING", message: "Barang butuh penanganan khusus. Harga dinegosiasikan via Admin." };
    }

    if (!pricingTable[category] || !pricingTable[category][durationInMonths]) {
        return { status: "ERROR", message: "Kategori atau durasi tidak valid." };
    }

    return {
        status: "SUCCESS",
        category: category,
        duration: durationInMonths,
        price: pricingTable[category][durationInMonths],
        formattedPrice: `Rp ${pricingTable[category][durationInMonths].toLocaleString('id-ID')}`
    };
}