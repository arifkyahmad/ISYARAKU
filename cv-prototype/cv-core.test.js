const assert = require('assert');
const {
    distanceToTemplate2,
    rotateUpright,
    mirrorPts
} = require('./cv-core.js');

// Helper untuk membuat 21 titik dummy yang valid (panjang vektor 0->9 > 0)
function createDummyHand(offsetX = 0, offsetY = 0) {
    const pts = [];
    for (let i = 0; i < 21; i++) {
        // Berikan variasi posisi agar bentuk tangan realistis dan tidak simetris sempurna
        pts.push({
            x: offsetX + 0.1 + (i * 0.015),
            y: offsetY + 0.2 + (i * 0.02)
        });
    }
    // Pastikan titik 9 berbeda dengan titik 0 (vektor arah tegak)
    pts[9] = { x: offsetX + 0.15, y: offsetY + 0.05 };
    return pts;
}

// Aspect ratio pengujian
const aspect = 1.0;

// Buat 2 tangan live dan bentuk template yang cocok
const liveA = createDummyHand(0.1, 0.2);
const liveB = createDummyHand(0.5, 0.3);

// Template format: titik [x, y] yang sudah ternormalisasi (seperti dari database/rekam-template)
// Menggunakan helper dari cv-core untuk merepresentasikan template yang cocok persis
const { toPts, normalizePts } = require('./cv-core.js');
const templateA = normalizePts(toPts(liveA, aspect));
const templateB = normalizePts(toPts(liveB, aspect));

console.log('Menjalankan pengujian cv-core.test.js...\n');

// (a) Jarak template ke dirinya = 0
{
    const dist = distanceToTemplate2([liveA, liveB], templateA, templateB, aspect);
    assert(typeof dist === 'number', 'Jarak harus berupa angka');
    assert(Math.abs(dist) < 1e-6, `Jarak template ke dirinya sendiri harus 0, didapat: ${dist}`);
    console.log('✓ (a) Jarak template ke dirinya sendiri = 0');
}

// (b) Tangan live ditukar urutannya tetap 0
{
    const dist = distanceToTemplate2([liveB, liveA], templateA, templateB, aspect);
    assert(typeof dist === 'number', 'Jarak harus berupa angka saat urutan ditukar');
    assert(Math.abs(dist) < 1e-6, `Jarak live ditukar urutannya harus tetap 0, didapat: ${dist}`);
    console.log('✓ (b) Tangan live ditukar urutannya tetap 0');
}

// (c) Versi cermin tetap 0 (kedua tangan live dicermin secara fisik/koordinat)
{
    // Cermin pada input live (x dibalik sebelum toPts / refleksi sumbu x)
    const liveAm = liveA.map(p => ({ x: -p.x, y: p.y }));
    const liveBm = liveB.map(p => ({ x: -p.x, y: p.y }));

    // Baik urutan liveAm, liveBm maupun liveBm, liveAm
    const distMirror1 = distanceToTemplate2([liveAm, liveBm], templateA, templateB, aspect);
    const distMirror2 = distanceToTemplate2([liveBm, liveAm], templateA, templateB, aspect);

    assert(typeof distMirror1 === 'number', 'Jarak cermin harus berupa angka');
    assert(Math.abs(distMirror1) < 1e-6, `Versi cermin harus bernilai 0, didapat: ${distMirror1}`);
    assert(Math.abs(distMirror2) < 1e-6, `Versi cermin (ditukar) harus bernilai 0, didapat: ${distMirror2}`);
    console.log('✓ (c) Versi cermin tetap 0');
}

// (d) 1 tangan live untuk template 2 tangan = tangan_kurang
{
    const res1 = distanceToTemplate2([liveA], templateA, templateB, aspect);
    assert.deepStrictEqual(res1, { status: 'tangan_kurang' }, 'Harus { status: "tangan_kurang" } jika hanya 1 tangan');

    const resEmpty = distanceToTemplate2([], templateA, templateB, aspect);
    assert.deepStrictEqual(resEmpty, { status: 'tangan_kurang' }, 'Harus { status: "tangan_kurang" } jika kosong');

    const resNull = distanceToTemplate2(null, templateA, templateB, aspect);
    assert.deepStrictEqual(resNull, { status: 'tangan_kurang' }, 'Harus { status: "tangan_kurang" } jika null');
    console.log('✓ (d) 1 tangan live untuk template 2 tangan = { status: "tangan_kurang" }');
}

console.log('\nSemua pengujian lolos!');
