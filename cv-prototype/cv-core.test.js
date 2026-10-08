const assert = require('assert');
const {
    distanceToTemplate2,
    rotateUpright,
    mirrorPts,
    sudutJari,
    jarakSudut
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

// (e) sudutJari: dua array identik → jarakSudut = 0
{
    // Buat worldLm dummy: 21 titik dengan x, y, z
    const wlm = [];
    for (let i = 0; i < 21; i++) {
        wlm.push({ x: i * 0.01, y: i * 0.02, z: i * 0.005 });
    }
    // Pastikan titik 5-8, 9-12, 13-16, 17-20 tidak collinear dengan menyimpangkan posisi
    wlm[6]  = { x: 0.05 + 0.02, y: 0.12 - 0.03, z: 0.01 };
    wlm[10] = { x: 0.09 + 0.02, y: 0.20 - 0.03, z: 0.02 };
    wlm[14] = { x: 0.13 + 0.02, y: 0.28 - 0.03, z: 0.03 };
    wlm[18] = { x: 0.17 + 0.02, y: 0.36 - 0.03, z: 0.04 };

    const s1 = sudutJari(wlm);
    assert(Array.isArray(s1) && s1.length === 8, 'sudutJari harus menghasilkan array 8 elemen');
    const d = jarakSudut(s1, s1);
    assert(Math.abs(d) < 1e-9, `jarakSudut ke dirinya sendiri harus 0, didapat: ${d}`);
    console.log('✓ (e) jarakSudut ke dirinya sendiri = 0');
}

// (f) sudutJari: selisih konstan 10 derajat → jarakSudut = 10
{
    const base = [10, 20, 30, 40, 50, 60, 70, 80];
    const shifted = base.map(v => v + 10);
    const d = jarakSudut(base, shifted);
    assert(Math.abs(d - 10) < 1e-9, `jarakSudut selisih konstan 10 harus 10, didapat: ${d}`);
    console.log('✓ (f) jarakSudut selisih konstan 10 derajat = 10');
}

console.log('\nSemua pengujian lolos!');
