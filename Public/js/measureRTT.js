async function measureRTT() {
    // Måler RTT ved at sende en forespørgsel og registrere tiden
    const start = Date.now();
    await fetch('https://www.joejuicecompetition.live'); 
    const end = Date.now();
    return end - start;
}

async function measureAverageRTT() {
    const attempts = 5; // Antal forsøg for at beregne gennemsnitlig RTT
    let totalRTT = 0;

    for (let i = 0; i < attempts; i++) {
        const rtt = await measureRTT();
        console.log(`RTT ${i + 1}: ${rtt} ms`); // Logger RTT for hvert forsøg
        totalRTT += rtt;
    }

    const averageRTT = totalRTT / attempts; // Beregner gennemsnitlig RTT
    console.log(`Gennemsnitlig RTT: ${averageRTT.toFixed(2)} ms`);
}

// Starter måling af gennemsnitlig RTT
measureAverageRTT();
