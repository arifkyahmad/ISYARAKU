// Semua jarak dihitung dari 21 titik landmark (x, y). x dikali rasio layar supaya satuannya sama dengan y.
function toPts(lm, aspect) { return lm.map(p => [p.x * aspect, p.y]); }
// Normalisasi: pergelangan (titik 0) jadi titik asal, ukuran = jarak pergelangan ke pangkal jari tengah (titik 9).
function normalizePts(pts) {
    const w = pts[0];
    const s = Math.hypot(pts[9][0] - w[0], pts[9][1] - w[1]) || 1;
    return pts.map(p => [(p[0] - w[0]) / s, (p[1] - w[1]) / s]);
}
function meanDist(a, b) {
    let t = 0;
    for (let i = 0; i < a.length; i++) t += Math.hypot(a[i][0] - b[i][0], a[i][1] - b[i][1]);
    return t / a.length;
}
function distance(lmA, lmB, mode, aspect) {
    let a = toPts(lmA, aspect), b = toPts(lmB, aspect);
    if (mode === 'norm') { a = normalizePts(a); b = normalizePts(b); }
    return meanDist(a, b);
}
// Celah antara jarak benar terbesar dan jarak salah terkecil.
function gapInfo(benarMax, salahMin) {
    const gap = salahMin - benarMax;
    if (gap > 0) return { gap, mid: (benarMax + salahMin) / 2, tepat: benarMax + gap / 3, hampir: benarMax + 2 * gap / 3 };
    return { gap, mid: null, tepat: null, hampir: null };
}

// Mode 'world': normalisasi 3D dari multiHandWorldLandmarks (titik 0 jadi titik asal, skala = jarak 3D titik 0 ke 9).
function normalizeWorldPts(pts) {
    const w = pts[0];
    const wx = w.x !== undefined ? w.x : w[0];
    const wy = w.y !== undefined ? w.y : w[1];
    const wz = w.z !== undefined ? w.z : (w[2] || 0);
    const p9 = pts[9];
    const p9x = p9.x !== undefined ? p9.x : p9[0];
    const p9y = p9.y !== undefined ? p9.y : p9[1];
    const p9z = p9.z !== undefined ? p9.z : (p9[2] || 0);
    const s = Math.hypot(p9x - wx, p9y - wy, p9z - wz) || 1;
    return pts.map(p => {
        const px = p.x !== undefined ? p.x : p[0];
        const py = p.y !== undefined ? p.y : p[1];
        const pz = p.z !== undefined ? p.z : (p[2] || 0);
        return [(px - wx) / s, (py - wy) / s, (pz - wz) / s];
    });
}
function meanDist3D(a, b) {
    let t = 0;
    for (let i = 0; i < a.length; i++) {
        t += Math.hypot(a[i][0] - b[i][0], a[i][1] - b[i][1], a[i][2] - b[i][2]);
    }
    return t / a.length;
}
function distanceWorld(lmA, lmB) {
    const a = normalizeWorldPts(lmA), b = normalizeWorldPts(lmB);
    return meanDist3D(a, b);
}

// Menilai tingkat kemiripan: 'tepat' jika jarak < ambang.tepat, 'hampir' jika < ambang.hampir, selain itu 'belum'.
// Ambang dibaca dari CV_CONFIG (atau objek ambang opsional jika diberikan).
function nilaiTingkat(jarak, ambang) {
    const th = ambang || (typeof CV_CONFIG !== 'undefined' ? CV_CONFIG.ambang : null);
    if (!th || jarak == null || !isFinite(jarak)) return 'belum';
    if (jarak < th.tepat) return 'tepat';
    if (jarak < th.hampir) return 'hampir';
    return 'belum';
}

// Bayangan cermin titik (sumbu X dibalik: x * -1, y tetap).
function mirrorPts(pts) {
    return pts.map(p => {
        if (Array.isArray(p)) {
            const cp = [...p];
            cp[0] = -cp[0];
            return cp;
        }
        return { ...p, x: -p.x };
    });
}

