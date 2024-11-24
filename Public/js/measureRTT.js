async function measureRTT() {
    const start = Date.now();
    await fetch('http://164.92.247.82//static'); // Skift til det faktiske endpoint
    const end = Date.now();
    return end - start;
}

async function measureAverageRTT() {
    const attempts = 5;
    let totalRTT = 0;

    for (let i = 0; i < attempts; i++) {
        const rtt = await measureRTT();
        console.log(`RTT ${i + 1}: ${rtt} ms`);
        totalRTT += rtt;
    }

    const averageRTT = totalRTT / attempts;
    console.log(`Gennemsnitlig RTT: ${averageRTT.toFixed(2)} ms`);
}

measureAverageRTT();