// Putar semua titik terhadap (0,0) sehingga vektor dari titik 0 ke titik 9 mengarah lurus ke atas (x=0, y negatif).
// Jika panjang vektornya hampir 0, kembalikan pts apa adanya.
function rotateUpright(pts) {
    if (!pts || pts.length < 10) return pts;
    const v9x = pts[9][0] - pts[0][0];
    const v9y = pts[9][1] - pts[0][1];
    const len = Math.hypot(v9x, v9y);
    if (len < 1e-6) return pts;

    const cosTheta = -v9y / len;
    const sinTheta = v9x / len;

    return pts.map(p => {
        const x = p[0];
        const y = p[1];
        return [
            x * cosTheta + y * sinTheta,
            -x * sinTheta + y * cosTheta
        ];
    });
}

// Hitung jarak ke titikTemplate DAN ke mirrorPts(titikTemplate).
// Mengembalikan { jarak: nilai terkecil, cermin: true jika bayangan cermin yang lebih dekat }.
function distanceToTemplateInfo(lm, titikTemplate, aspect) {
    const live = rotateUpright(normalizePts(toPts(lm, aspect)));
    const tpl = rotateUpright(titikTemplate);
    const distAsli = meanDist(live, tpl);
    const distCermin = meanDist(live, mirrorPts(tpl));
    const cermin = distCermin < distAsli;
    return {
        jarak: cermin ? distCermin : distAsli,
        cermin
    };
}

// Hitung jarak dari landmark live (lm) ke titik template (titikTemplate) yang sudah ternormalisasi.
function distanceToTemplate(lm, titikTemplate, aspect) {
    return distanceToTemplateInfo(lm, titikTemplate, aspect).jarak;
}

// Hitung jarak untuk template 2 tangan.
// handsLive: array berisi landmark tangan yang terdeteksi secara live.
// templateA, templateB: masing-masing array 21 titik [[x, y], ...] atau titik landmark template.
// aspect: rasio aspek video/layar.
function distanceToTemplate2(handsLive, templateA, templateB, aspect) {
    if (!handsLive || !Array.isArray(handsLive) || handsLive.length < 2) {
        return { status: "tangan_kurang" };
    }

    const live1 = rotateUpright(normalizePts(toPts(handsLive[0], aspect)));
    const live2 = rotateUpright(normalizePts(toPts(handsLive[1], aspect)));
    const tplA = rotateUpright(templateA);
    const tplB = rotateUpright(templateB);
    const tplAm = mirrorPts(tplA);
    const tplBm = mirrorPts(tplB);

    // 4 kombinasi:
    // 1. (live1 -> A, live2 -> B) tanpa cermin
    const d1 = meanDist(live1, tplA) + meanDist(live2, tplB);
    // 2. (live1 -> B, live2 -> A) tanpa cermin
    const d2 = meanDist(live1, tplB) + meanDist(live2, tplA);
    // 3. (live1 -> mirror(A), live2 -> mirror(B)) kedua tangan dicermin
    const d3 = meanDist(live1, tplAm) + meanDist(live2, tplBm);
    // 4. (live1 -> mirror(B), live2 -> mirror(A)) kedua tangan dicermin
    const d4 = meanDist(live1, tplBm) + meanDist(live2, tplAm);

    const minTotal = Math.min(d1, d2, d3, d4);
    return minTotal / 2;
}

// Normalisasi berbasis lebar telapak:
// 1. Pergelangan (titik 0) jadi titik asal.
// 2. Putar titik terhadap pergelangan sampai vektor dari titik 0 ke rata-rata titik 5, 9, 13, 17 mengarah lurus ke atas.
// 3. Bagi semua titik dengan jarak titik 5 ke titik 17 (lebar telapak). Jika lebar < 1e-6, kembalikan null.
function normalizeByWidth(pts) {
    if (!pts || pts.length < 18) return null;
    const w = pts[0];
    // Geser pergelangan (titik 0) jadi titik asal
    const shifted = pts.map(p => [p[0] - w[0], p[1] - w[1]]);

    // Vektor dari titik 0 ke rata-rata titik 5, 9, 13, 17
    const vCenterX = (shifted[5][0] + shifted[9][0] + shifted[13][0] + shifted[17][0]) / 4;
    const vCenterY = (shifted[5][1] + shifted[9][1] + shifted[13][1] + shifted[17][1]) / 4;
    const lenCenter = Math.hypot(vCenterX, vCenterY);

    let rotated = shifted;
    if (lenCenter >= 1e-6) {
        // Konvensi tanda sama persis dengan rotateUpright (mengarah lurus ke atas: x=0, y negatif)
        const cosTheta = -vCenterY / lenCenter;
        const sinTheta = vCenterX / lenCenter;
        rotated = shifted.map(p => {
            const x = p[0];
            const y = p[1];
            return [
                x * cosTheta + y * sinTheta,
                -x * sinTheta + y * cosTheta
            ];
        });
    }

    // Lebar telapak = jarak titik 5 ke titik 17
    const lebar = Math.hypot(rotated[5][0] - rotated[17][0], rotated[5][1] - rotated[17][1]);
    if (lebar < 1e-6) return null;

    return rotated.map(p => [p[0] / lebar, p[1] / lebar]);
}

// Hitung jarak ke titikTemplate memakai normalisasi lebar telapak.
// Mengembalikan { jarak: nilai terkecil, cermin: boolean } sama seperti distanceToTemplateInfo.
function distanceToTemplateInfoByWidth(lm, titikTemplate, aspect) {
    const liveNorm = normalizeByWidth(toPts(lm, aspect));
    const tplNorm = normalizeByWidth(titikTemplate);

    if (!liveNorm || !tplNorm) {
        return { jarak: Infinity, cermin: false };
    }

    const distAsli = meanDist(liveNorm, tplNorm);
    const distCermin = meanDist(liveNorm, mirrorPts(tplNorm));
    const cermin = distCermin < distAsli;

    return {
        jarak: cermin ? distCermin : distAsli,
        cermin
    };
}

// Hitung 8 sudut (derajat, 3D) pada sendi jari: telunjuk, tengah, manis, kelingking.
// Triplet titik: 5-6-7, 6-7-8, 9-10-11, 10-11-12, 13-14-15, 14-15-16, 17-18-19, 18-19-20.
// worldLm: array 21 objek { x, y, z } (multiHandWorldLandmarks).
// Mengembalikan array 8 angka (derajat). Jika input tidak valid, mengembalikan null.
function sudutJari(worldLm) {
    if (!worldLm || worldLm.length < 21) return null;
    const triplets = [
        [5, 6, 7], [6, 7, 8],
        [9, 10, 11], [10, 11, 12],
        [13, 14, 15], [14, 15, 16],
        [17, 18, 19], [18, 19, 20]
    ];
    return triplets.map(([a, b, c]) => {
        const pa = worldLm[a], pb = worldLm[b], pc = worldLm[c];
        // Vektor dari titik tengah ke titik sebelum dan sesudah
        const vax = pa.x - pb.x, vay = pa.y - pb.y, vaz = pa.z - pb.z;
        const vcx = pc.x - pb.x, vcy = pc.y - pb.y, vcz = pc.z - pb.z;
        const lenA = Math.hypot(vax, vay, vaz);
        const lenC = Math.hypot(vcx, vcy, vcz);
        if (lenA < 1e-9 || lenC < 1e-9) return 0;
        // Dot product untuk cos sudut
        const dot = vax * vcx + vay * vcy + vaz * vcz;
        const cosA = Math.max(-1, Math.min(1, dot / (lenA * lenC)));
        return (Math.acos(cosA) * 180) / Math.PI;
    });
}

// Rata-rata selisih absolut (derajat) antara dua array 8 sudut.
// Mengembalikan rata-rata MAE, atau Infinity jika salah satu input null/panjangnya berbeda.
function jarakSudut(sudutLive, sudutTemplate) {
    if (!sudutLive || !sudutTemplate || sudutLive.length !== sudutTemplate.length) return Infinity;
    let total = 0;
    for (let i = 0; i < sudutLive.length; i++) {
        total += Math.abs(sudutLive[i] - sudutTemplate[i]);
    }
    return total / sudutLive.length;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        toPts,
        normalizePts,
        meanDist,
        distance,
        gapInfo,
        normalizeWorldPts,
        meanDist3D,
        distanceWorld,
        nilaiTingkat,
        mirrorPts,
        rotateUpright,
        distanceToTemplateInfo,
        distanceToTemplate,
        distanceToTemplate2,
        normalizeByWidth,
        distanceToTemplateInfoByWidth,
        sudutJari,
        jarakSudut
    };
}

